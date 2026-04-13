import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertBoard } from '../api/boardApi';
import './BoardWrite.css';

const BoardWrite: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !contents) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!creatorId) {
      alert('작성자 ID를 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('creatorId', creatorId);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      await insertBoard(formData);
      alert('글이 성공적으로 등록되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('등록 에러', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="write-page">
      <div className="write-card">
        <h2 className="write-title">새 게시글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>작성자</label>
            <input
              className="write-input"
              value={creatorId}
              onChange={(e) => setCreatorId(e.target.value)}
              placeholder="작성자 ID를 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>제목</label>
            <input
              className="write-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              className="write-textarea"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder="내용을 작성하세요"
            />
          </div>
          <div className="form-group">
            <label>첨부파일</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          <div className="write-button-group">
            <button type="submit" className="btn-submit">
              등록하기
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite;
