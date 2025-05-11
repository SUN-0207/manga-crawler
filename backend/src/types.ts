interface InfoManga {
  eye: string;
  comment: string;
  heart: string;
}

interface ImageItem {
  link: string;
  image: string;
  title: string;
  infoManga: InfoManga;
}

interface Synopsis {
  genres: string[];
  view: string;
  status: string;
  comment: string;
  subscriber: string;
  like: string;
  updateTime: string;
}

interface MangaInformation {
  title: string;
  image: string;
  synopsis: Synopsis;
}

interface InfoDetailComic {
  nameOther: string;
  author: string;
  status: string;
  category: string[];
  translateGroup: string;
  viewTotal: string;
  viewLike: string;
  totalFollow: string;
}

interface OverViewComic {
  imageInfo: string;
  infoDetailComic: InfoDetailComic;
}

interface Chapter {
  name: string;
  link: string;
}

interface DetailItem {
  titleManga: string;
  timeUpdate: string;
  overViewComic: OverViewComic;
  chapters: Chapter[];
}

interface MangaItem {
  imageItem: ImageItem;
  mangaInformation: MangaInformation;
  contentManga: string;
  detail?: DetailItem;
}

interface ImageData {
  alt: string;
  src: string;
  dataIndex: string;
}

export type {
  InfoManga,
  ImageItem,
  Synopsis,
  MangaInformation,
  InfoDetailComic,
  OverViewComic,
  Chapter,
  DetailItem,
  MangaItem,
  ImageData
}; 