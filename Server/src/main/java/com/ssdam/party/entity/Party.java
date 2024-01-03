package com.ssdam.party.entity;

import com.ssdam.audit.Auditable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Party extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long partyId;

    @Column(nullable = false)
    private LocalDateTime meetingDate; //모임일자

    @Column(nullable = false)
    private String location; //모임장소

    @Column(nullable = false, length = 30)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private int maxCapacity; //최대 인원

    private int currentCapacity; //현재 인원

    private int hits; //조회수

    @OneToMany(mappedBy = "party")
    private List<PartyMember> partyMembers = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PartyStatus partyStatus = PartyStatus.PARTY_OPENED;

    public enum PartyStatus {
        PARTY_OPENED("모집중"),
        PARTY_CLOSED("모집완료");

        @Getter
        private final String description;

        PartyStatus(String description) {
            this.description = description;
        }
    }
}
