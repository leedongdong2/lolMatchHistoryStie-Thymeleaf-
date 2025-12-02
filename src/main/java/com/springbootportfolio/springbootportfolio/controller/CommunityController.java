package com.springbootportfolio.springbootportfolio.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.springbootportfolio.springbootportfolio.dto.CommunityCommentDto;
import com.springbootportfolio.springbootportfolio.dto.CommunityDto;
import com.springbootportfolio.springbootportfolio.dto.CustomUserPrincipal;
import com.springbootportfolio.springbootportfolio.dto.PageDto;
import com.springbootportfolio.springbootportfolio.service.CommunityService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class CommunityController {
    
    @Autowired
    CommunityService communityService;

    /**
     * 
     * @param mv
     * @param dto
     * @param page
     * @param searchType
     * @param searchText
     * @return
     * 커뮤니티 게시판으로 이동한다
     */
    @GetMapping("/community")
    public ModelAndView moveCommunity(ModelAndView mv,CommunityDto dto,@RequestParam(name = "page",defaultValue = "1") int page,@RequestParam(value="searchType",required = false) String searchType,@RequestParam(name="searchText",required = false) String searchText,@RequestParam(name="searchOrder",defaultValue = "Latest")String searchOrder) {
        
        if("all".equals(searchType)) {
            dto.setContent(searchText);
            dto.setTitle(searchText);
            dto.setNickname(searchText);
        } else if("title".equals(searchType)){
            dto.setTitle(searchText);
        } else if("author".equals(searchType)){
            dto.setNickname(searchText);
        } else if("content".equals(searchType)){
            dto.setContent(searchText);
        }
        dto.setSearchOrder(searchOrder);
        
        int pageSize = 3;
        int offset = (page - 1) * pageSize;

        dto.setLimit(pageSize);
        dto.setOffset(offset);

        
        List<CommunityDto> dtos = communityService.serchCommunity(dto);
        int totalCount = communityService.countCommunity(dto);
        PageDto pageDto = new PageDto(page, pageSize, totalCount);

        communityService.replacePrettyTime(dtos);

        List<CommunityDto> recentTenCommunity  = communityService.getRecentTenCommunity();

        mv.addObject("recentTenCommunity", recentTenCommunity);
        mv.addObject("searchType", searchType);
        mv.addObject("searchText", searchText);
        mv.addObject("searchOrder", searchOrder);
        mv.addObject("communityListDto", dtos);
        mv.addObject("page", pageDto);
        mv.setViewName("pages/community");
        return mv;
    }


   

    /**
     * 
     * @param mv
     * @return
     * 커뮤니티 게시판 게시물 작성 페이지로 이동한다 
     */
    @GetMapping("/community/writePage")
    public ModelAndView getMethodName(ModelAndView mv) {
        mv.setViewName("pages/writeCommunity");
        return mv;
    }
    
    /**
     * 
     * @param mv
     * @param communityText
     * @param authentication
     * @return
     * @throws IOException
     * 게시물을 작성한다
     */
    @PostMapping("/community/write")
    public ResponseEntity<?> writeCommunity(ModelAndView mv,@RequestBody Map<String,String> communityText,Authentication authentication) throws IOException {
        
        CommunityDto communityDto = new CommunityDto();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal) {
                CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
                communityDto.setNickname(principal.getNickname());
                communityDto.setTnName(principal.getName());
        }

        communityDto.setTitle(communityText.get("title"));
        String content = communityService.communityWriteImgUpload(communityText.get("content"));
        communityDto.setContent(content);

        String result = communityService.commuityWrite(communityDto);

        return ResponseEntity.ok(result);
    }

    /**
     * 
     * @param mv
     * @param communitySeq
     * @return
     * 게시물을 수정하는 페이지로 이동한다
     */
    @GetMapping("/community/updatePage")
    public ModelAndView getMethodName(ModelAndView mv,@RequestParam("communitySeq") int communitySeq) {
        CommunityDto dto = communityService.getCommunityDetail(communitySeq); 
        mv.addObject("communityDetailDto", dto);
        mv.setViewName("pages/communityUpdate");
        return mv;
    }

    /**
     * 
     * @param communitySeq
     * @param updateDto
     * @return
     * @throws IOException
     * 
     * 선택된 게시물을 수정해준다
     */
    @PutMapping("/community/updateCc/{communitySeq}")
    public ResponseEntity<?> postMethodName(@PathVariable("communitySeq") int communitySeq, @RequestBody CommunityDto updateDto) throws IOException {
        
        CommunityDto originalDto = communityService.getCommunityDetail(communitySeq);
        String updateContent = communityService.communityUpdateImgUpload(originalDto.getContent(), updateDto.getContent());
        updateDto.setContent(updateContent);
        updateDto.setSeq(communitySeq);
        String result = communityService.communityUpdate(updateDto);
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param communitySeq
     * @return
     * 선택된 게시물을 삭제한다
     */
    @DeleteMapping("/community/deleteCc/{communitySeq}")
    public ResponseEntity<?> deleteCommunityContent(@PathVariable("communitySeq") int communitySeq){
        CommunityDto orginalDto = communityService.getCommunityDetail(communitySeq);
        communityService.deleteImg(orginalDto.getContent());
        String result = communityService.commnuityDelete(communitySeq);
        return ResponseEntity.ok(result);
    }
    
    /**
     * 
     * @param file
     * @return
     * @throws IOException
     * 스마트 에디터2 에서 이미지를 임시 업로드하기위한 메소드
     */
    @PostMapping("/upload/image")
    public ResponseEntity<String> postUploadImage(@RequestParam("Filedata") MultipartFile file) throws IOException{
       
        String sFileInfo = communityService.tempImgUpload(file);
        
        return ResponseEntity.ok(sFileInfo);
    }

    /**
     * 
     * @param mv
     * @param communitySeq
     * @param page
     * @return
     * 게시물의 상세페이지로 이동한다
     */
    @GetMapping("/community/detail")
    public ModelAndView getCommunityDetail(ModelAndView mv,@RequestParam("communitySeq") int communitySeq,@RequestParam(name = "page", defaultValue = "1") int page) {
        
        communityService.communityCommentIncreaseViews(communitySeq);
        
        CommunityDto dto = communityService.getCommunityDetail(communitySeq);
        int limit = 5;
        int offset = (page-1)* limit;
        
        List<CommunityCommentDto> comments = communityService.buildCommentTree(null,page,communitySeq,limit,offset);

        int totalCount = communityService.countCommuntyComment(communitySeq);

        int totalPages = (int) Math.ceil((double) totalCount/limit);

        communityService.replacePrettyTime(dto);

        communityService.replaceCommentPrettyTime(comments);



        List<CommunityDto> recentTenCommunity = communityService.getRecentTenCommunity();

        mv.addObject("recentTenCommunity", recentTenCommunity);
        mv.addObject("totalCount", totalCount);
        mv.addObject("communityDetailDto", dto);
        mv.addObject("communityCommentList", comments);
        mv.addObject("currentPage", page);
        mv.addObject("totalPages", totalPages);
        mv.addObject("limit", limit);
        mv.setViewName("pages/communityDetail");

        return mv;
    }
    /**
     * 
     * @param dto
     * @param authentication
     * @return
     * 해당 게시물에 댓글을 작성하는 메소드
     */
    @PostMapping("/community/comment/write")
    public ResponseEntity<?> communityCommentWrite(@RequestBody CommunityCommentDto dto,Authentication authentication) {

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal) {
            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            dto.setAuthor(principal.getNickname());
        }
        String result = communityService.communityCommentWrite(dto);
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param seq
     * @param dto
     * @return
     * 해당 게시물에 댓글을 수정
     */
    @PutMapping("/community/comment/update/{seq}")
    public ResponseEntity<?> putMethodName(@PathVariable Long seq, @RequestBody CommunityCommentDto dto) {
        dto.setSeq(seq);
        String result = communityService.updateCommunityComment(dto);
        return ResponseEntity.ok(result);
    }
    /**
     * 
     * @param seq
     * @return
     * 해당 게시물에 댓글을 삭제
     */
    @DeleteMapping("/community/comment/delete/{seq}")
    public ResponseEntity<?> deleteCommunityComment(@PathVariable Long seq) {
        String result = communityService.deleteCommunityComment(seq);
        return ResponseEntity.ok(result);
    }
    
}
