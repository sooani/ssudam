import React, { useState, useEffect } from "react";
import classes from "../styles/pages/Todolist.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import axios from "../axios";
const Todolist = () => {
  const [totalPages, setTotalPages] = useState(null); // 전체 페이지 수
  const [totalLength, setTotalLength] = useState(null); // 전체 투두 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const commentsPerPage = 10; // 한 페이지에 표시할 투두 수
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [entered, setEntered] = useState("");
  const loggedInUser = useSelector(selectUser);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();
  // 페이지네이션 페이지를 선택하는 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    console.log(commentsPerPage);
    console.log(currentPage);
  }, [commentsPerPage, currentPage]);
  useEffect(() => {
    getTodos(currentPage, commentsPerPage);
  }, [currentPage, commentsPerPage]);
  const getTodos = async (currentPage, commentsPerPage) => {
    console.log(currentPage, commentsPerPage);
    let page = currentPage ? currentPage : 1;
    let size = commentsPerPage ? commentsPerPage : 10;
    try {
      // pagination 동작하면 size와 page 값을 동적으로 줘야 함.
      const res = await axios.get(`/v1/todos?page=${page}&size=${size}`);
      const todos = res.data.data;
      const totalPages = res.data.pageInfo.totalPages;
      const totalLength = res.data.pageInfo.totalElements;
      console.log(totalPages);
      setTotalPages(totalPages);
      setTotalLength(totalLength);
      console.log(todos);
      setTodos(todos);
      console.log("todos are updated successfully");
    } catch (error) {
      console.error("Error fetching todo datas: ", error);
    }
  };

  const addTodo = () => {
    setTodos([
      ...todos,
      { id: todos.length + 1, text: entered, completed: false },
    ]);
    const todoDTO = {
      title: entered,
      todoOrder: 1,
    };
    // axios
    //   .post(`/v1/todos`, todoDTO)
    //   .then((response) => {
    //     alert("할 일이 등록되었습니다!");
    //     window.location.href = "/";
    //   })
    //   .catch((error) => {
    //     console.error("Error updating todo data: ", error);
    //     alert("오류가 발생했습니다!");
    //   });
    setEntered("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    // axios
    //   .delete(`/v1/todos/${id}`)
    //   .then((response) => {
    //     alert("할 일이 삭제되었습니다!");
    //   })
    //   .catch((error) => {
    //     console.error("Error deleting todo data: ", error);
    //     alert("오류가 발생했습니다!");
    //   });
  };
  const editTodo = (id) => {};
  const toggleEditMode = (id) => {
    setEditMode(id === editMode ? null : id);
  };
  const handleEditChange = (id, newValue) => {
    // Handle the logic to update the Todo item with the new value
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.container}>
        <h1>Todolist</h1>
        <div className={classes.inputTab}>
          <input
            type="text"
            placeholder="할 일을 추가하세요..."
            value={entered}
            onChange={(e) => setEntered(e.target.value)}
          />
          <button onClick={addTodo} className={classes.submitBtn}>
            추가
          </button>
        </div>
        <ul className={classes.list}>
          {todos &&
            todos.map((todo) => (
              <li key={todo.id}>
                {editMode === todo.id ? (
                  <input
                    type="text"
                    // value={/* value for the input based on the todo item */}
                    // onChange={(e) => /* handle input change */}
                  />
                ) : (
                  <span className={todo.completed ? classes.completed : ""}>
                    {todo.text}
                  </span>
                )}
                <div className={classes.btnCon}>
                  <button
                    className={classes.editBtn}
                    onClick={() => {
                      if (editMode === todo.id) {
                        handleEditChange(
                          todo.id /* new value from the input */
                        );
                      } else {
                        toggleEditMode(todo.id);
                      }
                    }}
                  >
                    {editMode === todo.id ? "완료" : "수정"}
                  </button>
                  <button
                    className={classes.deleteBtn}
                    onClick={() => deleteTodo(todo.id)}
                  >
                    삭제
                  </button>
                </div>
                {/* <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                /> */}
              </li>
            ))}
        </ul>

        {totalPages > 0 && (
          <ReactPaginate
            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName={classes.pagination}
            pageLinkClassName={classes.pagination__link}
            activeLinkClassName={classes.pagination__link__active}
            renderPagination={() => null}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Todolist;
