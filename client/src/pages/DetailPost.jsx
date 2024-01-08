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
  const meetingId = 536.4778332971678;
  // const meetingId = useParams();
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
    let commentDTO = {
      id: Math.random() * 1000,
      meetingId: meetingId,
      userId: 225,
      useremail: "hye25@example.com",
      edited: new Date(),
      created: new Date(),
      content: enteredComment,
    };

    axios
      .post(`/meetings/${meetingId}/comments`, commentDTO)
      .then((response) => {
        console.log(response.data);
        getComments();
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
                <h1>{meetingInfo.title}</h1>
              </div>
              <div className={classes.writerAndDate}>
                <div className={classes.writer}>
                  <h4>{userInfo.email}</h4>
                </div>
                <div className={classes.date}>
                  <h4>{meetingInfo.created_at.split("T")[0]}</h4>
                </div>
              </div>
            </div>
            <div className={classes.btnCon}>
              <button className={classes.joinBtn}>
                참여
                <FaUsers style={{ fontSize: "1.5rem" }} />
              </button>
              {/* <button className={classes.joinBtn}>참여하기</button>
            <button className={classes.joinBtn}>참여하기</button> */}
            </div>
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
                    수정
                    <FaEdit style={{ fontSize: "1.5rem" }} />
                  </button>
                  <button className={classes.deleteBtn}>
                    삭제
                    <FaTrash style={{ fontSize: "1.5rem" }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={commentSubmitHandler} className={classes.comment}>
            {comments && !isLoading && <h2>댓글 {comments.length}</h2>}
            <textarea
              placeholder="댓글 내용을 입력하세요..."
              value={enteredComment}
              onChange={commentChangeHandler}
              required
            />
            <div className={classes.btnCon_2}>
              <button
                className={classes.joinBtn}
                type="submit"
                // onClick={commentSubmitHandler}
              >
                댓글 등록
                {/* <FaPlus style={{ fontSize: "1.5rem" }} /> */}
              </button>
            </div>
          </form>

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
                        <div>{comment.useremail}</div>
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
