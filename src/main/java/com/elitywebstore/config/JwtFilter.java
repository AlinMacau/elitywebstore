package com.elitywebstore.config;

import com.elitywebstore.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class JwtFilter extends OncePerRequestFilter {

    public static final String BEARER = "Bearer";

    @Autowired
    private UserService userService;

    @Autowired
    private SecretConfig secretConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(authHeader != null && authHeader.startsWith(BEARER)){
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser().setSigningKey(secretConfig.getSecretKey().getBytes()).parseClaimsJws(token).getBody();
                String email = claims.getSubject();
                if(email != null && SecurityContextHolder.getContext().getAuthentication() == null
                        && userService.existsByEmail(email) && token.equals(userService.getTokenByUserEmail(email))){
                    UsernamePasswordAuthenticationToken u = new UsernamePasswordAuthenticationToken(email, null, null);
                    SecurityContextHolder.getContext().setAuthentication(u);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        filterChain.doFilter(request, response);
    }

}
