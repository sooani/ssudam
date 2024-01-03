package com.ssdam.comment.entity;

import com.ssdam.member.entity.Member;
import com.ssdam.party.entity.Party;
import com.ssdam.reply.entity.Reply;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long commentId;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "PARTY_ID")
    private Party party;

    @OneToOne
    private Reply reply;
}
