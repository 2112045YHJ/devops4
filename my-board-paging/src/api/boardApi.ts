import axiosInstance from './axiosInstance';

export const getBoardList = () =>
  axiosInstance.get('/list');

export const getBoardListPaging = (pageNum: number, amount = 10) =>
  axiosInstance.get('/listPaging', { params: { pageNum, amount } });

export const getBoardDetail = (boardId: string | number) =>
  axiosInstance.get(`/detail/${boardId}`);

export const insertBoard = (formData: FormData) =>
  axiosInstance.post('/insert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBoard = (formData: FormData) =>
  axiosInstance.post('/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteBoard = (boardId: string | number) =>
  axiosInstance.delete(`/delete/${boardId}`);

export const deleteFile = (fileIdx: number) =>
  axiosInstance.delete('/deleteFile', { params: { fileIdx } });
