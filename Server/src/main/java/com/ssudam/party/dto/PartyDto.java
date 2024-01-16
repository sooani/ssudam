package com.ssudam.party.dto;

import com.ssudam.party.entity.Party;
import com.ssudam.validator.NotSpace;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.validator.constraints.Range;

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

        private LocalDateTime closingDate; //모집마감일자

        private String longitude; //경도

        private String latitude; //위도

        private String address; //도로명주소

        private String phoneNumber; //연락처

        @NotBlank(message = "내용을 입력해주세요.")
        private String content;

        @Positive
        private int maxCapacity; //최대인원

        private int currentCapacity; //현재인원

        @Positive
        private long memberId;

    }

    @Getter
    @Builder
    public static class Patch {

        private long partyId;

        @NotSpace(message = "제목을 입력해주세요.")
        private String title;

        @Future(message = "모임일자는 현재일자보다 미래여야 합니다.")
        private LocalDateTime meetingDate;

        private LocalDateTime closingDate;

        private String longitude; //경도

        private String latitude; //위도

        private String address; //도로명주소

        private String phoneNumber; //연락처

        @NotSpace(message = "내용을 입력해주세요.")
        private String content;

        @Range(min = 2, max = 9999)
        private Integer maxCapacity;

        private Integer currentCapacity;

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
        private long memberId;
        private String title;
        private LocalDateTime meetingDate;
        private LocalDateTime closingDate;
        private String phoneNumber;
        private String longitude;
        private String latitude;
        private String address;
        private String weather;
        private int hits;
        private int bookmarkCount;
        private String content;
        private int maxCapacity;
        private int currentCapacity;
        private Party.PartyStatus partyStatus;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
    }
}
