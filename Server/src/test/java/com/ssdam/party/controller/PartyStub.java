package com.ssdam.party.controller;

import com.ssdam.party.dto.PartyDto;
import com.ssdam.party.entity.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.ssdam.party.entity.Party.PartyStatus.PARTY_OPENED;

public class PartyStub {

    private static Map<HttpMethod, Object> stubRequestBody;

    static {
        stubRequestBody = new HashMap<>();
        stubRequestBody.put(HttpMethod.POST, new PartyDto.Post("줍깅 하실 분!",
                LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"),
                "129.026370491329", "35.3368478896222",
                "경남 양산시 양산역6길 12", "010-1234-1234",
                "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                5,
                2,1L));
        stubRequestBody.put(HttpMethod.PATCH,
                PartyDto.Patch.builder()
                        .partyId(1L)
                        .title("줍깅 하실 분!")
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
                    .title("줍깅 하실 분!")
                    .meetingDate(LocalDateTime.parse("2024-02-21T15:00"))
                    .closingDate(LocalDateTime.parse("2024-02-21T15:00"))
                    .phoneNumber("010-1234-1234")
                    .longitude("129.026370491329")
                    .latitude("35.3368478896222")
                    .address("경남 양산시 양산역6길 12")
                    .content("2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?")
                    .maxCapacity(5)
                    .currentCapacity(2)
                    .partyStatus(PARTY_OPENED)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();
        }

        public static Page<PartyDto.Response> getMultiResponseBody() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅 하실 분!",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12",
                    "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                    5,
                    2, Party.PartyStatus.PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "줍깅 하실 분?",

                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12",
                    "2024년 3월 21일 오후 3시에 만나서 줍깅 하실분?",
                    5,
                    2, Party.PartyStatus.PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return new PageImpl<>(List.of(response1, response2),
                    PageRequest.of(0, 10, Sort.by("partyId").descending()), 2);

        }

        public static List<PartyDto.Response> getListResponseBody() {
            PartyDto.Response response1 = new PartyDto.Response(1L, 1, "줍깅 하실 분!",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12",
                    "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                    5,
                    2, Party.PartyStatus.PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            PartyDto.Response response2 = new PartyDto.Response(2L, 2, "줍깅 하실 분?",
                    LocalDateTime.parse("2024-02-21T15:00"), LocalDateTime.parse("2024-02-20T15:00"), "010-1234-1234",
                    "129.026370491329", "35.3368478896222",
                    "경남 양산시 양산역6길 12",
                    "2024년 3월 21일 오후 3시에 만나서 줍깅 하실분?",
                    5,
                    2, Party.PartyStatus.PARTY_OPENED,
                    LocalDateTime.now(), LocalDateTime.now());

            return List.of(response1, response2);
        }
    }
}
