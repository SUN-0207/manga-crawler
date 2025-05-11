import { io, Socket } from "socket.io-client";
import { DownloadStatus, MangaItem } from "../types";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second delay
  private maxReconnectDelay = 30000; // Max 30 seconds delay

  private constructor() {
    this.initializeSocket();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private initializeSocket() {
    if (this.socket?.connected) {
      return;
    }

    try {
      this.socket = io("http://localhost:3001", {
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: this.maxReconnectDelay,
        timeout: 20000,
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("Connected to server");
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        this.handleReconnect();
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
        if (reason === "io server disconnect") {
          // Server initiated disconnect, try to reconnect
          this.socket?.connect();
        }
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 1.5,
        this.maxReconnectDelay
      );
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`
      );
      setTimeout(() => this.initializeSocket(), this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  public getSocket(): Socket | null {
    if (!this.socket?.connected) {
      this.initializeSocket();
    }
    return this.socket;
  }

  public onDownloadProgress(
    callback: (progress: DownloadStatus) => void
  ): void {
    this.socket?.on("downloadProgress", callback);
  }

  public onMangaList(
    callback: (mangaList: { title: string; url: string }[]) => void
  ): void {
    this.socket?.on("mangaList", callback);
  }

  public fetchMangaList(): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected. Attempting to reconnect...");
      this.initializeSocket();
      return;
    }
    this.socket.emit("fetchMangaList");
  }

  public fetchCurrentMangaList(): void {
    console.log("[SocketService] fetchCurrentMangaList called");

    if (!this.socket) {
      this.initializeSocket();
    }

    if (this.socket?.connected) {
      console.log(
        "[SocketService] Socket already connected, emitting fetchCurrentList"
      );
      this.socket.emit("fetchCurrentList");
    } else {
      console.log(
        "[SocketService] Socket not connected yet. Waiting for connect..."
      );
      this.socket?.once("connect", () => {
        console.log(
          "[SocketService] Socket connected! Emitting fetchCurrentList"
        );
        this.socket?.emit("fetchCurrentList");
      });
    }
  }

  public downloadManga(mangaId: string): void {
    if (!this.socket?.connected) {
      console.error("Socket not connected. Attempting to reconnect...");
      this.initializeSocket();
      return;
    }
    this.socket.emit("downloadManga", mangaId);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketService;
