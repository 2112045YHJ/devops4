import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoardDetail, updateBoard, deleteBoard, deleteFile } from '../api/boardApi';
import type { Board, BoardFile } from '../types/Board';
import './BoardDetail.css';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [newFiles, setNewFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!id) return;
    getBoardDetail(id)
      .then((res) => setBoard(res.data))
      .catch(console.error);
  }, [id]);

  const handleUpdate = async () => {
    if (!board || !id) return;

    const formData = new FormData();
    formData.append('boardId', String(board.boardId));
    formData.append('title', board.title);
    formData.append('contents', board.contents);
    formData.append('updaterId', board.creatorId); // 로그인 기능이 없으므로 creatorId 사용

    if (newFiles) {
      Array.from(newFiles).forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      await updateBoard(formData);
      alert('수정 완료');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await deleteBoard(id);
      alert('삭제 완료');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteFile = async (fileIdx: number) => {
    if (!window.confirm('파일을 삭제하시겠습니까?')) return;

    try {
      await deleteFile(fileIdx);
      setBoard((prev) =>
        prev
          ? { ...prev, fileList: prev.fileList?.filter((f: BoardFile) => f.fileIdx !== fileIdx) }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  if (!board) return <div className="detail-page">Loading...</div>;

  return (
    <div className="detail-page">
      <div className="detail-card">
        <h2>게시글 상세</h2>

        <div className="form-group">
          <label>작성자</label>
          <input
            className="input-field"
            value={board.creatorId || ''}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>제목</label>
          <input
            className="input-field"
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <textarea
            className="textarea-field"
            value={board.contents}
            onChange={(e) => setBoard({ ...board, contents: e.target.value })}
          />
        </div>

        {/* 기존 첨부파일 목록 */}
        {board.fileList && board.fileList.length > 0 && (
          <div className="form-group">
            <label>첨부파일</label>
            <ul className="file-list">
              {board.fileList.map((file: BoardFile) => (
                <li key={file.fileIdx} className="file-item">
                  <a
                    href={`http://localhost:8080/upload/${file.originalFileName}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.originalFileName}
                  </a>
                  <button
                    className="btn-file-delete"
                    onClick={() => handleDeleteFile(file.fileIdx)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 새 파일 추가 */}
        <div className="form-group">
          <label>파일 추가</label>
          <input
            type="file"
            multiple
            onChange={(e) => setNewFiles(e.target.files)}
          />
        </div>

        <div className="button-group">
          <button className="btn btn-list" onClick={() => navigate('/')}>
            목록으로
          </button>
          <button className="btn btn-update" onClick={handleUpdate}>
            수정
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
