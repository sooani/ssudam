package com.ssudam.todolist;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.jayway.jsonpath.JsonPath;
import com.ssudam.todolist.controller.TodoListController;
import com.ssudam.todolist.dto.TodoListDto;
import com.ssudam.todolist.entity.TodoList;
import com.ssudam.todolist.mapper.TodoListMapper;
import com.ssudam.todolist.service.TodoListService;
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
import org.springframework.restdocs.constraints.ConstraintDescriptions;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.ssudam.utils.ApiDocumentUtils.getRequestPreProcessor;
import static com.ssudam.utils.ApiDocumentUtils.getResponsePreProcessor;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.responseHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;
import static org.springframework.restdocs.snippet.Attributes.key;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoListController.class)
@MockBean(JpaMetamodelMappingContext.class)
@AutoConfigureRestDocs
@TestPropertySource(properties = "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration")
public class TodoListControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private Gson gson;
    @MockBean
    private TodoListService todoListService;
    @MockBean
    private TodoListMapper mapper;

    @Test
    void postTodoTest() throws Exception {
        System.out.println("[ postTodo test ]");

        // given
        TodoListDto.Post post = new TodoListDto.Post("쓰레기 줍기", 1);
        given(mapper.todoPostDtoToTodoList(any(TodoListDto.Post.class)))
                .willReturn(new TodoList());

        TodoList mockTodoList = new TodoList();
        mockTodoList.setTodolistId(1L);
        given(todoListService.createTodoList(any(TodoList.class)))
                .willReturn(mockTodoList);

        Gson gson = new Gson();

        String content = gson.toJson(post);
        URI uri = UriComponentsBuilder.newInstance().path("/v1/todos").build().toUri();
        System.out.println("JSON : " + content);

        // when
        ResultActions actions =
                mockMvc.perform(
                        post("/v1/todos")
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content));

        // then
        actions
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", is(startsWith("/v1/todos/"))))
                .andDo(document("post-TodoList",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestFields(
                                List.of(
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("투두리스트 내용"),
                                        fieldWithPath("todoOrder").type(JsonFieldType.NUMBER).description("우선 순위")
                                )
                        ),
                        responseHeaders(
                                headerWithName(HttpHeaders.LOCATION).description("Location Header. 등록된 리소스의 URI")
                        )

                ));
    }

    @Test
    void patchTodoTest() throws Exception {
        System.out.println("[ patchTodo test ]");

        //given
        long todolistId = 1L;

        TodoListDto.Patch patch =
                (TodoListDto.Patch) TodoListStub.getRequestBody(HttpMethod.PUT);

        TodoListDto.Response responseDto = TodoListStub.getSingleResponseBody();

        given(mapper.todoPatchDtoToTodoList(any(TodoListDto.Patch.class))).willReturn(new TodoList());
        given(todoListService.updateTodoList(any(TodoList.class))).willReturn(new TodoList());
        given(mapper.todoToTodoListResponseDto(any(TodoList.class))).willReturn(responseDto);

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(LocalDateTime.class, (JsonSerializer<LocalDateTime>) (localDateTime, type, jsonSerializationContext) ->
                        new JsonPrimitive(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))))
                .create();

        String content = gson.toJson(patch);
        System.out.println("Json : " + content);

        // when
        ResultActions actions =
                mockMvc.perform(
                        RestDocumentationRequestBuilders.put("/v1/todos/{todolist-id}", todolistId)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(content));

        // then
        ConstraintDescriptions putTodoConstraints = new ConstraintDescriptions(TodoListDto.Patch.class);
        List<String> titleDescriptions = putTodoConstraints.descriptionsForProperty("title");
        List<String> todoOrderDescriptions = putTodoConstraints.descriptionsForProperty("todoOrder");

        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.todolistId").value(todolistId))
                .andExpect(jsonPath("$.title").value(patch.getTitle()))
                .andExpect(jsonPath("$.todoOrder").value(patch.getTodoOrder()))
                .andDo(document("patch-todolist",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                List.of(parameterWithName("todolist-id").description("투두리스트 식별자"))
                        ),
                        requestFields(
                                List.of(
                                        fieldWithPath("todolistId").type(JsonFieldType.NUMBER)
                                                .description("투두리스트 식별자").ignored(),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("투두리스트 내용")
                                                .attributes(key("constraints").value(titleDescriptions)),
                                        fieldWithPath("todoOrder").type(JsonFieldType.NUMBER).description("투두리스트 우선 순위")
                                                .attributes(key("constraints").value(todoOrderDescriptions))
                                )
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("todolistId").type(JsonFieldType.NUMBER).description("투두리스트 식별자"),
                                        fieldWithPath("title").type(JsonFieldType.STRING).description("투두리스트 내용"),
                                        fieldWithPath("todoOrder").type(JsonFieldType.NUMBER).description("투두리스트 우선 순위"),
                                        fieldWithPath("createdAt").type(JsonFieldType.STRING).description("투두리스트 등록 날짜"),
                                        fieldWithPath("modifiedAt").type(JsonFieldType.STRING).description("투두리스트 수정 날짜")
                                )
                        )
                ));
    }

    @Test
    void getTodo() throws Exception {
        System.out.println("[ getTodo test ]");

        // given
        long todolistId = 1L;

        TodoListDto.Response response = TodoListStub.getSingleResponseBody();

        /*ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS"));

        String createdAtAsString = objectMapper.writeValueAsString(response.getCreatedAt());
        String modifiedAtAsString = objectMapper.writeValueAsString(response.getModifiedAt());*/

        given(todoListService.findTodoList(Mockito.anyLong())).willReturn(new TodoList());
        given(mapper.todoToTodoListResponseDto(any(TodoList.class))).willReturn(response);

        // when
        ResultActions actions =
                mockMvc.perform(
                        get("/v1/todos/{todolist-id}", todolistId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON));

        // then
        actions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.todolistId").value(response.getTodolistId()))
                .andExpect(jsonPath("$.data.title").value(response.getTitle()))
                .andExpect(jsonPath("$.data.todoOrder").value(response.getTodoOrder()))
//                .andExpect(jsonPath("$.data.createdAt").value(response.getCreatedAt().toString()))
//                .andExpect(jsonPath("$.data.modifiedAt").value(response.getModifiedAt().toString()))
                .andDo(document("get-todolist",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        pathParameters(
                                List.of(parameterWithName("todolist-id").description("투두리스트 식별자"))
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.OBJECT).description("결과 데이터").optional(),
                                        fieldWithPath("data.todolistId").type(JsonFieldType.NUMBER).description("투두리스트 식별자"),
                                        fieldWithPath("data.title").type(JsonFieldType.STRING).description("투두리스트 내용"),
                                        fieldWithPath("data.todoOrder").type(JsonFieldType.NUMBER).description("투두리스트 우선 순위"),
                                        fieldWithPath("data.createdAt").type(JsonFieldType.STRING).description("투두리스트 등록 날짜"),
                                        fieldWithPath("data.modifiedAt").type(JsonFieldType.STRING).description("투두리스트 수정 날짜")
                                )
                        )
                ));
    }

    @Test
    void getTodos() throws Exception {
        System.out.println("[ getTodos test ]");

        // given
        Page<TodoList> todoLists = TodoListStub.getMultiTodoLists();
        List<TodoListDto.Response> responses = TodoListStub.getMultiResponseBody();

        given(todoListService.findAll(0, 3)).willReturn(todoLists);
        given(mapper.todosToTodoResponseDtos(Mockito.anyList())).willReturn(responses);

        String page = "1";
        String size = "3";

        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        queryParams.add("page", page);
        queryParams.add("size", size);

        URI uri = UriComponentsBuilder.newInstance().path("/v1/todos").build().toUri();

        // when
        ResultActions actions = mockMvc.perform(get(uri)
                .params(queryParams)
                .accept(MediaType.APPLICATION_JSON));

        // then
        MvcResult result = actions.andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andDo(document("get-todolists",
                        preprocessRequest(prettyPrint()),
                        preprocessResponse(prettyPrint()),
                        requestParameters(
                                List.of(
                                        parameterWithName("page").description("Page 번호"),
                                        parameterWithName("size").description("Page 크기")
                                )
                        ),
                        responseFields(
                                List.of(
                                        fieldWithPath("data").type(JsonFieldType.ARRAY).description("결과 데이터").optional(),
                                        fieldWithPath("data[].todolistId").type(JsonFieldType.NUMBER).description("투두리스트 식별자"),
                                        fieldWithPath("data[].title").type(JsonFieldType.STRING).description("투두리스트 내용"),
                                        fieldWithPath("data[].todoOrder").type(JsonFieldType.NUMBER).description("투두리스트 우선순위"),
                                        fieldWithPath("data[].createdAt").type(JsonFieldType.STRING).description("투두리스트 등록 날짜"),
                                        fieldWithPath("data[].modifiedAt").type(JsonFieldType.STRING).description("투두리스트 수정 날짜"),
                                        fieldWithPath("pageInfo").type(JsonFieldType.OBJECT).description("Page 정보"),
                                        fieldWithPath("pageInfo.page").type(JsonFieldType.NUMBER).description("Page 번호"),
                                        fieldWithPath("pageInfo.size").type(JsonFieldType.NUMBER).description("Page 크기"),
                                        fieldWithPath("pageInfo.totalElements").type(JsonFieldType.NUMBER).description("전체 투두리스트 개수"),
                                        fieldWithPath("pageInfo.totalPages").type(JsonFieldType.NUMBER).description("전체 페이지 수")
                                )
                        )

                ))
                .andReturn();

        List list = JsonPath.parse(result.getResponse().getContentAsString()).read("$.data");
        assertThat(list.size(), is(3));
    }

    @Test
    void deleteTodo() throws Exception {
        System.out.println("[ deleteTodo test ]");

        // given
        long todolistId = 1L;

        doNothing().when(todoListService).deleteTodo(any(long.class));

        // when
        ResultActions actions = mockMvc.perform(delete("/v1/todos/{todolistId}", todolistId));

        // then
        actions.andExpect(status().isNoContent())
                .andDo(document("delete-todolist",
                        getRequestPreProcessor(),
                        getResponsePreProcessor(),
                        pathParameters(
                                parameterWithName("todolistId").description("투두리스트 식별자")
                        )
                ));
    }

    @Test
    void deleteAllTodos() throws Exception {
        System.out.println("[ deleteAllTodo test ]");

        doNothing().when(todoListService).deleteAll();

        // when
        ResultActions actions = mockMvc.perform(delete("/v1/todos"));

        // then
        actions.andExpect(status().isNoContent())
                .andDo(document("delete-todolists",
                        getRequestPreProcessor(),
                        getResponsePreProcessor()
                ));
    }

}
