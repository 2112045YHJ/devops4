import axiosInstance from './axiosInstance';

export const getBoardList = () =>
  axiosInstance.get('/api/board/list');

export const getBoardListPaging = (pageNum: number, amount = 10) =>
  axiosInstance.get('/api/board/listPaging', { params: { pageNum, amount } });

export const getBoardDetail = (boardId: string | number) =>
  axiosInstance.get(`/api/board/detail/${boardId}`);

export const insertBoard = (formData: FormData) =>
  axiosInstance.post('/api/board/insert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBoard = (formData: FormData) =>
  axiosInstance.post('/api/board/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteBoard = (boardId: string | number) =>
  axiosInstance.delete(`/api/board/delete/${boardId}`);

export const deleteFile = (fileIdx: number) =>
  axiosInstance.delete('/api/board/deleteFile', { params: { fileIdx } });
