package com.ssudam.utils;

import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.restdocs.payload.JsonFieldType;

import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;

public class CommonResponseFields {
    public static final FieldDescriptor[] PARTY_DATA_FIELDS = new FieldDescriptor[]{
            fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터"),
            fieldWithPath("data.partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
            fieldWithPath("data.memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
            fieldWithPath("data.title").type(JsonFieldType.STRING).description("제목"),
            fieldWithPath("data.meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
            fieldWithPath("data.closingDate").type(JsonFieldType.STRING).description("모임 모집 마감 일자"),
            fieldWithPath("data.phoneNumber").type(JsonFieldType.STRING).description("연락처"),
            fieldWithPath("data.longitude").type(JsonFieldType.STRING).description("경도"),
            fieldWithPath("data.latitude").type(JsonFieldType.STRING).description("위도"),
            fieldWithPath("data.address").type(JsonFieldType.STRING).description("도로명 주소"),
            fieldWithPath("data.weather").type(JsonFieldType.STRING).description("날씨"),
            fieldWithPath("data.hits").type(JsonFieldType.NUMBER).description("조회수"),
            fieldWithPath("data.bookmarkCount").type(JsonFieldType.NUMBER).description("북마크"),
            fieldWithPath("data.content").type(JsonFieldType.STRING).description("내용"),
            fieldWithPath("data.maxCapacity").type(JsonFieldType.NUMBER).description("최대 인원"),
            fieldWithPath("data.currentCapacity").type(JsonFieldType.NUMBER).description("현재 인원"),
            fieldWithPath("data.partyStatus").type(JsonFieldType.STRING).description("글 상태 : 모집중 / 모집완료 "),
            fieldWithPath("data.createdAt").type(JsonFieldType.STRING).description("글 작성 날짜"),
            fieldWithPath("data.modifiedAt").type(JsonFieldType.STRING).description("글 수정 날짜")
    };
    public static final FieldDescriptor[] PARTY_DATA_LIST_FIELDS = new FieldDescriptor[]{
            fieldWithPath("data").description("결과 데이터"),
            fieldWithPath("data[].partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
            fieldWithPath("data[].memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
            fieldWithPath("data[].title").type(JsonFieldType.STRING).description("제목"),
            fieldWithPath("data[].meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
            fieldWithPath("data[].closingDate").type(JsonFieldType.STRING).description("모임 모집 마감 일자"),
            fieldWithPath("data[].phoneNumber").type(JsonFieldType.STRING).description("연락처"),
            fieldWithPath("data[].longitude").type(JsonFieldType.STRING).description("경도"),
            fieldWithPath("data[].latitude").type(JsonFieldType.STRING).description("위도"),
            fieldWithPath("data[].address").type(JsonFieldType.STRING).description("도로명 주소"),
            fieldWithPath("data[].weather").type(JsonFieldType.STRING).description("날씨"),
            fieldWithPath("data[].hits").type(JsonFieldType.NUMBER).description("조회수"),
            fieldWithPath("data[].bookmarkCount").type(JsonFieldType.NUMBER).description("북마크"),
            fieldWithPath("data[].content").type(JsonFieldType.STRING).description("내용"),
            fieldWithPath("data[].maxCapacity").type(JsonFieldType.NUMBER).description("최대 인원"),
            fieldWithPath("data[].currentCapacity").type(JsonFieldType.NUMBER).description("현재 인원"),
            fieldWithPath("data[].partyStatus").type(JsonFieldType.STRING).description("글 상태 : 모집중 / 모집완료 "),
            fieldWithPath("data[].createdAt").type(JsonFieldType.STRING).description("글 작성 날짜"),
            fieldWithPath("data[].modifiedAt").type(JsonFieldType.STRING).description("글 수정 날짜"),
            fieldWithPath("pageInfo").type(JsonFieldType.OBJECT).description("페이지 데이터"),
            fieldWithPath("pageInfo.page").type(JsonFieldType.NUMBER).description("페이지 번호"),
            fieldWithPath("pageInfo.size").type(JsonFieldType.NUMBER).description("페이지 크기"),
            fieldWithPath("pageInfo.totalElements").type(JsonFieldType.NUMBER).description("페이지 총 개수"),
            fieldWithPath("pageInfo.totalPages").type(JsonFieldType.NUMBER).description("페이지 총 번호")
    };
    public static final FieldDescriptor[] PAGE_INFO_FIELDS = new FieldDescriptor[]{
            fieldWithPath("pageInfo").type(JsonFieldType.OBJECT).description("페이지 데이터"),
            fieldWithPath("pageInfo.page").type(JsonFieldType.NUMBER).description("페이지 번호"),
            fieldWithPath("pageInfo.size").type(JsonFieldType.NUMBER).description("페이지 크기"),
            fieldWithPath("pageInfo.totalElements").type(JsonFieldType.NUMBER).description("페이지 총 개수"),
            fieldWithPath("pageInfo.totalPages").type(JsonFieldType.NUMBER).description("페이지 총 번호")
    };

}
