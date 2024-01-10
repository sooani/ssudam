package com.ssdam.party.repository;

import com.ssdam.party.entity.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {
    List<Party> findByMember_MemberId(Long memberId);

    List<Party> findByPartyMembers_Member_MemberId(Long memberId);// 참여한 파티

    List<Party> findByMeetingDateBeforeAndPartyStatus(LocalDateTime meetingDate, Party.PartyStatus partyStatus);

    Page<Party> findByCreatedAtAfter(LocalDateTime dateTime, Pageable pageable);
}
