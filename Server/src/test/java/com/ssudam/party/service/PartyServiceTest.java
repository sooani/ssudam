package com.ssudam.party.service;

import com.ssudam.member.entity.Member;
import com.ssudam.party.controller.PartyStub;
import com.ssudam.party.entity.Party;
import com.ssudam.party.repository.PartyRepository;
import com.ssudam.party.weather.WeatherInfo;
import com.ssudam.party.weather.WeatherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.ssudam.party.entity.Party.PartyStatus.PARTY_OPENED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PartyServiceTest {
    @Mock
    private PartyRepository partyRepository;

    @Mock
    private WeatherService weatherService;

    @InjectMocks
    private PartyService partyService;

    @Test
    @DisplayName("파티 생성 테스트")
    public void createPartyTest() {
        //given
        Party party = PartyStub.MockParty.getCreateMockParty();
        Member author = PartyStub.MockParty.getCreateMockMember();

        WeatherInfo.Weather weather = new WeatherInfo.Weather();
        when(weatherService.getWeather(anyString(), anyString(), any(LocalDateTime.class)))
                .thenReturn(Optional.of(weather.toString()));

        when(partyRepository.save(any(Party.class))).thenAnswer(invocation -> {
            Party savedParty = invocation.getArgument(0);
            savedParty.getPartyId();
            return savedParty;
        });

        //when
        Party createdParty = partyService.createParty(party, author);

        //then
        assertNotNull(createdParty); // 새로운 파티가 생성 되었는지 확인
        assertEquals(author, createdParty.getPartyMembers().get(0).getMember());
        // 생성된 파티의 첫번째 멤버가 예상한 작성자와 동일한지 확인
        assertEquals(PARTY_OPENED, createdParty.getPartyStatus());
        // 생성된 파티 상태가 예상한 상태와 동일한지 확인
    }

    @Test
    @DisplayName("특정 멤버가 작성한 모든 파티 조회 테스트")
    public void findPartiesByMemberTest() {
        //given
        long memberId = 1L;
        int page = 1;
        int size = 10;
        //가짜데이터생성
        Party party1 = new Party();
        Party party2 = new Party();
        List<Party> parties = Arrays.asList(party1, party2);

        when(partyRepository.findByMember_MemberId(anyLong()))
                .thenReturn(parties);
        //when
        Page<Party> result = partyService.findPartiesByMember(memberId, page, size);

        //then
        verify(partyRepository).findByMember_MemberId(memberId);
        //결과 검증
        assertEquals(parties.size(), result.getContent().size());
    }
}