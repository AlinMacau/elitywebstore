package com.elitywebstore.config;

import com.elitywebstore.service.JwtService;
import com.elitywebstore.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;
        String role = null;

        log.info("JwtFilter - Processing: {} {}", request.getMethod(), requestURI);
        log.info("JwtFilter - Authorization Header: {}", authHeader != null ? "Present" : "Missing");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            log.info("JwtFilter - Token extracted, length: {}", token.length());
            
            try {
                email = jwtService.extractEmail(token);
                role = jwtService.extractRole(token);
                log.info("JwtFilter - Extracted from token - Email: {}, Role: {}", email, role);
            } catch (Exception e) {
                log.error("JwtFilter - Error extracting token data: {}", e.getMessage());
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.validateToken(token, email)) {
                // Set request attributes (for our custom filters)
                request.setAttribute("userEmail", email);
                request.setAttribute("userId", jwtService.extractUserId(token));
                request.setAttribute("userRole", role);
                
                log.info("JwtFilter - Set request attributes - Email: {}, Role: {}", email, role);
                
                // NEW - Create Spring Security Authentication object
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        Collections.singletonList(authority)
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                log.info("JwtFilter - Set SecurityContext Authentication with role: ROLE_{}", role);
                log.info("JwtFilter - Verification - userRole attribute: {}", request.getAttribute("userRole"));
            } else {
                log.warn("JwtFilter - Invalid or expired token for email: {}", email);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
                return;
            }
        }

        log.info("JwtFilter - Passing to next filter");
        filterChain.doFilter(request, response);
    }
}
