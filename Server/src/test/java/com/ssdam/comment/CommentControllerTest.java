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
import org.springframework.restdocs.constraints.ConstraintDescriptions;
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
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.snippet.Attributes.key;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
        ConstraintDescriptions postCommentConstraints = new ConstraintDescriptions(CommentDto.Post.class);
        List<String> commentDescriptions = postCommentConstraints.descriptionsForProperty("comment");

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
                                        fieldWithPath("comment").type(JsonFieldType.STRING).description("댓글 내용")
                                                .attributes(key("constraints").value(commentDescriptions))
                                                .optional()
                                )
                        ),
                        responseHeaders(
                                headerWithName(HttpHeaders.LOCATION).description("Location header. 등록된 리소스의 URI. ex)v1/comments/1")
                        )
                ));
    }


    @Test
    public void patchCommentTest () throws Exception {
        //given
        Party party = new Party();
        party.setPartyId(1L);

        Member member = new Member();
        member.setMemberId(1L);

        long commentId = 1L;

        CommentDto.Patch patch
                = CommentDto.Patch.builder()
                .commentId(commentId)
                .comment("Patched Comment")
                .build();

        String content = gson.toJson(patch);

        CommentDto.Response responseDto
                = CommentDto.Response.builder()
                .commentId(commentId)
                .partyId(party.getPartyId())
                .memberId(member.getMemberId())
                .comment("Patched Comment")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        given(mapper.commentPatchDtoToComment(Mockito.any(CommentDto.Patch.class))).willReturn(new Comment());
        given(commentService.updateComment(Mockito.any(Comment.class))).willReturn(new Comment());
        given(mapper.commentToCommentResponse(Mockito.any(Comment.class))).willReturn(responseDto);
        //when
        ResultActions actions =
                mockMvc.perform(
                        patch("/v1/comments/{comment-id}", commentId)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content)
                );
        //then
        ConstraintDescriptions patchCommentConstraints = new ConstraintDescriptions(CommentDto.Patch.class);
        List<String> commentDescriptions = patchCommentConstraints.descriptionsForProperty("comment");

        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.commentId").value(commentId))
                .andExpect(jsonPath("$.data.partyId").value(responseDto.getPartyId()))
                .andExpect(jsonPath("$.data.memberId").value(responseDto.getMemberId()))
                .andExpect(jsonPath("$.data.comment").value(responseDto.getComment()))
                .andExpect(jsonPath("$.data.createdAt").value(responseDto.getCreatedAt().toString()))
                .andExpect(jsonPath("$.data.modifiedAt").value(responseDto.getModifiedAt().toString()))
                .andDo(document("patch-comment",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                List.of(parameterWithName("comment-id").description("댓글 식별자 ID"))
                        ),
                        requestFields(
                                List.of(
                                        fieldWithPath("commentId").type(JsonFieldType.NUMBER)
                                                .description("댓글 식별자").ignored(),
                                        fieldWithPath("comment").type(JsonFieldType.STRING).description("댓글 내용")
                                                .attributes(key("constraints").value(commentDescriptions))
                                                .optional()
                                )
                        ),
                        responseFields(
                               List.of(
                                       fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터").optional(),
                                       fieldWithPath("data.commentId").type(JsonFieldType.NUMBER).description("댓글 식별자"),
                                       fieldWithPath("data.partyId").type(JsonFieldType.NUMBER).description("모임 식별자"),
                                       fieldWithPath("data.memberId").type(JsonFieldType.NUMBER).description("회원 식별자"),
                                       fieldWithPath("data.comment").type(JsonFieldType.STRING).description("댓글 내용"),
                                       fieldWithPath("data.createdAt").type(JsonFieldType.STRING).description("댓글 작성 날짜"),
                                       fieldWithPath("data.modifiedAt").type(JsonFieldType.STRING).description("댓글 수정 날짜")

                               )
                        )
                ));
    }

}
