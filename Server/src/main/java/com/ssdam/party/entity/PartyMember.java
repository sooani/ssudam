package com.ssdam.party.entity;

import com.ssdam.member.entity.Member;

import javax.persistence.*;

@Entity
public class PartyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long partyMemberId;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "PARTY_ID")
    private Party party;
}
