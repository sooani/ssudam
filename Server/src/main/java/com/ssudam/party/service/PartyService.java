package com.ssudam.party.service;

import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.member.entity.Member;
import com.ssudam.member.service.MemberService;
import com.ssudam.party.entity.Party;
import com.ssudam.party.entity.PartyMember;
import com.ssudam.party.repository.PartyMemberRepository;
import com.ssudam.party.repository.PartyRepository;
import com.ssudam.party.weather.WeatherService;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PartyService {
    private final PartyRepository partyRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final WeatherService weatherService;
    private final MemberService memberService;

    public PartyService(PartyRepository partyRepository, PartyMemberRepository partyMemberRepository,
                        WeatherService weatherService, MemberService memberService) {
        this.partyRepository = partyRepository;
        this.partyMemberRepository = partyMemberRepository;
        this.weatherService = weatherService;
        this.memberService = memberService;
    }

    // 파티 생성
    public Party createParty(Party party, Member author) {
        party.setWeather(weatherService.getWeather(party.getLatitude(), party.getLongitude(), party.getMeetingDate())
                .orElse(null));
        // 파티 저장
        Party savedParty = partyRepository.save(party);

        // 작성자를 파티멤버로 추가
        PartyMember partyMember = new PartyMember(author, savedParty);
        savedParty.addPartyMember(partyMember);

        // 파티 저장 (업데이트된 파티멤버 정보를 반영하기 위해)
        return partyRepository.save(savedParty);
    }

    public Party findParty(long partyId) {
        Party findParty = findVerifiedParty(partyId);
        // 파티 조회시 조회수 업데이트
        updatePartyHits(findParty);
        return findParty;
    }

    @Transactional(readOnly = true)
    public Page<Party> findParties(int page, int size) {
        return partyRepository.findAll(PageRequest.of(page, size,
                Sort.by("partyId").descending()));
    }

    // 특정 멤버가 작성한 모든 모임 목록 조회
    @Transactional(readOnly = true)
    public Page<Party> findPartiesByMember(long memberId, int page, int size) {
        List<Party> parties = partyRepository.findByMember_MemberId(memberId);
        Page<Party> pageParties =
                new PageImpl<>(parties,
                        PageRequest.of(page, size,
                                Sort.by("createdAt").descending()), parties.size());
        return pageParties;
    }

    // 특정 멤버가 참여한 모든 모임 목록 조회
    @Transactional(readOnly = true)
    public Page<Party> findPartiesByPartyMember(long partyMemberId, int page, int size) {
        List<Party> parties = partyRepository.findByPartyMembers_Member_MemberId(partyMemberId);
        Page<Party> pageParties = new PageImpl<>(parties,
                PageRequest.of(page, size, Sort.by("createdAt").descending()), parties.size());
        return pageParties;
    }

    // 최신 글 조회
    @Transactional(readOnly = true)
    public Page<Party> findLatestParties(int page, int size) {
        // 현재 날짜에서 2일 전의 날짜를 계산
        LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);

        /// 페이지 번호가 1 이하인 경우 0으로 설정
        int adjustedPage = Math.max(0, page);

        // 2일 이내에 올린 글만 조회하여 페이지네이션
        return partyRepository.findByCreatedAtAfter(twoDaysAgo, PageRequest.of(adjustedPage, size,
                Sort.by("partyId").descending()));

    }

    //키워드로 제목,글내용 검색
    @Transactional(readOnly = true)
    public Page<Party> searchPartiesByTitleAndContent(String keyword, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("partyId").descending());

        return partyRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
    }

    // 파티 수정 , 작성한 사람만 수정하게 해야함
    public Party updateParty(Party party) {
        Party findParty = findVerifiedParty(party.getPartyId());

        Optional.ofNullable(party.getMeetingDate())
                .ifPresent(findParty::setMeetingDate);
        Optional.ofNullable(party.getClosingDate())
                .ifPresent(findParty::setClosingDate);
        Optional.ofNullable(party.getPhoneNumber())
                .ifPresent(findParty::setPhoneNumber);
        Optional.ofNullable(party.getLongitude())
                .ifPresent(findParty::setLongitude);
        Optional.ofNullable(party.getLatitude())
                .ifPresent(findParty::setLatitude);
        Optional.ofNullable(party.getAddress())
                .ifPresent(findParty::setAddress);
        Optional.ofNullable(party.getTitle())
                .ifPresent(findParty::setTitle);
        Optional.ofNullable(party.getContent())
                .ifPresent(findParty::setContent);
        Optional.ofNullable(party.getMaxCapacity())
                .ifPresent(findParty::setMaxCapacity);
        Optional.ofNullable(party.getCurrentCapacity())
                .ifPresent(findParty::setCurrentCapacity);
        Optional.ofNullable(party.getPartyStatus())
                .ifPresent(findParty::setPartyStatus);

        return partyRepository.save(findParty);
    }

    // 파티 삭제, 작성한 사람이 삭제하게 해야함
    public void deleteParty(long partyId) {
        Party findParty = findVerifiedParty(partyId);

        partyRepository.delete(findParty);
    }

    public Party findVerifiedParty(long partyId) {
        Optional<Party> optionalParty =
                partyRepository.findById(partyId);
        Party findParty =
                optionalParty.orElseThrow(() ->
                        new BusinessLogicException(ExceptionCode.PARTY_NOT_FOUND));
        return findParty;
    }

    //조회수 업데이트
    private void updatePartyHits(Party party) {
        party.setHits(party.getHits() + 1);
        partyRepository.save(party);
    }


    // 모임일자와 모집마감일자가 현재 날짜와 같거나 지났을 때 모집상태를 변경
    @Transactional
    public void updatePartyStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Party> partiesToClose = partyRepository
                .findByMeetingDateBeforeOrClosingDateBeforeAndPartyStatus(now, now, Party.PartyStatus.PARTY_OPENED);
        partiesToClose.forEach(party -> {
            if (party.getMeetingDate().isBefore(now) || party.getClosingDate().isBefore(now)) {
                party.setPartyStatus(Party.PartyStatus.PARTY_CLOSED);
                partyRepository.save(party);
                System.out.println("Party ID: " + party.getPartyId() + " is closed.");
            }
        });
    }

    // 파티 참가, 권한 추가 필요
    public void addPartyMember(long partyId, Member member) {
        Party party = findParty(partyId);
        if (isPartyClosed(party)) {
            throw new BusinessLogicException(ExceptionCode.PARTY_CLOSED_ERROR);
        }

        if (isNotJoinParty(member, party)) {
            increasePartyCapacity(party);
            addMemberToParty(member, party);
        } else {
            decreasePartyCapacity(party);
            removeMemberFromParty(member, party);
        }
    }

    // 파티에 가입하지 않은 멤버인지 검사
    public boolean isNotJoinParty(Member member, Party party) {
        return !partyMemberRepository.existsByMemberAndParty(member, party);
    }

    public boolean isJoinParty(Long memberId, Long partyId) {
        Member member = memberService.findMember(memberId);
        Party party = findVerifiedParty(partyId);
        return !partyMemberRepository.existsByMemberAndParty(member, party);
    }

    // 파티 참가인원 증가
    private void increasePartyCapacity(Party party) {
        party.setCurrentCapacity(party.getCurrentCapacity() + 1);
    }

    // 파티에 멤버 생성
    private void addMemberToParty(Member member, Party party) {
        partyMemberRepository.save(new PartyMember(member, party));
    }

    // 파티 참가인원 감소
    private void decreasePartyCapacity(Party party) {
        party.setCurrentCapacity(party.getCurrentCapacity() - 1);
    }

    // 파티에서 멤버 삭제
    private void removeMemberFromParty(Member member, Party party) {
        partyMemberRepository.deleteByMemberAndParty(member, party);
    }

    // 파티가 모집 종료상태인지 확인
    private boolean isPartyClosed(Party party) {
        return party.getPartyStatus() == Party.PartyStatus.PARTY_CLOSED;
    }
}
