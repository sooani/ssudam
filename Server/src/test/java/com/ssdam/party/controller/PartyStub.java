package com.ssdam.party.controller;

import com.ssdam.party.dto.PartyDto;
import com.ssdam.party.entity.Party;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class PartyStub {

    private static Map<HttpMethod, Object> stubRequestBody;

    static {
        stubRequestBody = new HashMap<>();
        stubRequestBody.put(HttpMethod.POST, new PartyDto.Post("줍깅 하실 분!",

                LocalDateTime.parse("2024-02-21T15:00"),
                "129.026370491329", "35.3368478896222",
                "경남 양산시 양산역6길 12",
                "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                5,
                2));
        stubRequestBody.put(HttpMethod.PATCH, new PartyDto.Patch(1L, "줍깅 하실 분!",
                LocalDateTime.parse("2024-02-21T15:00"),
                "129.026370491329", "35.3368478896222",
                "경남 양산시 양산역6길 12",
                "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                5,
                2, Party.PartyStatus.PARTY_OPENED));
    }

    public static class MockParty {
        public static Object getRequestBody(HttpMethod method) {
            return stubRequestBody.get(method);
        }

        public static PartyDto.Response getSingleResponseBody() {
            return PartyDto.Response.builder()
                    .partyId(1L)
                    .title("줍깅 하실 분!")
                    .meetingDate(LocalDateTime.parse("2024-02-21T15:00"))
                    .longitude("129.026370491329")
                    .latitude("35.3368478896222")
                    .address("경남 양산시 양산역6길 12")
                    .content("2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?")
                    .maxCapacity(5)
                    .currentCapacity(2)
                    .partyStatus(Party.PartyStatus.PARTY_OPENED)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();
        }
    }
}
