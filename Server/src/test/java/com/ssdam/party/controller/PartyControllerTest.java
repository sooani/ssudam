package com.ssdam.party.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.ssdam.party.dto.PartyDto;
import com.ssdam.party.entity.Party;
import com.ssdam.party.mapper.PartyMapper;
import com.ssdam.party.service.PartyService;
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

import static com.ssdam.util.ApiDocumentUtils.getRequestPreProcessor;
import static com.ssdam.util.ApiDocumentUtils.getResponsePreProcessor;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.delete;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    private PartyMapper mapper;

    @Test
    @DisplayName("postParty 테스트")
    void postPartyTest() throws Exception {
        System.out.println("postParty 테스트 시작");
        //given
        PartyDto.Post post = (PartyDto.Post) PartyStub.MockParty.getRequestBody(HttpMethod.POST);

        //직렬화 할때 nano 속성 제거해서 포함하지 않는 문자열 생성
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(post);
        System.out.println("전송하는 JSON 데이터: " + content);

        given(mapper.partyPostDtoToParty(Mockito.any(PartyDto.Post.class)))
                .willReturn(new Party());

        Party mockResultParty = new Party();
        mockResultParty.setPartyId(1L);

        given(partyService.createParty(Mockito.any(Party.class)))
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
                                        fieldWithPath("meetingDate").type(JsonFieldType.STRING).description("모임 날짜"),
                                        fieldWithPath("longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("address").type(JsonFieldType.STRING).description("도로명 주소"),
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
    @DisplayName("addPartyMember 테스트")
    public void addPartyMemberTest() {
        System.out.println("파티 참가 테스트 시작!");
        //given
        //when
        //then
    }

    @Test
    @DisplayName("patchParty 테스트")
    public void patchPartyTest() throws Exception {
        System.out.println("patchParty 테스트 시작!");
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
                .andExpect(jsonPath("$.data.meetingDate").value(patch.getMeetingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .andExpect(jsonPath("$.data.longitude").value(patch.getLongitude()))
                .andExpect(jsonPath("$.data.latitude").value(patch.getLatitude()))
                .andExpect(jsonPath("$.data.address").value(patch.getAddress()))
                .andExpect(jsonPath("$.data.content").value(patch.getContent()))
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
                                        fieldWithPath("meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
                                        fieldWithPath("longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("address").type(JsonFieldType.STRING).description("도로명 주소"),
                                        fieldWithPath("content").type(JsonFieldType.STRING).description("내용"),
                                        fieldWithPath("maxCapacity").type(JsonFieldType.NUMBER).description("최대 인원"),
                                        fieldWithPath("currentCapacity").type(JsonFieldType.NUMBER).description("현재 인원"),
                                        fieldWithPath("partyStatus").type(JsonFieldType.STRING).description("글 상태 : PARTY_OPENED / PARTY_CLOSED")
                                )
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터"),
                                        fieldWithPath("data.partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
                                        fieldWithPath("data.title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("data.meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
                                        fieldWithPath("data.longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("data.latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("data.address").type(JsonFieldType.STRING).description("도로명 주소"),
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
                .andExpect(jsonPath("$.data.partyId").value(responseDto.getPartyId()))
                .andExpect(jsonPath("$.data.title").value(patch.getTitle()))
                .andExpect(jsonPath("$.data.meetingDate").value(patch.getMeetingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .andExpect(jsonPath("$.data.longitude").value(patch.getLongitude()))
                .andExpect(jsonPath("$.data.latitude").value(patch.getLatitude()))
                .andExpect(jsonPath("$.data.address").value(patch.getAddress()))
                .andExpect(jsonPath("$.data.content").value(patch.getContent()))
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
                                        fieldWithPath("data.title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("data.meetingDate").type(JsonFieldType.STRING).description("모임 일자"),
                                        fieldWithPath("data.longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("data.latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("data.address").type(JsonFieldType.STRING).description("도로명 주소"),
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
                .andExpect(jsonPath("$.data").isArray())
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
                                        fieldWithPath("data[].partyId").type(JsonFieldType.NUMBER).description("모임 식별"),
                                        fieldWithPath("data[].title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("data[].meetingDate").type(JsonFieldType.STRING).description("모일 일자"),
                                        fieldWithPath("data[].longitude").type(JsonFieldType.STRING).description("경도"),
                                        fieldWithPath("data[].latitude").type(JsonFieldType.STRING).description("위도"),
                                        fieldWithPath("data[].address").type(JsonFieldType.STRING).description("도로명 주소"),
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
    @DisplayName("getPartiesMember 테스트")
    public void getPartiesMemberTest() throws Exception {
        System.out.println(" 특정 멤버가 작성한 모든 파티 조회 테스트 시작!");

        //given
//        long
        //when
        //then
    }

    @Test
    @DisplayName("deleteParty 테스트")
    public void deletePartyTest() throws Exception {
        System.out.println("deleteParty 테스트 시작");

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
                                parameterWithName("partyId").description("모임 식별자")
                        )));
    }
}