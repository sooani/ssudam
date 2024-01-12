package com.ssdam.party.repository;

import com.ssdam.member.entity.Member;
import com.ssdam.party.entity.Party;
import com.ssdam.party.entity.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {
    List<Party> findByPartyMembers_Member_MemberId(Long memberId);
}
