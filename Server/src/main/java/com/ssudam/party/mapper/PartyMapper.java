package com.ssudam.party.mapper;

import com.ssudam.party.dto.PartyDto;
import com.ssudam.party.entity.Party;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PartyMapper {
    Party partyPostDtoToParty(PartyDto.Post requestBody);

    Party partyPatchDtoToParty(PartyDto.Patch requestBody);

    @Mapping(target = "memberId", source = "party.member.memberId")
    PartyDto.Response partyToPartyResponse(Party party);

    List<PartyDto.Response> partiesToPartyResponses(List<Party> parties);

}
