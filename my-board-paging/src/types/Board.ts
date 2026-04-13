export interface BoardFile {
  fileIdx: number;
  boardId: number;
  originalFileName: string;
  storedFilePath: string;
  fileSize: number;
  creatorId: string;
}

export interface Board {
  boardId: number;
  title: string;
  contents: string;
  creatorId: string;
  hitCnt: number;
  createdDatetime: string;
  updatedDatetime?: string | null;
  updaterId?: string | null;
  fileList?: BoardFile[];
}

export interface PageMaker {
  startPage: number;
  endPage: number;
  prev: boolean;
  next: boolean;
  cri: {
    pageNum: number;
    amount: number;
  };
}

export interface BoardPageData {
  list: Board[];
  total: number;
  pageMaker: PageMaker;
}
