package com.ssudam.party.entity;

import com.ssudam.audit.Auditable;
import com.ssudam.bookmark.entity.Bookmark;
import com.ssudam.comment.entity.Comment;
import com.ssudam.member.entity.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Min;
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Column(nullable = false)
    private LocalDateTime meetingDate; //모임일자
    //모임장소
    @Column(nullable = false)
    private LocalDateTime closingDate; //모임모집마감일자

    @Column(nullable = false)
    private String phoneNumber; //연락처

    @Column(nullable = false)
    private String longitude; //경도

    @Column(nullable = false)
    private String latitude; //위도

    @Column(nullable = false)
    private String address;

    private String weather;

    @Column(nullable = false, length = 30)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    @Min(value = 2)
    private int maxCapacity; //최대 인원

    @Column(nullable = false)
    private int currentCapacity = 0; //현재 인원

    @Column(nullable = false)
    private int hits = 0; //조회수

    @Column(nullable = false)
    private int bookmarkCount;

    @OneToMany(mappedBy = "party",cascade = {CascadeType.REMOVE,CascadeType.PERSIST})
    private List<PartyMember> partyMembers = new ArrayList<>();

    @OneToMany(mappedBy = "party", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "party",cascade = {CascadeType.REMOVE,CascadeType.PERSIST})
    private List<Bookmark> bookmarks = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PartyStatus partyStatus = PartyStatus.PARTY_OPENED;

    public void addComment(Comment comment) {
        comments.add(comment);
        if (comment.getParty() != this) {
            comment.setParty(this);
        }
    }

    public void addBookmark(Bookmark bookmark) {
        bookmarks.add(bookmark);
        if (bookmark.getParty() != this) {
            bookmark.setParty(this);
        }
    }

    public enum PartyStatus {
        PARTY_OPENED("모집중"),
        PARTY_CLOSED("모집완료");

        @Getter
        private final String description;

        PartyStatus(String description) {
            this.description = description;
        }
    }

    public void addMember(Member member) {
        this.member = member;
        if (!this.member.getPartyLeaders().contains(this)) {
            this.member.getPartyLeaders().add(this);
        }
    }

    public void addPartyMember(PartyMember partyMember) {
        this.partyMembers.add(partyMember);
        if (partyMember.getParty() != this) {
            partyMember.addParty(this);
        }
    }
}
