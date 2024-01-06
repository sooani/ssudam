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
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.ssdam.util.ApiDocumentUtils.getRequestPreProcessor;
import static com.ssdam.util.ApiDocumentUtils.getResponsePreProcessor;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@AutoConfigureRestDocs
@MockBean(JpaMetamodelMappingContext.class)
@WebMvcTest(PartyController.class)
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
        PartyDto.Post post = new PartyDto.Post(
                "줍깅 모집 합니다!",
                LocalDateTime.parse("2024-02-21T15:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                "129.026370491329", "35.3368478896222",
                "경남 양산시 양산역6길 12",
                "2024년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
                5,
                2);

        //직렬화 할때 nano 속성 제거해서 포함하지 않는 문자열 생성
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(post);
        System.out.println("전송하는 JSON 데이터: " + content);

//        PartyDto.Response responseDto =
//                new PartyDto.Response(1L,
//                        "줍깅 모집합니다!",
//                        LocalDateTime.parse("2024-02-21T15:00", DateTimeFormatter.ISO_LOCAL_DATE_TIME),
//                        "129.026370491329","35.3368478896222",
//                        "경남 양산시 양산역6길 12",
//                        "2424년 2월 21일 오후 3시에 만나서 줍깅 하실분?",
//                        5,
//                        2, Party.PartyStatus.PARTY_OPENED);

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
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("제목"),
                                        fieldWithPath("meetingDate").type(JsonFieldType.STRING).description("모임 날짜"),
                                        fieldWithPath("location").type(JsonFieldType.STRING).description("모임 장소"),
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
}