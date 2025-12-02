package com.springbootportfolio.springbootportfolio.dto;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto implements UserDetails{
    
    private String tnName;
    private String tnPassword;
    private String region;
    private String lolName;
    private String lolNametag;
    private String role;
    private String nickname;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
            return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return this.tnPassword;
    }

    @Override
    public String getUsername() {
        return this.tnName;
    }

}
