package com.ssudam.comment.entity;

import com.ssudam.audit.Auditable;
import com.ssudam.like.entity.Like;
import com.ssudam.member.entity.Member;
import com.ssudam.party.entity.Party;
import com.ssudam.reply.entity.Reply;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Comment extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long commentId;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "MEMBER_ID")
    private Member member;

    @Column(nullable = false)
    private int likeCount;

    @ManyToOne
    @JoinColumn(name = "PARTY_ID")
    private Party party;

    @OneToOne(mappedBy = "comment",cascade = {CascadeType.REMOVE})
    private Reply reply;

    @OneToMany(mappedBy = "comment",cascade = {CascadeType.REMOVE,CascadeType.PERSIST})
    private List<Like> likes;

    public void addMember(Member member) {
        this.member = member;
        if (!this.member.getComments().contains(this)) {
            this.member.getComments().add(this);
        }
    }

    public void addParty(Party party) {
        this.party = party;
        if (!this.party.getComments().contains(this)) {
            this.party.getComments().add(this);
        }
    }

    public void addReply(Reply reply) {
        this.reply = reply;
        if (reply.getComment() != this) {
            reply.setComment(this);
        }
    }

    public void addLike(Like like) {
        likes.add(like);
        if (like.getComment() != this) {
            like.setComment(this);
        }
    }
}
