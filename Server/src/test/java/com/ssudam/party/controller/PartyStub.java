package com.ssudam.party.controller;

import com.ssudam.member.entity.Member;
import com.ssudam.party.dto.PartyDto;
import com.ssudam.party.entity.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssudam.party.entity.Party.PartyStatus.PARTY_OPENED;

public class PartyStub {

    private static Map<HttpMethod, Object> stubRequestBody;

    static {
        stubRequestBody = new HashMap<>();
        stubRequestBody.put(HttpMethod.POST, new PartyDto.Post("줍깅모임 하실 분!",
                LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"),
                "129.026370491329", "35.3368478896222",
                "경남 양산시 양산역6길 12", "010-1234-1234",
                "줍깅 하실분 구합니다람쥐",
                5,
                2, 1L));
        stubRequestBody.put(HttpMethod.PATCH,
                PartyDto.Patch.builder()
                        .partyId(1L)
                        .title("줍깅모임 하실 분!")
                        .maxCapacity(5)
                        .currentCapacity(2)
                        .partyStatus(PARTY_OPENED)
                        .build());

    }

    public static class MockParty {
        public static Object getRequestBody(HttpMethod method) {
            return stubRequestBody.get(method);
        }

        public static PartyDto.Response getSingleResponseBody() {
            return PartyDto.Response.builder()
                    .partyId(1L)
                    .memberId(1L)
                    .title("줍깅모임 하실 분!")
                    .meetingDate(LocalDateTime.parse("2024-02-21T15:00"))
                    .closingDate(LocalDateTime.parse("2024-02-21T15:00"))
                    .phoneNumber("010-1234-1234")
                    .longitude("129.026370491329")
                    .latitude("35.3368478896222")
                    .address("경남 양산시 양산역6길 12")
                    .weather("clear")
                    .bookmarkCount(3)
                    .content("줍깅 하실분 구합니다람쥐")
                    .maxCapacity(5)
                    .currentCapacity(2)
                    .partyStatus(PARTY_OPENED)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();
        }

        public static Page<PartyDto.Response> getMultiResponseBody() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅모임 하실 분!",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "줍깅 알려드림",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "선착순 23548명",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "저랑 같이 줍깅 모임하실분?",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return new PageImpl<>(List.of(response1, response2),
                    PageRequest.of(0, 10, Sort.by("partyId").descending()), 2);

        }

        public static List<PartyDto.Response> getListResponseBody() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅모임 하실 분!",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "줍깅 알려드림",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "선착순 23548명",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "저랑 같이 줍깅 모임하실분?",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return List.of(response1, response2);
        }

        public static Page<PartyDto.Response> getMultiResponseByMember() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅모임 하실 분!",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "줍깅 알려드림",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "선착순 23548명",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "저랑 같이 줍깅 모임하실분?",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return new PageImpl<>(List.of(response1, response2),
                    PageRequest.of(0, 10, Sort.by("partyId").descending()), 2);

        }

        public static List<PartyDto.Response> getListResponseByMember() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅모임 하실 분!",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "줍깅 알려드림",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "선착순 23548명",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12", "clear", 3, 0,
                    "저랑 같이 줍깅 모임하실분?",
                    5,
                    2, PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return List.of(response1, response2);
        }

        public static Party getCreateMockParty() {
            Party party = new Party();
            party.setPartyId(1L);
            party.setTitle("줍깅모임 하실 분!");
            party.setMeetingDate(LocalDateTime.parse("2024-02-21T15:00"));
            party.setClosingDate(LocalDateTime.parse("2024-02-21T15:00"));
            party.setPhoneNumber("010-1234-1234");
            party.setLongitude("129.026370491329");
            party.setLatitude("35.3368478896222");
            party.setAddress("경남 양산시 양산역6길 12");
            party.setWeather("clear");
            party.setBookmarkCount(3);
            party.setContent("줍깅 하실분 구합니다람쥐");
            party.setMaxCapacity(5);
            party.setCurrentCapacity(2);
            party.setPartyStatus(PARTY_OPENED);
            return party;
        }

        public static Member getCreateMockMember() {
            Member member = new Member();
            member.setMemberId(1L);
            member.setNickname("마이멜로디");
            // 다른 필드들도 필요에 따라 설정
            return member;
        }
    }
}
