package com.springbootportfolio.springbootportfolio.config;

import com.springbootportfolio.springbootportfolio.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OnAuthenticationSuccess onAuthenticationSuccess;
    private final Oauth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;

    private static final String[] AUTH_WHITLIST = {
        "/**","/user/**","/login", "/logout", "/","/static/**", "/css/**", "/js/**", "/favicon.ico"
    };

    SecurityConfig(CustomOAuth2UserService customOAuth2UserService,OnAuthenticationSuccess onAuthenticationSuccess,Oauth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.onAuthenticationSuccess = onAuthenticationSuccess;
        this.oauth2AuthenticationSuccessHandler = oauth2AuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(authorize -> authorize
                                    .requestMatchers(AUTH_WHITLIST).permitAll());
        
        http.formLogin(form->form
                       .loginPage("/login")
                       .loginProcessingUrl("/login_proc")
                       .successHandler(onAuthenticationSuccess)
                       .permitAll())
                       .logout(logout -> logout
                       .logoutUrl("/logout")
                       .logoutSuccessUrl("/")
                       .invalidateHttpSession(true)
                       .deleteCookies("JSESSIONID")
                       .permitAll());
        
        http.oauth2Login(aouth2->aouth2
                          .loginPage("/login")
                          .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService))
                          .successHandler(oauth2AuthenticationSuccessHandler)
                        );
                          
        http.headers(header -> header
                     .frameOptions(frameOption -> frameOption
                                    .sameOrigin()));
                    
                                                           
        
        return http.build();
    }

    @Bean
    public static BCryptPasswordEncoder bCryptPasswordEncoder() {
            return new BCryptPasswordEncoder();
    }

}
