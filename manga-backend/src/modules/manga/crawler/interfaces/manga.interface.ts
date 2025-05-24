export interface InfoManga {
  eye: string;
  comment: string;
  heart: string;
}

export interface ImageItem {
  link: string;
  image: string;
  title: string;
  infoManga: InfoManga;
}

export interface Synopsis {
  genres: string[];
  view: string;
  status: string;
  comment: string;
  subscriber: string;
  like: string;
  updateTime: string;
}

export interface MangaInformation {
  title: string;
  image: string;
  synopsis: Synopsis;
}

export interface InfoDetailComic {
  nameOther: string;
  author: string;
  status: string;
  category: string[];
  translateGroup: string;
  viewTotal: string;
  viewLike: string;
  totalFollow: string;
}

export interface OverViewComic {
  imageInfo: string;
  infoDetailComic: InfoDetailComic;
}

export interface Chapter {
  name: string;
  link: string;
}

export interface DetailItem {
  titleManga: string;
  timeUpdate: string;
  overViewComic: OverViewComic;
  chapters: Chapter[];
}

export interface MangaItem {
  imageItem: ImageItem;
  mangaInformation: MangaInformation;
  contentManga: string;
  detail?: DetailItem;
}

export interface ImageData {
  alt: string;
  src: string;
  dataIndex: string;
} 