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

import java.time.LocalDateTime;
import java.util.Optional;

import static com.ssudam.party.entity.Party.PartyStatus.PARTY_OPENED;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
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
        assertNotNull(createdParty);
        assertEquals(author, createdParty.getPartyMembers().get(0).getMember());
        assertEquals(PARTY_OPENED, createdParty.getPartyStatus());
    }
}