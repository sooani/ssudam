package com.ssudam.party.controller;

import com.ssudam.annotation.BodyRequest;
import com.ssudam.annotation.PartyRequest;
import com.ssudam.dto.MultiResponseDto;
import com.ssudam.dto.SingleResponseDto;
import com.ssudam.member.entity.Member;
import com.ssudam.member.service.MemberService;
import com.ssudam.party.dto.PartyDto;
import com.ssudam.party.entity.Party;
import com.ssudam.party.mapper.PartyMapper;
import com.ssudam.party.service.PartyService;
import com.ssudam.utils.UriCreator;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Validated
public class PartyController {
    private final static String PARTY_DEFAULT_URL = "/v1/parties";
    private final PartyService partyService;
    private final MemberService memberService;
    private final PartyMapper mapper;

    public PartyController(PartyService partyService, MemberService memberService, PartyMapper mapper) {
        this.partyService = partyService;
        this.memberService = memberService;
        this.mapper = mapper;
    }

    // 파티 생성
    @BodyRequest
    @RequestMapping(value = "/v1/parties", method = RequestMethod.POST)
    public ResponseEntity postParty(@RequestBody @Valid PartyDto.Post requestBody) {
        Member member = memberService.findMember(requestBody.getMemberId());
        Party party = mapper.partyPostDtoToParty(requestBody);
        party.setMember(member);

        Party createdParty = partyService.createParty(party, member);

        URI location = UriCreator.createUri(PARTY_DEFAULT_URL, createdParty.getPartyId());

        return ResponseEntity.created(location).build();
    }

    //파티 참가
    @RequestMapping(value = "/v1/parties/{party-id}", method = RequestMethod.POST)
    public ResponseEntity<Void> postPartyMember(@PathVariable("party-id")
                                                @Positive long partyId,
                                                @RequestBody Member member) {

        partyService.addPartyMember(partyId, member);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //파티에 참가한 멤버인지 조회
    @RequestMapping(value = "/v1/parties/{party-id}/partymember-status", method = RequestMethod.GET)
    public ResponseEntity checkPartyMemberStatus(@RequestParam Long memberId,
                                                 @PathVariable("party-id") Long partyId) {
        boolean isJoinedParty = partyService.isJoinParty(memberId, partyId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isJoined", isJoinedParty);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 파티 조회
    @RequestMapping(value = "/v1/parties/{party-id}", method = RequestMethod.GET)
    public ResponseEntity getParty(@PathVariable("party-id") @Positive long partyId) {
        Party party = partyService.findParty(partyId);

        return new ResponseEntity(
                new SingleResponseDto<>(
                        mapper.partyToPartyResponse(party)),
                HttpStatus.OK);
    }

    // 모든 파티 조회
    @RequestMapping(value = "/v1/parties", method = RequestMethod.GET)
    public ResponseEntity getParties(@Positive @RequestParam int page,
                                     @Positive @RequestParam int size) {
        Page<Party> pageParties = partyService.findParties(page - 1, size);
        List<Party> parties = pageParties.getContent();

        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties),
                        pageParties),
                HttpStatus.OK);
    }

    // 특정 멤버가 작성한 모든 파티 조회
    @RequestMapping(value = "/v1/parties", method = RequestMethod.GET, params = {"memberId"})
    public ResponseEntity getPartiesByMember(@Positive @RequestParam long memberId,
                                             @Positive @RequestParam int page,
                                             @Positive @RequestParam int size) {
        Page<Party> pageParties = partyService.findPartiesByMember(memberId, page - 1, size);
        List<Party> parties = pageParties.getContent();

        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties),
                        pageParties),
                HttpStatus.OK);
    }

    // 특정 멤버가 침여한 모든 파티 조회
    @RequestMapping(value = "/v1/parties", method = RequestMethod.GET, params = {"partyMemberId"})
    public ResponseEntity getPartiesByPartyMember(@Positive @RequestParam long partyMemberId,
                                                  @Positive @RequestParam int page,
                                                  @Positive @RequestParam int size) {
        Page<Party> pageParties = partyService.findPartiesByPartyMember(partyMemberId, page - 1, size);
        List<Party> parties = pageParties.getContent();

        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties),
                        pageParties),
                HttpStatus.OK);
    }

    //2일 이내에 작성된 파티 조회
    @RequestMapping(value = "/v1/parties/latest", method = RequestMethod.GET)
    public ResponseEntity getLatestParties(@Positive @RequestParam int page,
                                           @Positive @RequestParam int size) {
        Page<Party> pageParties = partyService.findLatestParties(page - 1, size);
        List<Party> parties = pageParties.getContent();

        return new ResponseEntity<>(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties),
                        pageParties),
                HttpStatus.OK);
    }
    //특정 회원이 북마크한 모든 모집글 조회
    @RequestMapping(value = "/v1/parties/bookmarks", method = RequestMethod.GET, params = {"memberId"})
    public ResponseEntity getBookmarkedParties(@Positive @RequestParam long memberId,
                                               @Positive @RequestParam int page,
                                               @Positive @RequestParam int size){
        Page<Party> pageParties = partyService.findPartiesByBookmarkByMember(memberId, page - 1, size);
        List<Party> parties = pageParties.getContent();

        return new ResponseEntity(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties), pageParties),
                HttpStatus.OK);
    }

    //키워드로 제목,글내용 검색
    @RequestMapping(value = "/v1/parties/search", method = RequestMethod.GET)
    public ResponseEntity getPartiesWithTitleOrContent(@RequestParam String keyword,
                                                       @Positive @RequestParam int page,
                                                       @Positive @RequestParam int size) {
        Page<Party> pageParties = partyService.searchPartiesByTitleAndContent(keyword, page - 1, size);
        List<Party> parties = pageParties.getContent(); // 페이지에서 목록 가져옴
        return new ResponseEntity(
                new MultiResponseDto<>(mapper.partiesToPartyResponses(parties),
                        pageParties),
                HttpStatus.OK);
    }

    @PartyRequest
    @RequestMapping(value = "/v1/parties/{party-id}", method = RequestMethod.PATCH)
    public ResponseEntity patchParty(@PathVariable("party-id") @Positive long partyId,
                                     @Valid @RequestBody PartyDto.Patch requestBody) {
        requestBody.setPartyId(partyId);
        Party party = mapper.partyPatchDtoToParty(requestBody);
        Party updatedParty = partyService.updateParty(party);

        return new ResponseEntity<>(
                new SingleResponseDto<>(mapper.partyToPartyResponse(updatedParty)), HttpStatus.OK);
    }

    @PartyRequest
    @RequestMapping(value = "/v1/parties/{party-id}", method = RequestMethod.DELETE)
    public ResponseEntity deleteParty(@PathVariable("party-id") @Positive long partyId) {
        partyService.deleteParty(partyId);

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
