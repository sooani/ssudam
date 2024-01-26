package com.ssudam.party.repository;

import com.ssudam.member.entity.Member;
import com.ssudam.party.entity.Party;
import com.ssudam.party.entity.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long> {

    // 파티랑 멤버 조회
    boolean existsByMemberAndParty(Member member, Party party);

    // 파티랑 멤버 삭제
    void deleteByMemberAndParty(Member member, Party party);
}
