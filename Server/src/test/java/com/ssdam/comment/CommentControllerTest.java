package com.ssdam.comment;

import com.google.gson.Gson;
import com.ssdam.comment.controller.CommentController;
import com.ssdam.comment.dto.CommentDto;
import com.ssdam.comment.entity.Comment;
import com.ssdam.comment.mapper.CommentMapper;
import com.ssdam.comment.service.CommentService;
import com.ssdam.member.entity.Member;
import com.ssdam.party.entity.Party;
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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommentController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
@TestPropertySource(properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration")
public class CommentControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private CommentService commentService;
    @MockBean
    private CommentMapper mapper;
    @Autowired
    private Gson gson;

    @Test
    public void postCommentTest() throws Exception {
        //given
        Party party = new Party();
        party.setPartyId(1L);

        Member member = new Member();
        member.setMemberId(1L);

        CommentDto.Post post = new CommentDto.Post(1L, 1L, "Sample Comment");
        String content = gson.toJson(post);

        given(mapper.commentPostDtoToComment(Mockito.any(CommentDto.Post.class))).willReturn(new Comment());
        Comment mockResultComment = new Comment();
        mockResultComment.setCommentId(1L);
        given(commentService.createComment(Mockito.any(Comment.class))).willReturn(mockResultComment);
        //when
        ResultActions actions =
                mockMvc.perform(
                        post("/v1/comments")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );
        //then
        actions
                .andExpect(status().isCreated())
                .andExpect(header().string("location", is(startsWith("/v1/comments/"))))
                .andDo(document("post-comment",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                List.of(
                                        fieldWithPath("partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
                                        fieldWithPath("memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
                                        fieldWithPath("content").type(JsonFieldType.STRING).description("댓글 내용")
                                )
                        ),
                        responseHeaders(
                                headerWithName(HttpHeaders.LOCATION).description("Location header. 등록된 리소스의 URI. ex)v1/comments/1")
                        )
                ));
    }
//    CommentDto.Response responseDto
//            = CommentDto.Response.builder()
//            .commentId(1L)
//            .memberId(1L)
//            .comment("Sample Comment")
//            .createdAt(LocalDateTime.now())
//            .modifiedAt(LocalDateTime.now())
//            .build();
}
