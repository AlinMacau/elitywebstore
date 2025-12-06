package com.elitywebstore.config;

import com.elitywebstore.controller.AuditLogController;
import com.elitywebstore.entities.AuditLog;
import com.elitywebstore.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuditInterceptor implements HandlerInterceptor {

    private final AuditLogService auditLogService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        AuditLog audit = AuditLog.builder()
                .userEmail(email)
                .endpoint(request.getRequestURI())
                .httpMethod(request.getMethod())
                .timeStamp(LocalDateTime.now())
                .build();

        auditLogService.save(audit);

        return true;
    }
}
