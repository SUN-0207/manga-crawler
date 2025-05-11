export interface MangaItem {
  imageItem: {
    link: string;
    image: string;
    title: string;
    infoManga: {
      eye: string;
      comment: string;
      heart: string;
    };
  };
  mangaInformation: {
    title: string;
    image: string;
    synopsis: {
      genres: string[];
      view: string;
      status: string;
      comment: string;
      subscriber: string;
      like: string;
      updateTime: string;
    };
  };
  contentManga: string;
  detail?: DetailItem;
}

export interface DetailItem {
  titleManga: string;
  timeUpdate: string;
  overViewComic: {
    imageInfo: string;
    infoDetailComic: {
      nameOther: string;
      author: string;
      status: string;
      category: string[];
      translateGroup: string;
      viewTotal: string;
      viewLike: string;
      totalFollow: string;
    };
  };
  chapters: Chapter[];
}

export interface Chapter {
  name: string;
  link: string;
}

export interface DownloadStatus {
  mangaTitle: string;
  chapterName: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}

export interface QueueItem {
  mangaUrl: string;
  mangaTitle: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  chapters: {
    name: string;
    status: 'pending' | 'downloading' | 'completed' | 'error';
    progress: number;
  }[];
} 