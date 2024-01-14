package com.ssdam.member.entity;

import com.ssdam.audit.Auditable;
import com.ssdam.party.entity.Party;
import com.ssdam.party.entity.PartyMember;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Member extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long memberId;

    @Column(nullable = false, updatable = false, unique = true)
    private String email;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 100, nullable = false)
    private String nickname;

    @Enumerated(value = EnumType.STRING)
    @Column(length = 20, nullable = false)
    private MemberStatus memberStatus = MemberStatus.MEMBER_ACTIVE;

    @OneToMany(mappedBy = "member")
    private List<Party> partyLeaders = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<PartyMember> partyMembers = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>(); // 사용자의 권한을 등록하기 위한 권한 테이블

    public Member(String email) {
        this.email = email;
    }

    public void addPartyLeader(Party party) {
        partyLeaders.add(party);
        if (party.getMember() != this) {
            party.setMember(this);
        }
    }

    public void addPartyMember(PartyMember partyMember) {
        this.partyMembers.add(partyMember);
        if (partyMember.getMember() != this) {
            partyMember.addMember(this);
        }
    }

    public enum MemberStatus {
        MEMBER_ACTIVE("활동중"),
        MEMBER_SLEEP("휴면 상태"),
        MEMBER_QUIT("탈퇴 상태");

        @Getter
        private String status;

        MemberStatus(String status) {
            this.status = status;
        }
    }

}
