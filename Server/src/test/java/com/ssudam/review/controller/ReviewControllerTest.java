package com.ssudam.review.controller;

import com.google.gson.Gson;
import com.jayway.jsonpath.JsonPath;
import com.ssudam.member.entity.Member;
import com.ssudam.member.service.MemberService;
import com.ssudam.review.dto.ReviewDto;
import com.ssudam.review.entity.Review;
import com.ssudam.review.mapper.ReviewMapper;
import com.ssudam.review.service.ReviewService;
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
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.List;

import static com.ssudam.utils.ApiDocumentUtils.getRequestPreProcessor;
import static com.ssudam.utils.ApiDocumentUtils.getResponsePreProcessor;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willReturn;
import static org.mockito.Mockito.doNothing;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
@TestPropertySource(properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration")
public class ReviewControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private Gson gson;
    @MockBean
    private ReviewService reviewService;
    @MockBean
    private MemberService memberService;
    @MockBean
    private ReviewMapper mapper;

    @Test
    void postReviewTest() throws Exception {
        // given
        ReviewDto.Post post = (ReviewDto.Post) ReviewStub.getRequestBody(HttpMethod.POST);
        String content = gson.toJson(post);

        Member mockMember = new Member();
        mockMember.setMemberId(1L);
        given(memberService.findMember(Mockito.anyLong())).willReturn(mockMember);
        Review mockResultReview = new Review();
        mockResultReview.setMember(mockMember);
        given(mapper.reviewPostDtoToReview(any(ReviewDto.Post.class))).willReturn(new Review());
        given(reviewService.createReview(Mockito.any(Review.class))).willReturn(mockResultReview);

        // when
        ResultActions actions =
                mockMvc.perform(
                        post("/v1/reviews")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content));

        // then
        actions
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", is(startsWith("/v1/reviews/"))))
                .andDo(document("post-review",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                List.of(
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("멤버 식별자"),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("content").type(JsonFieldType.STRING).description("후기 내용")
                                )
                        ),
                        responseHeaders(
                                headerWithName(HttpHeaders.LOCATION).description("Location Header. 등록된 리소스의 URI")
                        )

                ));
    }

    @Test
    public void patchReviewTest() throws Exception {
        // given
        long reviewId = 1L;

        ReviewDto.Patch patch = (ReviewDto.Patch) ReviewStub.getRequestBody(HttpMethod.PATCH);
        String content = gson.toJson(patch);

        ReviewDto.Response responseDto = ReviewStub.getSingleResponseBody();

        given(mapper.reviewPatchDtoToReview(Mockito.any(ReviewDto.Patch.class))).willReturn(new Review());
        given(reviewService.updateReview(Mockito.any(Review.class))).willReturn(new Review());
        given(mapper.reviewToReviewResponseDto(Mockito.any(Review.class))).willReturn(responseDto);

        // when
        ResultActions actions =
                mockMvc.perform(
                        patch("/v1/reviews/{review-id}", reviewId)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content));

        // then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.reviewId").value(reviewId))
                .andExpect(jsonPath("$.data.title").value(responseDto.getTitle()))
                .andExpect(jsonPath("$.data.content").value(responseDto.getContent()))
                .andDo(document("patch-review",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                List.of(parameterWithName("review-id").description("후기 식별자"))
                        ),
                        requestFields(
                                List.of(
                                        fieldWithPath("reviewId").type(JsonFieldType.NUMBER).description("후기 식별자"),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("content").type(JsonFieldType.STRING).description("후기 내용")
                                )
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과데이터"),
                                        fieldWithPath("data.memberId").type(JsonFieldType.NUMBER).description("멤버 식별자"),
                                        fieldWithPath("data.reviewId").type(JsonFieldType.NUMBER).description("후기 식별자"),
                                        fieldWithPath("data.title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("data.content").type(JsonFieldType.STRING).description("후기 내용"),
                                        fieldWithPath("data.createdAt").type(JsonFieldType.STRING).description("후기 등록 날짜"),
                                        fieldWithPath("data.modifiedAt").type(JsonFieldType.STRING).description("후기 수정 날짜")
                                )
                        )
                ));
    }

    @Test
    public void getReviewsByMemberTest() throws Exception {
        // given
        long memberId = 1L;

        Page<Review> reviews = ReviewStub.getMultiReviews();
        List<ReviewDto.Response> responses = ReviewStub.getMultiResponseBody();

        given(reviewService.findAllReviewsByMemberId(memberId, 0, 10)).willReturn(reviews);
        given(mapper.reviewsToReviewResponseDtos(Mockito.anyList())).willReturn(responses);

        String page = "1";
        String size = "10";

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("page", page);
        queryParams.add("size", size);

        // when
        ResultActions actions =
                mockMvc.perform(
                        get("/v1/reviews/member/{member-id}", memberId)
                                .params(queryParams)
                                .accept(MediaType.APPLICATION_JSON)
                );

        // then
        actions.andExpect(status().isOk())
                .andDo(document("get-review-by-member",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                List.of(
                                        parameterWithName("member-id").description("멤버 식별자")
                                )
                        ),
                        requestParameters(
                                parameterWithName("page").description("Page 번호"),
                                parameterWithName("size").description("Page 크기")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과데이터"),
                                        fieldWithPath("data[].memberId").type(JsonFieldType.NUMBER).description("멤버 식별자"),
                                        fieldWithPath("data[].reviewId").type(JsonFieldType.NUMBER).description("후기 식별자"),
                                        fieldWithPath("data[].title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("data[].content").type(JsonFieldType.STRING).description("후기 내용"),
                                        fieldWithPath("data[].createdAt").type(JsonFieldType.STRING).description("후기 등록 날짜"),
                                        fieldWithPath("data[].modifiedAt").type(JsonFieldType.STRING).description("후기 수정 날짜"),
                                        fieldWithPath("pageInfo").type(JsonFieldType.OBJECT).description("Page 정보"),
                                        fieldWithPath("pageInfo.page").type(JsonFieldType.NUMBER).description("Page 번호"),
                                        fieldWithPath("pageInfo.size").type(JsonFieldType.NUMBER).description("Page 크기"),
                                        fieldWithPath("pageInfo.totalElements").type(JsonFieldType.NUMBER).description("전체 후기 개수"),
                                        fieldWithPath("pageInfo.totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수")
                                )
                        )
                ));
    }

    @Test
    public void getReviewTest() throws Exception {
        // given
        long reviewId = 1L;

        ReviewDto.Response responseDto = ReviewStub.getSingleResponseBody();

        given(reviewService.findReview(reviewId)).willReturn(new Review());
        given(mapper.reviewToReviewResponseDto(any(Review.class))).willReturn(responseDto);

        // when
        ResultActions actions =
                mockMvc.perform(
                        get("/v1/reviews/{review-id}", reviewId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON));

        // then
        actions.andExpect(status().isOk())
                .andDo(document("get-review",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                parameterWithName("review-id").description("후기 식별자")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과데이터"),
                                        fieldWithPath("data.memberId").type(JsonFieldType.NUMBER).description("멤버 식별자"),
                                        fieldWithPath("data.reviewId").type(JsonFieldType.NUMBER).description("후기 식별자"),
                                        fieldWithPath("data.title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("data.content").type(JsonFieldType.STRING).description("후기 내용"),
                                        fieldWithPath("data.createdAt").type(JsonFieldType.STRING).description("후기 등록 날짜"),
                                        fieldWithPath("data.modifiedAt").type(JsonFieldType.STRING).description("후기 수정 날짜")
                                )
                        )
                ));
    }

    @Test
    public void getReviewsTest() throws Exception {
        // given
        Page<Review> reviews = ReviewStub.getMultiReviews();
        List<ReviewDto.Response> responses = ReviewStub.getMultiResponseBody();

        given(reviewService.findAll( 1, 10)).willReturn(reviews);
        given(mapper.reviewsToReviewResponseDtos(Mockito.anyList())).willReturn(responses);

        String page = "1";
        String size = "10";

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("page", page);
        queryParams.add("size", size);

        // when
        ResultActions actions =
                mockMvc.perform(
                        get("/v1/reviews")
                                .params(queryParams)
                                .accept(MediaType.APPLICATION_JSON));

        // then
        actions.andExpect(status().isOk())
                .andDo(document("get-reviews",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestParameters(
                                parameterWithName("page").description("Page 번호"),
                                parameterWithName("size").description("Page 크기")
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과데이터"),
                                        fieldWithPath("data[].memberId").type(JsonFieldType.NUMBER).description("멤버 식별자"),
                                        fieldWithPath("data[].reviewId").type(JsonFieldType.NUMBER).description("후기 식별자"),
                                        fieldWithPath("data[].title").type(JsonFieldType.STRING).description("후기 제목"),
                                        fieldWithPath("data[].content").type(JsonFieldType.STRING).description("후기 내용"),
                                        fieldWithPath("data[].createdAt").type(JsonFieldType.STRING).description("후기 등록 날짜"),
                                        fieldWithPath("data[].modifiedAt").type(JsonFieldType.STRING).description("후기 수정 날짜"),
                                        fieldWithPath("pageInfo").type(JsonFieldType.OBJECT).description("Page 정보"),
                                        fieldWithPath("pageInfo.page").type(JsonFieldType.NUMBER).description("Page 번호"),
                                        fieldWithPath("pageInfo.size").type(JsonFieldType.NUMBER).description("Page 크기"),
                                        fieldWithPath("pageInfo.totalElements").type(JsonFieldType.NUMBER).description("전체 후기 개수"),
                                        fieldWithPath("pageInfo.totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수")
                                )
                        )
                ));
    }

    @Test
    public void deleteReviewTest() throws Exception {
        // given
        long reviewId = 1L;

        doNothing().when(reviewService).deleteReview(Mockito.anyLong());

        // when
        ResultActions actions =
                mockMvc.perform(delete("/v1/reviews/{review-id}", reviewId));

        // then
        actions.andExpect(status().isNoContent())
                .andDo(document("delete-review",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("review-id").description("후기 식별자")
                        )));

    }
}
