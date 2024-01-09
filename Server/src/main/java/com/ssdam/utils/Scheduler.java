package com.ssdam.utils;

import com.ssdam.party.service.PartyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Scheduler {
    static final Logger log = LoggerFactory.getLogger(Scheduler.class);

    private final PartyService partyService;

    @Autowired
    public Scheduler(PartyService partyService) {
        this.partyService = partyService;
    }

    @Scheduled(cron = "0 0 11 * * *")
    public void updatePartyStatus() {
        log.info("매일 11시에 스케줄러 동작");
        partyService.updatePartyStatus();
    }
}
