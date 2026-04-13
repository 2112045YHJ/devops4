import React from 'react';
import type { PageMaker } from '../types/Board';
import './Pagination.css';

interface PaginationProps {
  pageMaker: PageMaker;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageMaker, onPageChange }) => {
  const pages = Array.from(
    { length: pageMaker.endPage - pageMaker.startPage + 1 },
    (_, i) => pageMaker.startPage + i
  );

  return (
    <div className="pagination">
      {pageMaker.prev && (
        <button
          className="page-btn"
          onClick={() => onPageChange(pageMaker.startPage - 1)}
        >
          &laquo; 이전
        </button>
      )}

      {pages.map((num) => (
        <button
          key={num}
          className={`page-btn ${pageMaker.cri.pageNum === num ? 'active' : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      {pageMaker.next && (
        <button
          className="page-btn"
          onClick={() => onPageChange(pageMaker.endPage + 1)}
        >
          다음 &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;
