package com.elitywebstore.jobs;

import com.elitywebstore.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.springframework.scheduling.annotation.Scheduled.CRON_DISABLED;

@Component
@ConditionalOnProperty(name="scheduled.tasks.enabled", havingValue="true")
public class ScheduledTasks {

    @Autowired
    private OrderService orderService;

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(cron = "1 5 * * * *")
    public void reportCurrentTime() {
//        log.info("The time is now {}", dateFormat.format(new Date()));
        log.info("Approved {} new orders" , orderService.approveNewOrders());
    }
}
