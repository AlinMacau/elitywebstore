package com.elitywebstore.service;

import com.elitywebstore.entities.AuditLog;
import com.elitywebstore.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void save(AuditLog auditLog){
        auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAll(){
        return auditLogRepository.findAll();
    }
}
