# React 프론트엔드 개발 가이드
> Spring Boot 백엔드(spring0413) 연동 문서

---

## 1. 환경 설정

### 백엔드 서버 정보
| 항목 | 값 |
|------|-----|
| 백엔드 주소 | `http://localhost:8080` |
| CORS 허용 주소 | `http://localhost:5173` (Vite 기본 포트) |
| DB | MySQL — `cloud` 스키마 |

> [!IMPORTANT]
> React 프로젝트는 반드시 포트 **5173**에서 실행해야 CORS 오류가 없습니다.
> Vite 기본 설정이면 `npm run dev`로 자동 적용됩니다.

### Axios 설치 및 기본 설정

```bash
npm install axios
```

`src/api/axiosInstance.js` 파일을 생성하세요.

```js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

---

## 2. API 목록

### 기본 URL: `http://localhost:8080/api/board`

| 기능 | 메서드 | URL | Content-Type |
|------|--------|-----|--------------|
| 전체 목록 조회 | `GET` | `/api/board/list` | - |
| 페이징 목록 조회 | `GET` | `/api/board/listPaging` | - |
| 상세 조회 | `GET` | `/api/board/detail/{boardId}` | - |
| 게시글 등록 | `POST` | `/api/board/insert` | `multipart/form-data` |
| 게시글 수정 | `POST` | `/api/board/update` | `multipart/form-data` |
| 게시글 삭제 | `DELETE` | `/api/board/delete/{boardId}` | - |
| 첨부파일 삭제 | `DELETE` | `/api/board/deleteFile?fileIdx={fileIdx}` | - |

---

## 3. API 상세 명세 및 예제 코드

### 3-1. 전체 목록 조회

**Request**
```
GET /api/board/list
```

**Response** (Array)
```json
[
  {
    "boardId": 1,
    "title": "공지사항입니다",
    "hitCnt": 10,
    "creatorId": "admin",
    "createdDatetime": "2026-04-13 15:00:00"
  }
]
```

**React 예제**
```jsx
import axiosInstance from '../api/axiosInstance';
import { useEffect, useState } from 'react';

function BoardList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/board/list')
      .then(res => setList(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <ul>
      {list.map(board => (
        <li key={board.boardId}>{board.title}</li>
      ))}
    </ul>
  );
}
```

---

### 3-2. 페이징 목록 조회

**Request**
```
GET /api/board/listPaging?pageNum=1&amount=10
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `pageNum` | int | N (기본값: 1) | 현재 페이지 번호 |
| `amount` | int | N (기본값: 10) | 페이지당 게시글 수 |

**Response**
```json
{
  "list": [
    {
      "boardId": 5,
      "title": "테스트 게시글",
      "hitCnt": 3,
      "creatorId": "user1",
      "createdDatetime": "2026-04-13 14:00:00"
    }
  ],
  "total": 53,
  "pageMaker": {
    "startPage": 1,
    "endPage": 10,
    "prev": false,
    "next": true,
    "cri": {
      "pageNum": 1,
      "amount": 10
    }
  }
}
```

**React 예제**
```jsx
const [pageNum, setPageNum] = useState(1);
const [data, setData] = useState({ list: [], pageMaker: null, total: 0 });

useEffect(() => {
  axiosInstance.get('/api/board/listPaging', {
    params: { pageNum, amount: 10 }
  }).then(res => setData(res.data));
}, [pageNum]);

// 페이지 버튼 렌더링 예시
{data.pageMaker && Array.from(
  { length: data.pageMaker.endPage - data.pageMaker.startPage + 1 },
  (_, i) => data.pageMaker.startPage + i
).map(num => (
  <button key={num} onClick={() => setPageNum(num)}
    style={{ fontWeight: data.pageMaker.cri.pageNum === num ? 'bold' : 'normal' }}>
    {num}
  </button>
))}
```

---

### 3-3. 게시글 상세 조회

**Request**
```
GET /api/board/detail/{boardId}
```

**Response**
```json
{
  "boardId": 1,
  "title": "공지사항입니다",
  "contents": "내용입니다.",
  "hitCnt": 11,
  "creatorId": "admin",
  "createdDatetime": "2026-04-13 15:00:00",
  "updatedDatetime": null,
  "updaterId": null,
  "fileList": [
    {
      "fileIdx": 3,
      "boardId": 1,
      "originalFileName": "첨부파일.pdf",
      "storedFilePath": "C:/upload/...",
      "fileSize": 1024,
      "creatorId": "admin"
    }
  ]
}
```

> [!NOTE]
> 상세 조회 시 조회수(`hitCnt`)가 자동으로 1 증가합니다.
> `fileList`는 첨부파일이 없으면 빈 배열 `[]`이 반환됩니다.

**React 예제**
```jsx
const { boardId } = useParams(); // react-router-dom 사용 시

useEffect(() => {
  axiosInstance.get(`/api/board/detail/${boardId}`)
    .then(res => setBoard(res.data));
}, [boardId]);
```

---

### 3-4. 게시글 등록

**Request**
```
POST /api/board/insert
Content-Type: multipart/form-data
```

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `title` | String | Y | 제목 |
| `contents` | String | Y | 내용 |
| `creatorId` | String | Y | 작성자 ID |
| `files` | File[] | N | 첨부파일 (복수 선택 가능) |

**Response**
```
insert success
```

**React 예제**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('contents', contents);
  formData.append('creatorId', creatorId);

  // 파일 여러 개 첨부
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });

  await axiosInstance.post('/api/board/insert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  navigate('/board/list'); // 등록 후 목록으로 이동
};
```

---

### 3-5. 게시글 수정

**Request**
```
POST /api/board/update
Content-Type: multipart/form-data
```

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `boardId` | int | Y | 수정할 게시글 ID |
| `title` | String | Y | 수정할 제목 |
| `contents` | String | Y | 수정할 내용 |
| `updaterId` | String | Y | 수정자 ID |
| `files` | File[] | N | 새로 추가할 첨부파일 |

**Response**
```
update success
```

**React 예제**
```jsx
const handleUpdate = async () => {
  const formData = new FormData();
  formData.append('boardId', board.boardId);
  formData.append('title', title);
  formData.append('contents', contents);
  formData.append('updaterId', 'user1'); // 로그인한 사용자 ID

  Array.from(newFiles).forEach(file => {
    formData.append('files', file);
  });

  await axiosInstance.post('/api/board/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

---

### 3-6. 게시글 삭제

**Request**
```
DELETE /api/board/delete/{boardId}
```

> [!WARNING]
> 게시글 삭제 시 해당 게시글의 **첨부파일이 서버에서 함께 삭제**됩니다.
> 복구가 불가능하므로 삭제 전 사용자에게 확인을 받으세요.

**Response**
```
delete success
```

**React 예제**
```jsx
const handleDelete = async (boardId) => {
  if (!window.confirm('정말로 삭제하시겠습니까?')) return;

  await axiosInstance.delete(`/api/board/delete/${boardId}`);
  navigate('/board/list');
};
```

---

### 3-7. 첨부파일 개별 삭제

**Request**
```
DELETE /api/board/deleteFile?fileIdx={fileIdx}
```

**Response**
```
delete file success
```

**React 예제**
```jsx
const handleDeleteFile = async (fileIdx) => {
  if (!window.confirm('파일을 삭제하시겠습니까?')) return;

  await axiosInstance.delete(`/api/board/deleteFile`, {
    params: { fileIdx }
  });

  // UI에서 해당 파일 항목 제거
  setFileList(prev => prev.filter(f => f.fileIdx !== fileIdx));
};
```

---

## 4. 권장 프로젝트 구조

```
src/
├── api/
│   ├── axiosInstance.js      ← Axios 기본 설정
│   └── boardApi.js           ← Board API 함수 모음
├── pages/
│   ├── BoardList.jsx         ← 목록 페이지
│   ├── BoardDetail.jsx       ← 상세 페이지
│   └── BoardWrite.jsx        ← 등록/수정 페이지
└── components/
    └── Pagination.jsx        ← 페이징 컴포넌트
```

### boardApi.js 예시 (API 함수 분리)

```js
import axiosInstance from './axiosInstance';

export const getBoardList = () =>
  axiosInstance.get('/api/board/list');

export const getBoardListPaging = (pageNum, amount = 10) =>
  axiosInstance.get('/api/board/listPaging', { params: { pageNum, amount } });

export const getBoardDetail = (boardId) =>
  axiosInstance.get(`/api/board/detail/${boardId}`);

export const insertBoard = (formData) =>
  axiosInstance.post('/api/board/insert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateBoard = (formData) =>
  axiosInstance.post('/api/board/update', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteBoard = (boardId) =>
  axiosInstance.delete(`/api/board/delete/${boardId}`);

export const deleteFile = (fileIdx) =>
  axiosInstance.delete('/api/board/deleteFile', { params: { fileIdx } });
```

---

## 5. 첨부파일 URL 접근 방법

업로드된 파일은 백엔드 서버에서 다음 경로로 접근할 수 있습니다.

```
http://localhost:8080/upload/{파일명}
```

`fileList`의 `originalFileName` 값을 조합해 다운로드 링크를 제공하세요.

```jsx
// 다운로드 링크 예시
<a href={`http://localhost:8080/upload/${file.originalFileName}`}
   target="_blank" rel="noreferrer">
  {file.originalFileName}
</a>
```

---

## 6. 주요 주의사항

> [!CAUTION]
> 파일 업로드 요청 시 `Content-Type: multipart/form-data`를 반드시 헤더에 명시하세요.
> 누락 시 서버에서 `415 Unsupported Media Type` 오류가 발생합니다.

> [!WARNING]
> React 프로젝트 포트가 **5173이 아닌 경우**, 백엔드의 `@CrossOrigin` 설정 변경이 필요합니다.
> 백엔드 담당자에게 허용할 포트를 알려주세요.

> [!NOTE]
> 현재 서버에는 로그인/인증 기능이 없습니다.
> `creatorId`, `updaterId` 필드는 임시로 사용자가 직접 입력하거나 상태값으로 관리해야 합니다.
