package com.elitywebstore.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer")){
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser().setSigningKey("e7d7c5c5acc9d80aa11dbe3a2f3fe55bc1d5148a91184b119a60db7883724015"
                        .getBytes()).parseClaimsJws(token).getBody();
                String userName = claims.getSubject();
                if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
                    UsernamePasswordAuthenticationToken u = new UsernamePasswordAuthenticationToken(userName, null, null);
                    SecurityContextHolder.getContext().setAuthentication(u);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        filterChain.doFilter(request, response);
    }
}
