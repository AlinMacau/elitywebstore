package com.elitywebstore.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class AdminAuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        
        log.info("AdminAuthorizationFilter - Processing: {}", requestURI);
        
        // Check if the request is for an admin endpoint
        if (requestURI.startsWith("/api/v1/admin")) {
            log.info("AdminAuthorizationFilter - Admin endpoint detected");
            
            // Get the user role from request attributes (set by JwtFilter)
            String userRole = (String) request.getAttribute("userRole");
            
            log.info("AdminAuthorizationFilter - Retrieved userRole attribute: {}", userRole);
            log.info("AdminAuthorizationFilter - All attributes: userEmail={}, userId={}, userRole={}", 
                    request.getAttribute("userEmail"),
                    request.getAttribute("userId"),
                    request.getAttribute("userRole"));
            
            // Check if user is authenticated and has ADMIN role
            if (userRole == null) {
                log.warn("AdminAuthorizationFilter - DENIED: No role found in request attributes");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Authentication required\"}");
                return;
            }
            
            if (!"ADMIN".equals(userRole)) {
                log.warn("AdminAuthorizationFilter - DENIED: User has role '{}', but ADMIN required", userRole);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Admin access required\"}");
                return;
            }
            
            log.info("AdminAuthorizationFilter - GRANTED: User has ADMIN role");
        }
        
        log.info("AdminAuthorizationFilter - Passing to next filter/controller");
        filterChain.doFilter(request, response);
    }
}