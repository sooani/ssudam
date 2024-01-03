package com.ssdam.party.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Party {
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

    @CreationTimestamp
    private LocalDateTime createdAt; //글 작성날짜

    @UpdateTimestamp
    private LocalDateTime lastModifiedAt; //글 수정날짜

    @Enumerated(EnumType.STRING)
    private PartyStatus partyStatus = PartyStatus.PARTY_OPENED;

    public enum PartyStatus {
        PARTY_OPENED("모임 모집중 상태"),
        PARTY_CLOSED("모집 완료 상태");

        @Getter
        private final String description;

        PartyStatus(String description) {
            this.description = description;
        }
    }
}
