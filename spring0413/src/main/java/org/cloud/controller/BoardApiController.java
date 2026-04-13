package org.cloud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.cloud.dto.BoardDto;
import org.cloud.dto.Criteria;
import org.cloud.dto.PageResponse;
import org.cloud.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/board")
public class BoardApiController {

	@Autowired
	private BoardService boardService;

	// 게시글 전체 목록 조회
	@GetMapping("/list")
	public List<BoardDto> openBoardList() throws Exception {
		return boardService.selectBoardList();
	}

	// 게시글 페이징 목록 조회 + 페이징 정보 포함
	@GetMapping("/listPaging")
	public Map<String, Object> openBoardListPaging(Criteria cri) throws Exception {
		if (cri.getPageNum() <= 0) cri.setPageNum(1);
		if (cri.getAmount() <= 0) cri.setAmount(10);

		List<BoardDto> list = boardService.selectBoardListPaging(cri);
		int total = boardService.selectBoardTotalCount();
		PageResponse pageMaker = new PageResponse(cri, total);

		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("pageMaker", pageMaker);
		result.put("total", total);
		return result;
	}

	// 게시글 상세 조회
	@GetMapping("/detail/{boardId}")
	public BoardDto openBoardDetail(@PathVariable("boardId") int boardId) throws Exception {
		return boardService.selectDetail(boardId);
	}

	// 게시글 등록
	@PostMapping("/insert")
	public String insertBoard(@ModelAttribute BoardDto board,
			MultipartHttpServletRequest request) throws Exception {
		boardService.insertBoard(board, request);
		return "insert success";
	}

	// 게시글 수정
	@PostMapping("/update")
	public String updateBoard(@ModelAttribute BoardDto board,
			MultipartHttpServletRequest request) throws Exception {
		boardService.updateBoard(board, request);
		return "update success";
	}

	// 게시글 삭제
	@DeleteMapping("/delete/{boardId}")
	public String deleteBoard(@PathVariable("boardId") int boardId) throws Exception {
		boardService.deleteBoard(boardId);
		return "delete success";
	}

	// 첨부파일 삭제
	@DeleteMapping("/deleteFile")
	public String deleteFile(@RequestParam("fileIdx") int fileIdx) throws Exception {
		boardService.deleteFile(fileIdx);
		return "delete file success";
	}
}
