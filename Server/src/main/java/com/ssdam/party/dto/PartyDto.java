package com.ssdam.party.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssdam.party.entity.Party;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

public class PartyDto {

    @Getter
    @AllArgsConstructor
    public static class Post {

        @NotBlank(message = "제목을 입력해주세요.")
        private String title;

        @Future(message = "모임일자는 현재일자보다 미래여야 합니다.")
        private LocalDateTime meetingDate; //모임일자

        private String location;

        @NotBlank(message = "내용을 입력해주세요.")
        private String content;

        @Positive
        private int maxCapacity; //최대인원

        private int currentCapacity; //현재인원

    }

    @Getter
    public static class Patch {

        private long partyId;

        @NotBlank(message = "제목을 입력해주세요.")
        private String title;

        @Future(message = "모임일자는 현재일자보다 미래여야 합니다.")
        private LocalDateTime meetingDate;

        private String location;

        @NotBlank(message = "내용을 입력해주세요.")
        private String content;

        @Positive
        private int maxCapacity;

        private int currentCapacity;

        private Party.PartyStatus partyStatus;

        public void setPartyId(long partyId) {
            this.partyId = partyId;
        }

    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private long partyId;
        private String title;
        private LocalDateTime meetingDate;
        private String location;
        private String content;
        private int maxCapacity;
        private int currentCapacity;
        private Party.PartyStatus partyStatus;

        public String getPartyStatus() {
            return partyStatus.getDescription();
        }

    }
}
