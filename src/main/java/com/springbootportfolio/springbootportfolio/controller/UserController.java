package com.springbootportfolio.springbootportfolio.controller;


import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.springbootportfolio.springbootportfolio.dto.RiotUserDto;
import com.springbootportfolio.springbootportfolio.dto.UserDto;
import com.springbootportfolio.springbootportfolio.service.RiotWebApiService;
import com.springbootportfolio.springbootportfolio.service.UserService;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class UserController {
   
    @Autowired
    UserService userService; 
    @Autowired
    RiotWebApiService riotWebApiService;
    
    //로그인 페이지로 이동
    @GetMapping("/login")
    public ModelAndView moveLogin(ModelAndView mv){
        mv.setViewName("pages/login");
        return mv;
    }
    
    //springboot security login url
    @PostMapping("/login")
    public ModelAndView userLogin(ModelAndView mv){
        mv.setViewName("pages/login");
        return mv;
    }
    //회원가입 페이지로이동
    @GetMapping("/signUp")
    public ModelAndView moveSignUp(ModelAndView mv) {
        mv.setViewName("pages/signUp");
        return mv;
    }

    //아이디 중복체크
    @GetMapping("/user/signUp/check")
    public ResponseEntity<?> idCheckAvailability(@RequestParam("tnName") String tnName) {
        String result = userService.idCheckAvailability(tnName); 
        return ResponseEntity.ok(result);
    }

    //닉네임 중복체크
    @GetMapping("/user/signUp/nicknameCheck")
    public ResponseEntity<?> getMethodName(@RequestParam("nickname") String nickname) {
        String result = userService.nickNameCheckAvailability(nickname);
        return ResponseEntity.ok(result);
    }
    
    
    @GetMapping("/user/signUp/lolNameCheck")
    public ResponseEntity<?> lolNameCheckAvailability(UserDto userDto) {
        String lolNameTag = userDto.getLolNametag().substring(1);
        String region = userDto.getRegion().split("/")[0];
        RiotUserDto riotUserDto = riotWebApiService.getPuuId(userDto.getLolName(), lolNameTag, region);
        if(riotUserDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("없는 아이디입니다");
        }
        return ResponseEntity.ok("확인되었습니다");
    }
    
    
    //회원가입을 처리한다
    @PostMapping("/user/signUp")
    public String insertUser(@RequestBody HashMap<String,Object> hashMap) {
        String result = userService.saveUser(hashMap);
        return result;
    }


}
