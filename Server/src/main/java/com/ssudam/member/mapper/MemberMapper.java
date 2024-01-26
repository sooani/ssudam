package com.ssudam.member.mapper;

import com.ssudam.member.dto.MemberPatchDto;
import com.ssudam.member.dto.MemberPostDto;
import com.ssudam.member.dto.MemberResponseDto;
import com.ssudam.member.entity.Member;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {
    Member memberPostDtoToMember(MemberPostDto memberPostDto);

    Member memberPatchDtoToMember(MemberPatchDto memberPatchDto);

    MemberResponseDto memberToMemberResponseDto(Member member);

    List<MemberResponseDto> membersToMemberResponseDto(List<Member> members);
}
