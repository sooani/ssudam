package com.ssdam.party.service;

import com.ssdam.exception.BusinessLogicException;
import com.ssdam.exception.ExceptionCode;
import com.ssdam.member.entity.Member;
import com.ssdam.party.entity.Party;
import com.ssdam.party.entity.PartyMember;
import com.ssdam.party.repository.PartyMemberRepository;
import com.ssdam.party.repository.PartyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    public PartyService(PartyRepository partyRepository, PartyMemberRepository partyMemberRepository) {
        this.partyRepository = partyRepository;
        this.partyMemberRepository = partyMemberRepository;
    }

    public Party createParty(Party party) {
        return partyRepository.save(party);
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

    // 특정 멤버가 작성한 모든 모임 조회
    @Transactional(readOnly = true)
    public Page<Party> findPartiesByMember(long memberId, int page, int size) {
        List<Party> parties = partyRepository.findByPartyMembers_Member_MemberId(memberId);
        Page<Party> pageParties =
                new PageImpl<>(parties,
                        PageRequest.of(page, size,
                                Sort.by("createdAt").descending()), parties.size());
        return pageParties;
    }

    // 글을 등록한 사람만 수정할 수 있게 권한 추가 해야함
    public Party updateParty(Party party) {
        Party findParty = findVerifiedParty(party.getPartyId());

        Optional.ofNullable(party.getMeetingDate())
                .ifPresent(findParty::setMeetingDate);
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


    // 모임일자가 현재 날짜와 같거나 지났을 때 모집상태를 변경
    @Transactional
    public void updatePartyStatus() {
        List<Party> parties = partyRepository
                .findByMeetingDateBeforeAndPartyStatus(LocalDateTime.now(),
                        Party.PartyStatus.PARTY_OPENED);
        for (Party party : parties) {
            if (party.getMeetingDate().isBefore(LocalDateTime.now()) || party.getMeetingDate().isEqual(LocalDateTime.now())) {
                party.setPartyStatus(Party.PartyStatus.PARTY_CLOSED);
                partyRepository.save(party);
            }
        }
    }

    // 파티 참가, 권한 추가 필요
    public void addPartyMember(long partyId, Member member) {
        Party party = findParty(partyId);

        if (canJoinParty(member, party)) {
            increasePartyCapacity(party);
            addMemberToParty(member, party);
        } else {
            decreasePartyCapacity(party);
            removeMemberFromParty(member, party);
        }
    }

    // 파티에 가입한 멤버인지 검사
    private boolean canJoinParty(Member member, Party party) {
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
}
