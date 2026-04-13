import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBoardListPaging } from '../api/boardApi';
import type { Board, BoardPageData } from '../types/Board';
import Pagination from './Pagination';
import './BoardList.css';

const BoardList: React.FC = () => {
  const [pageNum, setPageNum] = useState(1);
  const [data, setData] = useState<BoardPageData>({
    list: [],
    total: 0,
    pageMaker: {
      startPage: 1,
      endPage: 1,
      prev: false,
      next: false,
      cri: { pageNum: 1, amount: 10 },
    },
  });

  useEffect(() => {
    getBoardListPaging(pageNum, 10)
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [pageNum]);

  const list: Board[] = data.list;

  return (
    <div className="list-container">
      <h2 className="list-title">게시글 목록</h2>
      <p className="list-total">전체 {data.total}건</p>

      <table className="board-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>번호</th>
            <th style={{ width: '55%' }}>제목</th>
            <th style={{ width: '15%' }}>작성자</th>
            <th style={{ width: '20%' }}>조회수</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((board) => (
              <tr key={board.boardId}>
                <td>{board.boardId}</td>
                <td style={{ textAlign: 'left' }}>
                  <Link className="title-link" to={`/board/${board.boardId}`}>
                    {board.title}
                  </Link>
                </td>
                <td>{board.creatorId}</td>
                <td>{board.hitCnt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>게시글이 존재하지 않습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {data.pageMaker && (
        <Pagination pageMaker={data.pageMaker} onPageChange={setPageNum} />
      )}

      <div className="btn-area">
        <Link to="/write">
          <button className="btn-write">글쓰기</button>
        </Link>
      </div>
    </div>
  );
};

export default BoardList;
