package com.springbootportfolio.springbootportfolio.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Configuration
public class Oauth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final HttpSession httpSession;  

    public Oauth2AuthenticationSuccessHandler(HttpSession httpSession) {
        this.httpSession = httpSession;
    }

        @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Boolean isSocialLogin = (Boolean) httpSession.getAttribute("socialLogin");

        if (isSocialLogin != null && isSocialLogin) {
            httpSession.removeAttribute("socialLogin");
            setDefaultTargetUrl("/signUp");
        } else {
            setDefaultTargetUrl("/riotUser/1");
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
