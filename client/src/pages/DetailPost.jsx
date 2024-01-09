import { useState, useEffect } from "react";
import classes from "../styles/pages/DetailPost.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { IoIosArrowBack } from "react-icons/io";
import SearchMap from "../components/Map/SearchMap";
import MakeMap from "../components/Map/MakeMap";
import { FaUsers } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import footerLogo from "../images/footerLogo.png";
import axios from "../axios";
const DetailPost = () => {
  // 도로명 주소
  const [address, setAddress] = useState({});
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [enteredComment, setEnteredComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isMyPost, setIsMyPost] = useState(false);
  const [hasMyComment, setHasMyComment] = useState(false);
  const [myComment, setMyComment] = useState("");
  const [isRecruiting, setIsRecruiting] = useState(false);
  const meetingId = 536.4778332971678;
  // const meetingId = 906.8489342328219;
  // const meetingId = useParams();
  // const loggedInUser = localStorage.getItem("email");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  // loggedInUser의 해당 글에 대한 코멘트가 존재할 경우 댓글창 대신 해당 댓글을 보여준다.
  useEffect(() => {
    if (loggedInUser && userInfo && loggedInUser.email === userInfo.email) {
      axios
        .get(`/meetings/${meetingId}/comments?useremail=${userInfo.email}`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length === 0) {
            console.log("응답 데이터가 빈 배열입니다.");
          } else {
            console.log("응답 데이터가 빈 배열이 아닙니다.");
            setHasMyComment(true);
            console.log(response.data[0]);
            setMyComment(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  }, [userInfo]);
  useEffect(() => {
    if (meetingInfo && meetingInfo.memberId) {
      axios
        .get(`/members/${meetingInfo.memberId}`)
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("Error getting user data: ", error);
        });
      console.log(userInfo);
    }
  }, [meetingInfo]);

  const commentSubmitHandler = (e) => {
    e.preventDefault();
    console.log(loggedInUser.nickname);
    let commentDTO = {
      id: Math.random() * 1000,
      meetingId: meetingId,
      userId: loggedInUser.id,
      useremail: loggedInUser.email,
      nickname: loggedInUser.nickname,
      edited: new Date(),
      created: new Date(),
      content: enteredComment,
    };

    axios
      .post(`/meetings/${meetingId}/comments`, commentDTO)
      .then((response) => {
        console.log(response.data);
        getComments();
        setHasMyComment(true);
        setEnteredComment("");
      })
      .catch((error) => {
        console.error("Error posting comment data: ", error);
      });
    console.log(comments);
  };
  const getComments = async () => {
    try {
      const res = await axios.get(`/meetings/${meetingId}/comments`);
      const comments = res.data;
      console.log("comments are updated successfully");
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comment datas: ", error);
    }
  };
  const commentEditHandler = () => {};
  const commentDeleteHandler = () => {
    const userConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
    // json-server에서는 조건이 있는 삭제가 안되나봄..?
    // 백엔드와 연결했을때 테스트 가능할듯...
    if (userConfirmed) {
      axios
        .delete(`/meetings/${meetingId}/comments?userId=${loggedInUser.id}`)

        .then((response) => {
          console.log(response.data);
          alert("댓글이 삭제되었습니다!");
          getComments();
        })
        .catch((error) => {
          console.error("Error deleting comment data: ", error);
          alert("오류가 발생했습니다!");
        });
    }
  };
  useEffect(() => {
    getComments();
  }, []);
  const commentChangeHandler = (e) => {
    setEnteredComment(e.target.value);
  };
  // localStorage에서 사용자 email 가져와서 글의 사용자 email 과 비교하고 같을 경우 수정/삭제 버튼 띄우기
  // localStorage를 쓸지 함수를 쓸지 추후에 방식 변경 가능성 존재
  useEffect(() => {
    if (userInfo) {
      if (userInfo.email === localStorage.getItem("email")) {
        setIsMyPost(true);
        console.log(isMyPost);
      }
    }
  }, [userInfo]);
  const deleteMeetingHandler = () => {
    const userConfirmed = window.confirm("해당 글을 삭제하시겠습니까?");

    if (userConfirmed) {
      axios
        .delete(`/meetings/${meetingId}`)
        .then((response) => {
          alert("해당 글이 삭제되었습니다!");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error deleting meeting data: ", error);
          alert("오류가 발생하였습니다!");
        });
    }
  };
  // useEffect(() => {
  //   axios
  //     // .get(`/comments`, {
  //     //   params: {
  //     //     meetingId: 1,
  //     //   },
  //     // })
  //     .get(`/meetings/${meetingId}/comments`)
  //     .then((response) => {
  //       setIsLoading(true);
  //       console.log(response);
  //       setComments(response.data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error getting comment datas: ", error);
  //       setIsLoading(false);
  //     });
  //   console.log(comments);
  // }, [isLoading]);
  useEffect(() => {
    axios
      .get(`/meetings/${meetingId}`)
      .then((response) => {
        // setIsLoading(true);
        console.log(response);
        setMeetingInfo(response.data);
        if (response.data.party_status === "모집중") {
          setIsRecruiting(true);
        }
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting meeting data: ", error);
        // setIsLoading(false);
      });
    console.log(meetingInfo);
  }, []);
  return (
    <div className={classes.wrapper}>
      <Header />
      {meetingInfo && userInfo && (
        <div className={classes.container}>
          <div className={classes.infoAndBtn}>
            <div className={classes.info}>
              <div className={classes.title}>
                <IoIosArrowBack style={{ fontSize: "2rem" }} />
                <h1>{meetingInfo.title}</h1>{" "}
              </div>
              <div className={classes.writerAndDate}>
                <div className={classes.writer}>
                  <h4>{userInfo.nickname}</h4>
                </div>
                <div className={classes.date}>
                  <h4>{meetingInfo.created_at.split("T")[0]}</h4>
                </div>
                {isRecruiting && (
                  <div className={classes.isRecruiting}>
                    <h4>모집중</h4>
                  </div>
                )}
                {!isRecruiting && (
                  <div className={classes.isNotRecruiting}>
                    <h4>모집완료</h4>
                  </div>
                )}
              </div>
            </div>
            {isRecruiting && (
              <div className={classes.btnCon}>
                <button className={classes.joinBtn}>
                  <FaUsers style={{ fontSize: "1.5rem" }} />
                  참여
                </button>
                {/* <button className={classes.joinBtn}>참여하기</button>
            <button className={classes.joinBtn}>참여하기</button> */}
              </div>
            )}
          </div>
          <div className={classes.detailInfo}>
            <div className={classes.detail}>
              <h2>상세 정보</h2>
              <div className={classes.info1}>
                <div className={classes.info1_1}>
                  <h4>
                    모임 이름
                    <div className={classes.emp}>{meetingInfo.meetingname}</div>
                  </h4>
                  <h4>
                    모집 인원
                    <div className={classes.emp}>
                      {meetingInfo.max_capacity}
                    </div>
                  </h4>
                  <h4>
                    모임 장소
                    <div className={classes.emp}>{meetingInfo.location}</div>
                  </h4>
                  <h4>
                    현재 인원
                    <div className={classes.emp}>
                      {meetingInfo.current_capacity}
                    </div>
                  </h4>
                </div>
                <div className={classes.info1_2}>
                  <h4>
                    모임 날짜
                    <div className={classes.emp}>
                      {meetingInfo.meeting_date.split("T")[0]}
                    </div>
                  </h4>
                  <h4>
                    모임 마감일
                    <div className={classes.emp}>
                      {meetingInfo.duedate.split("T")[0]}
                    </div>
                  </h4>
                  <h4>
                    연락 방법
                    <div className={classes.emp}>{meetingInfo.contact}</div>
                  </h4>
                </div>
              </div>
              <h2>모임 소개</h2>
              <div className={classes.info2}>{meetingInfo.content}</div>
            </div>
            <div className={classes.map}>
              <MakeMap
                setAddress={setAddress}
                lat={meetingInfo.lat}
                lng={meetingInfo.lng}
              />
              {isMyPost && (
                <div className={classes.btnCon_1}>
                  <button
                    className={classes.joinBtn}
                    onClick={() => {
                      window.location.href = `/meetings/${meetingId}/edit`;
                    }}
                  >
                    <FaEdit style={{ fontSize: "1.5rem" }} />
                    수정
                  </button>
                  <button
                    className={classes.deleteBtn}
                    onClick={deleteMeetingHandler}
                  >
                    {" "}
                    <FaTrash style={{ fontSize: "1.5rem" }} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {isRecruiting && (
            <div className={classes.comment}>
              {comments && !isLoading && <h2>댓글 {comments.length}</h2>}
              {hasMyComment && <h3>내가 쓴 댓글</h3>}
              <textarea
                placeholder="댓글 내용을 입력하세요..."
                value={hasMyComment ? myComment.content : enteredComment}
                onChange={commentChangeHandler}
                required
              />
              {!hasMyComment && (
                <div className={classes.btnCon_2}>
                  <button
                    className={classes.joinBtn_1}
                    // type="submit"
                    onClick={commentSubmitHandler}
                  >
                    댓글 등록
                    {/* <FaPlus style={{ fontSize: "1.5rem" }} /> */}
                  </button>
                </div>
              )}
              {hasMyComment && (
                <div className={classes.btnCon_2}>
                  <button
                    className={classes.joinBtn}
                    onClick={commentEditHandler}
                  >
                    댓글 수정
                  </button>
                  <button
                    className={classes.deleteBtn}
                    onClick={commentDeleteHandler}
                  >
                    댓글 삭제
                  </button>
                </div>
              )}
            </div>
          )}
          {!isRecruiting && (
            <div className={classes.comment}>
              {comments && !isLoading && <h2>댓글 {comments.length}</h2>}
            </div>
          )}
          <div className={classes.comments}>
            {!isLoading &&
              comments &&
              comments.map((comment) => {
                return (
                  <div key={comment.id} className={classes.comm}>
                    <div className={classes.info}>
                      <img
                        alt="ProfileImage"
                        src={footerLogo}
                        width="50px"
                        height="50px"
                      />
                      <div className={classes.user}>
                        <div>{comment.nickname}</div>
                        <div>{comment.edited.split("T")[0]}</div>
                      </div>
                    </div>

                    <div className={classes.commcontent}>{comment.content}</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default DetailPost;
