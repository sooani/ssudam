package com.ssudam.party.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.ssudam.exception.BusinessLogicException;
import com.ssudam.exception.ExceptionCode;
import com.ssudam.member.dto.MemberPostDto;
import com.ssudam.member.entity.Member;
import com.ssudam.member.service.MemberService;
import com.ssudam.party.dto.PartyDto;
import com.ssudam.party.entity.Party;
import com.ssudam.party.mapper.PartyMapper;
import com.ssudam.party.service.PartyService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.ssudam.utils.ApiDocumentUtils.getRequestPreProcessor;
import static com.ssudam.utils.ApiDocumentUtils.getResponsePreProcessor;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@AutoConfigureRestDocs
@MockBean(JpaMetamodelMappingContext.class)
@WebMvcTest(PartyController.class)
@TestPropertySource(properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration")
public class PartyControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private Gson gson;
    @MockBean
    private PartyService partyService;
    @MockBean
    private MemberService memberService;
    @MockBean
    private PartyMapper mapper;

    @Test
    @DisplayName("postParty 테스트")
    void postPartyTest() throws Exception {
        System.out.println("모임 생성 테스트 시작");
        //given
        PartyDto.Post post = (PartyDto.Post) PartyStub.MockParty.getRequestBody(HttpMethod.POST);
        Member mockMember = new Member();
        mockMember.setMemberId(1l);

        //직렬화 할때 nano 속성 제거해서 포함하지 않는 문자열 생성
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(post);
        System.out.println("전송하는 JSON 데이터: " + content);

        given(memberService.findMember(Mockito.anyLong()))
                .willReturn(mockMember);
        given(mapper.partyPostDtoToParty(Mockito.any(PartyDto.Post.class)))
                .willReturn(new Party());

        Party mockResultParty = new Party();
        mockResultParty.setPartyId(1L);

        given(partyService.createParty(Mockito.any(Party.class), Mockito.any(Member.class)))
                .willReturn(mockResultParty);

        //when
        ResultActions actions =
                mockMvc.perform(
                        post("/v1/parties")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );
        //then
        //테스트 실행 후 검증
        System.out.println("전송받는 JSON 데이터: " + content);
        actions
                .andExpect(status().isCreated())
                .andExpect(header().string("location", is(startsWith("/v1/parties/"))))
                .andDo(document("post-party",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestFields(
                                List.of(
                                        fieldWithPath("meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
                                        fieldWithPath("closingDate").type(JsonFieldType.STRING).description("모임 모집 마감 일자"),
                                        fieldWithPath("longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("address").type(JsonFieldType.STRING).description("도로명 주소"),
                                        fieldWithPath("phoneNumber").type(JsonFieldType.STRING).description("연락처"),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("content").type(JsonFieldType.STRING).description("본문 내용"),
                                        fieldWithPath("maxCapacity").type(JsonFieldType.NUMBER).description("최대 인원"),
                                        fieldWithPath("currentCapacity").type(JsonFieldType.NUMBER).description("현재 인원")
                                )
                        ),
                        responseHeaders(
                                headerWithName(HttpHeaders.LOCATION).description("Location header. 등록된 리소스의 URI")
                        )
                ));
    }

    @Test
    @DisplayName("postPartyMember 테스트")
    void postPartyMemberTest() throws Exception {
        System.out.println("모임 참가 테스트 시작!");
        // given
        long partyId = 1L;
        MemberPostDto post = new MemberPostDto("ssss@naver.com", "ssss@ssss", "ssss@ssss", "쌀국수먹고싶다");

        String content = gson.toJson(post);

        doNothing().when(partyService).addPartyMember(Mockito.anyLong(), Mockito.any(Member.class));

        // when
        ResultActions result = mockMvc.perform(
                post("/v1/parties/{party-id}", partyId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content)
        );

        // then
        result.andExpect(status().isCreated())
                .andDo(document("post-party-member",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("party-id").description("모임 식별자")
                        ),
                        requestFields(
                                fieldWithPath("email").description("회원 이메일"),
                                fieldWithPath("password").description("회원 비밀번호"),
                                fieldWithPath("confirmPassword").description("비밀번호 확인"),
                                fieldWithPath("nickname").description("회원 닉네임")
                        )

                ));
    }

    @Test
    @DisplayName("postPartyMemberError 테스트")
    void postPartyMemberErrorTest() throws Exception {
        System.out.println("종료된 모임 참가 테스트 시작!");
        //given
        long partyId = 1L;
        Party closedParty = new Party();
        closedParty.setPartyStatus(Party.PartyStatus.PARTY_CLOSED);  // PartyStatus 마감으로 설정

        MemberPostDto post = new MemberPostDto("ssss@naver.com", "ssss@ssss", "ssss@ssss", "쌀국수먹고싶다");
        String content = gson.toJson(post);

        System.out.println("400 PARTY_CLOSED_ERROR 발생시킵니다!");

        doThrow(new BusinessLogicException(ExceptionCode.PARTY_CLOSED_ERROR))
                .when(partyService).addPartyMember(Mockito.anyLong(), Mockito.any(Member.class));

        //when
        ResultActions actions =
                mockMvc.perform(
                        RestDocumentationRequestBuilders.post("/v1/parties/{party-id}", partyId)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );
        //then
        actions
                .andExpect(status().isBadRequest())
                .andDo(document("post-party-member-error",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestFields(
                                List.of(
                                        fieldWithPath("email").description("회원 이메일"),
                                        fieldWithPath("password").description("회원 비밀번호"),
                                        fieldWithPath("confirmPassword").description("비밀번호 확인"),
                                        fieldWithPath("nickname").description("회원 닉네임")
                                )
                        )));
    }

    @Test
    @DisplayName("patchParty 테스트")
    public void patchPartyTest() throws Exception {
        System.out.println("모임 수정 테스트 시작!");
        //given
        long partyId = 1L;
        PartyDto.Patch patch = (PartyDto.Patch) PartyStub.MockParty.getRequestBody(HttpMethod.PATCH);

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(patch);

        PartyDto.Response responseDto = PartyStub.MockParty.getSingleResponseBody();

        given(mapper.partyPatchDtoToParty(Mockito.any(PartyDto.Patch.class)))
                .willReturn(new Party());
        given(partyService.updateParty(Mockito.any(Party.class)))
                .willReturn(new Party());
        given(mapper.partyToPartyResponse(Mockito.any(Party.class)))
                .willReturn(responseDto);

        //when
        ResultActions actions =
                mockMvc.perform(
                        RestDocumentationRequestBuilders.patch("/v1/parties/{party-id}", partyId)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );
        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.partyId").value(patch.getPartyId()))
                .andExpect(jsonPath("$.data.title").value(patch.getTitle()))
                .andExpect(jsonPath("$.data.maxCapacity").value(patch.getMaxCapacity()))
                .andExpect(jsonPath("$.data.currentCapacity").value(patch.getCurrentCapacity()))
                .andExpect(jsonPath("$.data.partyStatus").value(patch.getPartyStatus().toString()))
                .andDo(document("patch-party",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("party-id").description("모임 식별자")
                        ),
                        requestFields(
                                List.of(
                                        fieldWithPath("partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("maxCapacity").type(JsonFieldType.NUMBER).description("최대 인원"),
                                        fieldWithPath("currentCapacity").type(JsonFieldType.NUMBER).description("현재 인원"),
                                        fieldWithPath("partyStatus").type(JsonFieldType.STRING).description("글 상태 : PARTY_OPENED / PARTY_CLOSED")
                                )
                        ),
                        responseFields(
                                List.of(
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
                                )
                        )
                ));

    }

    @Test
    @DisplayName("getParty 테스트")
    public void getPartyTest() throws Exception {
        System.out.println("단일 모임 조회 테스트 시작!");
        //given
        long partyId = 1L;
        PartyDto.Patch patch = (PartyDto.Patch) PartyStub.MockParty.getRequestBody(HttpMethod.PATCH);

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(patch);

        PartyDto.Response responseDto = PartyStub.MockParty.getSingleResponseBody();

        given(partyService.findParty(Mockito.anyLong()))
                .willReturn(new Party());
        given(mapper.partyToPartyResponse(Mockito.any(Party.class)))
                .willReturn(responseDto);

        //when
        ResultActions actions = mockMvc.perform(
                get("/v1/parties/{party-id}", partyId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then

        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.partyId").value(patch.getPartyId()))
                .andExpect(jsonPath("$.data.title").value(patch.getTitle()))
                .andExpect(jsonPath("$.data.maxCapacity").value(patch.getMaxCapacity()))
                .andExpect(jsonPath("$.data.currentCapacity").value(patch.getCurrentCapacity()))
                .andExpect(jsonPath("$.data.partyStatus").value(patch.getPartyStatus().toString()))
                .andDo(document("get-party",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("party-id").description("파티 식별자")
                        ),
                        responseFields(
                                List.of(
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
                                )
                        )));

    }

    @Test
    @DisplayName("getParties 테스트")
    public void getPartiesTest() throws Exception {
        System.out.println("모든 모임 조회 테스트 시작!");
        //given

        Page<PartyDto.Response> pageParties = PartyStub.MockParty.getMultiResponseBody();
        List<PartyDto.Response> responses = PartyStub.MockParty.getListResponseBody();

        given(partyService.findParties(Mockito.anyInt(), Mockito.anyInt()))
                .willReturn((Page) pageParties);
        given(mapper.partiesToPartyResponses(Mockito.anyList()))
                .willReturn(responses);

        String page = "1";
        String size = "10";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("page", page);
        queryParams.add("size", size);

        //when
        ResultActions actions = mockMvc.perform(
                get("/v1/parties")
                        .params(queryParams)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then
        actions
                .andExpect(status().isOk())
                .andDo(document("get-parties",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestParameters(
                                List.of(parameterWithName("page").description("페이지 번호"),
                                        parameterWithName("size").description("페이지 크기"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
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
                                ))));
    }

    @Test
    @DisplayName("getPartiesByMember 테스트")
    public void getPartiesByMemberTest() throws Exception {
        System.out.println("특정 멤버가 작성한 모든 모임 조회 테스트 시작!");
        //given
        Page<PartyDto.Response> pageParties = PartyStub.MockParty.getMultiResponseBody();
        List<PartyDto.Response> responses = PartyStub.MockParty.getListResponseBody();

        given(partyService.findPartiesByMember(Mockito.anyLong(), Mockito.anyInt(), Mockito.anyInt()))
                .willReturn((Page) pageParties);
        given(mapper.partiesToPartyResponses(Mockito.anyList()))
                .willReturn(responses);

        String page = "1";
        String size = "10";
        String memberId = "1";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("memberId", memberId);
        queryParams.add("page", page);
        queryParams.add("size", size);

        ResultActions actions = mockMvc.perform(
                get("/v1/parties")
                        .params(queryParams)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andDo(document("get-parties-by-member",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestParameters(
                                List.of(parameterWithName("memberId").description("회원 식별자"),
                                        parameterWithName("page").description("페이지 번호"),
                                        parameterWithName("size").description("페이지 크기"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
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
                                ))));
    }

    @Test
    @DisplayName("getPartiesByPartyMember 테스트")
    public void getPartiesByPartyMemberTest() throws Exception {
        System.out.println("특정 멤버가 참여한 모든 모임 조회 테스트 시작!");
        //given
        Page<PartyDto.Response> pageParties = PartyStub.MockParty.getMultiResponseBody();
        List<PartyDto.Response> responses = PartyStub.MockParty.getListResponseBody();

        given(partyService.findPartiesByPartyMember(Mockito.anyLong(), Mockito.anyInt(), Mockito.anyInt()))
                .willReturn((Page) pageParties);
        given(mapper.partiesToPartyResponses(Mockito.anyList()))
                .willReturn(responses);

        String page = "1";
        String size = "10";
        String partyMemberId = "1";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("partyMemberId", partyMemberId);
        queryParams.add("page", page);
        queryParams.add("size", size);

        ResultActions actions = mockMvc.perform(
                get("/v1/parties")
                        .params(queryParams)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andDo(document("get-parties-by-party-member",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestParameters(
                                List.of(parameterWithName("partyMemberId").description("모임에 참여한 회원(모임회원) 식별자"),
                                        parameterWithName("page").description("페이지 번호"),
                                        parameterWithName("size").description("페이지 크기"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
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
                                ))));
    }

    @Test
    @DisplayName("getLatestParties 테스트")
    public void getLatestPartiesTest() throws Exception {
        System.out.println("2일 이내에 작성된 모임 조회 테스트 시작!");
        //given
        Page<PartyDto.Response> pageParties = PartyStub.MockParty.getMultiResponseBody();
        List<PartyDto.Response> responses = PartyStub.MockParty.getListResponseBody();

        given(partyService.findLatestParties(Mockito.anyInt(), Mockito.anyInt()))
                .willReturn((Page) pageParties);
        given(mapper.partiesToPartyResponses(Mockito.anyList()))
                .willReturn(responses);

        String page = "1";
        String size = "10";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("page", page);
        queryParams.add("size", size);

        ResultActions actions = mockMvc.perform(
                get("/v1/parties/latest")
                        .params(queryParams)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andDo(document("get-latest-parties",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestParameters(
                                List.of(parameterWithName("page").description("페이지 번호"),
                                        parameterWithName("size").description("페이지 크기"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
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
                                ))));
    }

    @Test
    @DisplayName("getPartiesWithTitleOrContent 테스트")
    public void getPartiesWithTitleOrContentTest() throws Exception {
        System.out.println("키워드로 제목, 글 내용 검색 테스트 시작!");
        //given
        Page<PartyDto.Response> pageParties = PartyStub.MockParty.getMultiResponseBody();
        List<PartyDto.Response> responses = PartyStub.MockParty.getListResponseBody();

        given(partyService.searchPartiesByTitleAndContent(Mockito.anyString(), Mockito.anyInt(), Mockito.anyInt()))
                .willReturn((Page) pageParties);
        given(mapper.partiesToPartyResponses(Mockito.anyList()))
                .willReturn(responses);

        String keyword = "모임";
        String page = "1";
        String size = "10";
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("keyword", keyword);
        queryParams.add("page", page);
        queryParams.add("size", size);

        ResultActions actions = mockMvc.perform(
                get("/v1/parties/search")
                        .params(queryParams)
                        .accept(MediaType.APPLICATION_JSON)
        );
        //then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andDo(document("get-parties-with-title-or-content",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        requestParameters(
                                List.of(parameterWithName("keyword").description("검색어"),
                                        parameterWithName("page").description("페이지 번호"),
                                        parameterWithName("size").description("페이지 크기"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터"),
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
                                ))));
    }

    @Test
    @DisplayName("deleteParty 테스트")
    public void deletePartyTest() throws Exception {
        System.out.println("단일 모임 삭제 테스트 시작");

        //given
        long partyId = 1L;

        doNothing().when(partyService).deleteParty(any(long.class));

        //when
        ResultActions actions = mockMvc.perform(
                delete("/v1/parties/{partyId}", partyId));

        //then
        actions
                .andExpect(status().isNoContent())
                .andDo(document("delete-party",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("partyId").description("회원 식별자")
                        )));
    }
}