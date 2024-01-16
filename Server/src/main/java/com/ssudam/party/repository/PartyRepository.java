package com.ssudam.party.repository;

import com.ssudam.party.entity.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {
    List<Party> findByMember_MemberId(Long memberId);

    // 모임에 참여한 멤버 조회
    List<Party> findByPartyMembers_Member_MemberId(Long memberId);

    //모임 일자와 모임 종료일자가 현재 날짜보다 같거나 이전일때 모임상태 조회
    List<Party> findByMeetingDateBeforeOrClosingDateBeforeOrPartyStatus(LocalDateTime meetingDate, LocalDateTime closingDate,
                                                                        Party.PartyStatus partyStatus);

    // 특정 시간 이후 조회
    Page<Party> findByCreatedAtAfter(LocalDateTime dateTime, Pageable pageable);

    // 제목과 내용 검색
    Page<Party> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}
