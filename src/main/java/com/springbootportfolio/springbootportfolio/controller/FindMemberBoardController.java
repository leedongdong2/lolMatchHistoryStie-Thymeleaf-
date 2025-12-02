package com.springbootportfolio.springbootportfolio.controller;

import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.ocpsoft.prettytime.PrettyTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.springbootportfolio.springbootportfolio.dto.CustomUserPrincipal;
import com.springbootportfolio.springbootportfolio.dto.FindMemberBoardDto;
import com.springbootportfolio.springbootportfolio.dto.PageDto;
import com.springbootportfolio.springbootportfolio.service.FindMemberBoardService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
public class FindMemberBoardController {
    
    @Autowired
    FindMemberBoardService findMemberBoardService;
    
    /**
     * 
     * @param mv
     * @param page
     * @param paramMap
     * @return
     * 듀오매칭게시판의
     * 검색한 게시물을 보여주는 메인페이지
     * 
     */
    @GetMapping("/findMemberBoard")
    public ModelAndView getFindMemberBoard(ModelAndView mv,@RequestParam(name = "page", defaultValue = "1")int page,@RequestParam(required = false) Map<String,Object> paramMap) {
        


        int pageSize = 3;
        int offset = (page-1) * pageSize;
        paramMap.put("pageSize", pageSize);
        paramMap.put("offset", offset);        

        
        List<FindMemberBoardDto> findMemberBoardList = findMemberBoardService.selectFindMeberBoard(paramMap);
        int totalCount = findMemberBoardService.countSelectFindMeberBoard(paramMap);
        PageDto pageDto = new PageDto(page, pageSize, totalCount);
        
        findMemberBoardService.replacePrettyTime(findMemberBoardList);

        List<FindMemberBoardDto> recentTenFindMemberBoard = findMemberBoardService.getRecentTenFindMemberBoard();

        mv.addObject("recentTenFindMemberBoard", recentTenFindMemberBoard);
        mv.addObject("page", pageDto);
        mv.addObject("searchText", paramMap.get("searchText"));
        mv.addObject("searchType", paramMap.get("searchType"));
        mv.addObject("matchType", paramMap.get("matchType"));
        mv.addObject("findMemberBoardList", findMemberBoardList);
        mv.setViewName("pages/findMemberBoard");
        return mv;
    }
    /**
     * 
     * @param mv
     * @return
     * 게시물 작성페이지를 보여준다
     */
    @GetMapping("/findMemberBoard/page/write")
    public ModelAndView moveFindMemberBoardWritePage(ModelAndView mv) {
        mv.setViewName("pages/findMemberBoardWrite");
        return mv;
    }
    
    /**
     * 
     * @param mv
     * @param seq
     * @param page
     * @return
     * 게시물의 상세페이지를 보여준다
     */
    @GetMapping("/findMemberBoard/detail")
    public ModelAndView getfindMemberBoardDetail(ModelAndView mv,@RequestParam("findMemberBoardSeq") int seq,@RequestParam(name = "page", defaultValue = "1" )int page) {
       
       
        int limit = 5;
        int offset = (page-1)*limit;

        findMemberBoardService.findMemberBoardIncreaseViews(seq);

        FindMemberBoardDto findMemberBoardDto = findMemberBoardService.selectFindMemberBoardDetail(seq);
        List<FindMemberBoardDto> findMemberBoardDetailComment = findMemberBoardService.selectFindMemberBoardDetailComment(limit, offset, seq);

        findMemberBoardService.replacePrettyTime(findMemberBoardDetailComment);

        int totalCount = findMemberBoardService.selectFindMemberBoardDetailCommentCount(seq);
        int totalPages = (int) Math.ceil((double) totalCount / limit);



        PrettyTime p = new PrettyTime();
        Date date = Date.from(findMemberBoardDto.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant());
        findMemberBoardDto.setPrettyTime(p.format(date));

        List<FindMemberBoardDto> recentTenFindMemberBoard = findMemberBoardService.getRecentTenFindMemberBoard(); 
        
        mv.addObject("recentTenFindMemberBoard", recentTenFindMemberBoard);
        mv.addObject("findMemberBoardDto", findMemberBoardDto);
        mv.addObject("findMemberBoardDetailComment",findMemberBoardDetailComment);
        mv.addObject("currentPage",page);
        mv.addObject("totalCount", totalCount);
        mv.addObject("totalPages", totalPages);
        mv.addObject("pageSize", limit);
        mv.setViewName("pages/findMemberBoardDetail");
        return mv;
    }
    /**
     * 
     * @param mv
     * @param seq
     * @return
     * 게시물의 수정페이지를 보여준다
     */
    @GetMapping("/findMemberBoard/page/update")
    public ModelAndView getFindMemberBoardUpdatePage(ModelAndView mv,@RequestParam("findMemberBoardSeq") int seq) {
        FindMemberBoardDto findMemberBoardDto = findMemberBoardService.selectFindMemberBoardDetail(seq); 
        mv.addObject("findMemberBoardDto", findMemberBoardDto);
        mv.setViewName("pages/findMemberBoardUpdate");
        return mv;
    }

    /**
     * 
     * @param dto
     * @param authentication
     * @return
     * 게시물을 작성
     */
    @PostMapping("/findMemberBoard/write")
    public ResponseEntity<?> writeFindMemberBoardDetail(@RequestBody FindMemberBoardDto dto,Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal) {
                CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
                dto.setNickname(principal.getNickname());
                dto.setTnName(principal.getName());
        }
        String result = findMemberBoardService.writeFindMemberBoardDetail(dto);
        return ResponseEntity.ok(result);
    }
    
    /**
     * 
     * @param seq
     * @param dto
     * @return
     * 게시물을 수정한다
     */
    @PutMapping("/findMemberBoard/update/{seq}")
    public ResponseEntity<?> updateFindMemberBoardDetail(@PathVariable("seq") Long seq, @RequestBody FindMemberBoardDto dto) {
        dto.setSeq(seq);
        String result = findMemberBoardService.updateFindMemberBoardDetail(dto);
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param seq
     * @return
     * 게시물을 삭제한다
     */
    @DeleteMapping("/findMemberBoard/delete/{seq}")
    public ResponseEntity<?> deleteFindMemberBoardDetail(@PathVariable("seq") int seq) {
        String result = findMemberBoardService.deleteFindMemberBoardDetail(seq);
        return ResponseEntity.ok(result);
    }

    /**
     * 
     * @param dto
     * @param authentication
     * @return
     * 선택된 게시물에 댓글을 작성한다
     */
    @PostMapping("/findMemberBoard/comment/write")
    public ResponseEntity<?> postMethodName(@RequestBody FindMemberBoardDto dto,Authentication authentication) {
        
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal) {
                CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
                dto.setNickname(principal.getNickname());
        }
        String result = findMemberBoardService.writeFindMemberBoardDetailComment(dto); 
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param seq
     * @param dto
     * @return
     * 선택된 게시물에 댓글을 수정 
     */
    @PutMapping("/findMemberBoard/comment/update/{seq}")
    public ResponseEntity<?> putMethodName(@PathVariable("seq") Long seq, @RequestBody FindMemberBoardDto dto) {
        dto.setSeq(seq);
        String result = findMemberBoardService.updateFindMemberBoardDetailComment(dto);
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param seq
     * @return
     * 선택된 게시물에 댓글을 삭제
     */
    @DeleteMapping("/findMemberBoard/commnet/delete/{seq}")
    public ResponseEntity<?> deleteFindMemberBoardDetailComment(@PathVariable("seq") int seq) {
        String result = findMemberBoardService.deleteFindMemberBoardDetailComment(seq);
        return ResponseEntity.ok(result);
    }
    
}
