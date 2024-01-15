package com.ssudam.bookmark.repository;

import com.ssudam.bookmark.entity.Bookmark;
import com.ssudam.member.entity.Member;
import com.ssudam.party.entity.Party;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByMemberAndParty(Member member, Party party);

    void deleteByMemberAndParty(Member member, Party party);
}
