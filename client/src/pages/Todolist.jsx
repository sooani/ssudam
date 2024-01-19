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
  const commentsPerPage = 5; // 한 페이지에 표시할 투두 수
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [entered, setEntered] = useState("");
  const loggedInUser = useSelector(selectUser);
  const [editMode, setEditMode] = useState(null);
  const [order, setOrder] = useState("");
  const [editedTitle, setEditedTitle] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(1);
  const [total, setTotal] = useState(null);
  // const axios = useAxiosInstance();
  // 페이지네이션 페이지를 선택하는 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    console.log(commentsPerPage);
    console.log(currentPage);
    console.log(selectedTab);
    getTodos(currentPage, commentsPerPage);
  }, [commentsPerPage, currentPage]);

  const getTodos = async (currentPage, commentsPerPage) => {
    console.log(currentPage, commentsPerPage);
    let page = currentPage ? currentPage : 1;
    let size = commentsPerPage ? commentsPerPage : 5;
    try {
      // pagination 동작하면 size와 page 값을 동적으로 줘야 함.
      const res = await axios.get(`/v1/todos?page=${page}&size=${size}`);
      const allTodos = res.data.data;

      //   const filteredTodos = allTodos.filter(
      //     (todo) => todo.todoOrder === selectedTab
      //   );
      //   console.log(filteredTodos);
      const totalPages = res.data.pageInfo.totalPages;
      const totalLength = res.data.pageInfo.totalElements;

      setTotalPages(totalPages);
      setTotalLength(totalLength);
      setTodos(allTodos);
      console.log("todos are updated successfully");
    } catch (error) {
      console.error("Error fetching todo datas: ", error);
    }
  };

  const addTodo = () => {
    if (totalLength === 3) {
      alert(
        "최대 3개를 등록하여 더 이상 등록할 수 없습니다! 기존 목록을 수정하거나 삭제하고 등록해주세요!"
      );
      setEntered("");
      setOrder("");
      return;
    }
    // setTodos([
    //   ...todos,
    //   { id: todos.length + 1, text: entered, completed: false },
    // ]);
    if (!entered || !order) {
      alert("내용과 순위를 입력해주세요...");
      return;
    }

    const todoDTO = {
      title: entered,
      todoOrder: order,
    };
    console.log(todoDTO);
    axios
      .post(`/v1/todos`, todoDTO)
      .then((response) => {
        // alert("할 일이 등록되었습니다!");
        getTodos(currentPage, commentsPerPage);
      })
      .catch((error) => {
        console.error("Error updating todo data: ", error);
        alert("오류가 발생했습니다!");
      });
    setEntered("");
    setOrder("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    // setTodos(todos.filter((todo) => todo.id !== id));
    axios
      .delete(`/v1/todos/${id}`)
      .then((response) => {
        alert("할 일이 삭제되었습니다!");
        getTodos(currentPage, commentsPerPage);
      })
      .catch((error) => {
        console.error("Error deleting todo data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  const deleteAllHandler = () => {
    const userConfirmed = window.confirm("모든 할 일을 삭제하시겠습니까?");

    if (userConfirmed) {
      axios
        .delete(`/v1/todos`)
        .then((response) => {
          alert("모든 할일이 삭제되었습니다!");
          getTodos(currentPage, commentsPerPage);
        })
        .catch((error) => {
          console.error("Error deleting todo datas: ", error);
        });
    }
  };

  const toggleEditMode = (id, title, order) => {
    setEditMode(id === editMode ? null : id);
    setEditedTitle(title);
    setEditedOrder(order);
  };
  const handleEditChange = (id, updatedTitle, updatedOrder) => {
    const updatedDTO = {
      title: updatedTitle,
      todoOrder: updatedOrder,
    };
    axios
      .put(`/v1/todos/${id}`, updatedDTO)
      .then((response) => {
        alert("할 일이 수정되었습니다!");
        getTodos(currentPage, commentsPerPage);
        toggleEditMode(null, "", ""); // 수정이 완료되면 초기화
      })
      .catch((error) => {
        console.error("Error updating todo data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.container}>
        <div className={classes.header}>
          <h1>Todolist</h1>
        </div>

        <div className={classes.inputTab}>
          <input
            type="number"
            className={classes.orderInput}
            placeholder="순위"
            min={1}
            value={order}
            required={true}
            onChange={(e) => setOrder(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            className={classes.todoInput}
            type="text"
            placeholder="최대 3개의 할 일을 추가하세요..."
            value={entered}
            required={true}
            onChange={(e) => setEntered(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={addTodo} className={classes.submitBtn}>
            추가
          </button>{" "}
          <button className={classes.deleteBtn} onClick={deleteAllHandler}>
            모두 삭제
          </button>
        </div>
        {/* <div className={classes.tabs}>
          <button
            className={selectedTab === 1 ? classes.activeTab : ""}
            onClick={() => {
              setSelectedTab(1);
            }}
          >
            1순위
          </button>
          <button
            className={selectedTab === 2 ? classes.activeTab : ""}
            onClick={() => {
              setSelectedTab(2);
            }}
          >
            2순위
          </button>
        </div> */}
        <ul className={classes.list}>
          {todos &&
            todos.map((todo) => (
              <li key={todo.todolistId}>
                {editMode === todo.todolistId ? (
                  <div className={classes.inputTab}>
                    <input
                      type="number"
                      className={classes.orderInput}
                      placeholder="순위"
                      min={1}
                      value={editedOrder}
                      required
                      onChange={(e) => setEditedOrder(e.target.value)}
                    />
                    <input
                      className={classes.todoInput}
                      type="text"
                      value={editedTitle}
                      required
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className={classes.box}>
                    <div className={classes.order}>{todo.todoOrder}순위</div>{" "}
                    <div className={classes.title}>{todo.title}</div>
                  </div>
                )}
                <div className={classes.btnCon}>
                  <button
                    className={classes.editBtn}
                    onClick={() =>
                      editMode === todo.todolistId
                        ? handleEditChange(
                            todo.todolistId,
                            editedTitle,
                            editedOrder
                          ) /* new values from the input */
                        : toggleEditMode(
                            todo.todolistId,
                            todo.title,
                            todo.todoOrder
                          )
                    }
                  >
                    {editMode === todo.todolistId ? "완료" : "수정"}
                  </button>
                  <button
                    className={classes.deleteBtn}
                    onClick={() => deleteTodo(todo.todolistId)}
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
        <div className={classes.under}>
          <div className={classes.paginate}>
            {totalPages > 0 && (
              <ReactPaginate
                previousLabel={<FiChevronLeft style={{ color: "#86B6F6" }} />}
                nextLabel={<FiChevronRight style={{ color: "#86B6F6" }} />}
                pageCount={totalPages}
                onPageChange={handlePageClick}
                containerClassName={classes.pagination}
                pageLinkClassName={classes.pagination__link}
                activeLinkClassName={classes.pagination__link__active}
                renderPagination={() => null}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Todolist;
