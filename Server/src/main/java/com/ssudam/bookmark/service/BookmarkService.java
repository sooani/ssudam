package com.ssudam.bookmark.service;

import com.ssudam.bookmark.entity.Bookmark;
import com.ssudam.bookmark.repository.BookmarkRepository;
import com.ssudam.member.entity.Member;
import com.ssudam.member.service.MemberService;
import com.ssudam.party.entity.Party;
import com.ssudam.party.service.PartyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookmarkService {
    private final PartyService partyService;
    private final MemberService memberService;
    private final BookmarkRepository bookmarkRepository;

    public BookmarkService(PartyService partyService, MemberService memberService, BookmarkRepository bookmarkRepository) {
        this.partyService = partyService;
        this.memberService = memberService;
        this.bookmarkRepository = bookmarkRepository;
    }

    public void toggleBookmark(long partyId, long memberId){
        Member member = memberService.findMember(memberId);
        Party party = partyService.findVerifiedParty(partyId);
        if(!isPartyBookmarkedByUser(memberId, partyId)){
            party.setBookmarkCount(party.getBookmarkCount()+1);
            bookmarkRepository.save(new Bookmark(member,party));
        }
        else {
            party.setBookmarkCount(party.getBookmarkCount()-1);
            bookmarkRepository.deleteByMemberAndParty(member,party);
        }
    }
    public boolean isPartyBookmarkedByUser(long memberId, long partyId) {
        Member member = memberService.findMember(memberId);
        Party party = partyService.findVerifiedParty(partyId);
        return bookmarkRepository.existsByMemberAndParty(member,party);
    }
}
