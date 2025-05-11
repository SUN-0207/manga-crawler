import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { MangaCrawler } from "./services/MangaCrawler";
import { QueueItem } from "../../frontend/src/types";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(express.json());

const crawler = new MangaCrawler();
const downloadQueue: QueueItem[] = [];
let isProcessing = false;

io.on("connection", (socket) => {
  console.log("Client connected");

  // Send initial queue state
  socket.emit("queueUpdate", downloadQueue);

  socket.on("fetchCurrentList", async () => {
    try {
      console.log("Fetching current manga list");
      const mangaItems = await crawler.getCurrentMangaData();
      socket.emit(
        "mangaList",
        mangaItems.map((item) => ({
          title: item.mangaInformation.title,
          url: item.imageItem.link,
        }))
      );
    } catch (error) {
      console.error("Error fetching manga list:", error);
      socket.emit("error", "Failed to fetch manga list");
    }
  });

  socket.on("fetchMangaList", async () => {
    try {
      console.log("Start craw data");
      const mangaItems = await crawler.crawlAllManga();
      socket.emit(
        "mangaList",
        mangaItems.map((item) => ({
          title: item.mangaInformation.title,
          url: item.imageItem.link,
        }))
      );
    } catch (error) {
      console.error("Error fetching manga list:", error);
      socket.emit("error", "Failed to fetch manga list");
    }
  });

  socket.on("downloadManga", async (mangaId: string) => {
    try {
      console.log(`Start download ${mangaId}`);
      await crawler.downloadSelectedManga(mangaId);
    } catch (error) {
      console.error("Error download selected manga:", error);
      socket.emit("error", "Failed to download manga");
    }
  });

  socket.on("addToQueue", async (mangaUrl: string) => {
    try {
      const detail = await crawler.getDetailItem(mangaUrl);
      const queueItem: QueueItem = {
        mangaUrl,
        mangaTitle: detail.titleManga,
        status: "pending",
        progress: 0,
        chapters: detail.chapters.map((chapter) => ({
          name: chapter.name,
          status: "pending",
          progress: 0,
        })),
      };

      downloadQueue.push(queueItem);
      io.emit("queueUpdate", downloadQueue);

      if (!isProcessing) {
        processQueue();
      }
    } catch (error) {
      console.error("Error adding to queue:", error);
      socket.emit("error", "Failed to add manga to queue");
    }
  });

  socket.on("removeFromQueue", (mangaUrl: string) => {
    const index = downloadQueue.findIndex((item) => item.mangaUrl === mangaUrl);
    if (index !== -1) {
      downloadQueue.splice(index, 1);
      io.emit("queueUpdate", downloadQueue);
    }
  });

  socket.on("pauseDownload", (mangaUrl: string) => {
    const item = downloadQueue.find((item) => item.mangaUrl === mangaUrl);
    if (item) {
      item.status = "pending";
      io.emit("queueUpdate", downloadQueue);
    }
  });

  socket.on("resumeDownload", (mangaUrl: string) => {
    const item = downloadQueue.find((item) => item.mangaUrl === mangaUrl);
    if (item) {
      item.status = "downloading";
      if (!isProcessing) {
        processQueue();
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function processQueue() {
  if (isProcessing || downloadQueue.length === 0) return;

  isProcessing = true;
  const currentItem =
    downloadQueue.find((item) => item.status === "downloading") ||
    downloadQueue[0];

  if (!currentItem) {
    isProcessing = false;
    return;
  }
  ``;
  currentItem.status = "downloading";
  io.emit("queueUpdate", downloadQueue);

  try {
    await crawler.downloadSelectedManga(currentItem.mangaUrl);
    currentItem.status = "completed";
    currentItem.progress = 100;
  } catch (error) {
    currentItem.status = "error";
    console.error("Error processing manga:", error);
  }

  io.emit("queueUpdate", downloadQueue);
  isProcessing = false;
  processQueue(); // Process next item
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
