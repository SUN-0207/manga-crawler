import { useState, useEffect, useCallback } from "react";
import { DownloadStatus } from "../types";
import SocketService from "../services/socketService";

const socketService = SocketService.getInstance();

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [mangaList, setMangaList] = useState<{ title: string; url: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadStatus = useCallback((status: DownloadStatus) => {
    setDownloads((prev) => {
      const index = prev.findIndex(
        (d) =>
          d.mangaTitle === status.mangaTitle &&
          d.chapterName === status.chapterName
      );
      if (index === -1) {
        return [...prev, status];
      }
      const newDownloads = [...prev];
      newDownloads[index] = status;
      return newDownloads;
    });
  }, []);

  const handleMangaList = useCallback(
    (list: { title: string; url: string }[]) => {
      setMangaList(list);
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    // Trigger socket connection on startup
    socketService.getSocket();
    // Set up socket event listeners
    socketService.onDownloadProgress(handleDownloadStatus);
    socketService.onMangaList(handleMangaList);

    socketService.fetchCurrentMangaList();
    // Cleanup function
    return () => {
      socketService.disconnect();
    };
  }, [handleDownloadStatus, handleMangaList]);

  const handleFetchMangaList = useCallback(() => {
    setIsLoading(true);
    setError(null);
    socketService.fetchMangaList();
  }, []);

  const handleDownloadManga = useCallback((mangaId: string) => {
    socketService.downloadManga(mangaId);
  }, []);

  return {
    downloads,
    mangaList,
    error,
    isLoading,
    handleFetchMangaList,
    handleDownloadManga,
  };
};
