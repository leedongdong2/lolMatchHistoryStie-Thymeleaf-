package com.springbootportfolio.springbootportfolio.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.stereotype.Service;

import com.springbootportfolio.springbootportfolio.dto.CustomUserPrincipal;
import com.springbootportfolio.springbootportfolio.dto.UserDto;
import com.springbootportfolio.springbootportfolio.mapper.UserMapper;
import org.springframework.security.oauth2.core.user.OAuth2User;

import jakarta.servlet.http.HttpSession;


@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService  {
    
    private final UserMapper userMapper;
    private final HttpSession httpSession;

    public CustomOAuth2UserService(UserMapper userMapper, HttpSession httpSession) {
        this.userMapper = userMapper;
        this.httpSession = httpSession;
    }
    

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");

        UserDto user = userMapper.loginEmailCheck(email);

        

        if (user == null) {
            // DB에 없으면 세션에 플래그 저장하고 회원가입 페이지로 리다이렉트 시도 가능
            httpSession.setAttribute("socialLogin", true);
            httpSession.setAttribute("email", email);
        } else {
            httpSession.setAttribute("user", user);
        }

        return new CustomUserPrincipal(user, oAuth2User.getAttributes());
    }


}