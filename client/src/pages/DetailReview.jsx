import { useState, useEffect } from "react";
import classes from "../styles/pages/DetailPost.module.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { IoIosArrowBack } from "react-icons/io";
import MakeMap from "../components/Map/MakeMap";
import { FaUsers } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "../components/Meeting/Comments";
import { FaBookmark } from "react-icons/fa";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import weatherDescKo from "../components/Meeting/weatherDescKo";
const DetailReview = () => {
  const [comments, setComments] = useState(null); // 전체 댓글
  const [isLoading, setIsLoading] = useState(false); // 로딩 여부
  const [meetingInfo, setMeetingInfo] = useState(null); // 현재 파티의 정보
  const [enteredComment, setEnteredComment] = useState(""); // 입력된 댓글
  const [userInfo, setUserInfo] = useState(null); // 현재 파티의 모임장 정보
  const [isMyPost, setIsMyPost] = useState(false); // 내 포스트인지 여부
  const [hasMyComment, setHasMyComment] = useState(false); // 내 댓글 보유 여부
  const [myComment, setMyComment] = useState({}); // 나의 코멘트
  const [isRecruiting, setIsRecruiting] = useState(false); // 모집중인지 여부
  const [isParticipating, setIsParticipating] = useState(false); // 참여중인지 여부
  const [bookmarked, setBookmarked] = useState(false); // 북마크 여부
  const [totalPages, setTotalPages] = useState(null); // 전체 페이지 수
  const [totalLength, setTotalLength] = useState(null); // 전체 댓글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [weather, setWeather] = useState("");
  const commentsPerPage = 10; // 한 페이지에 표시할 댓글 수
  const { reviewId } = useParams();
  // 현재 로그인된 사용자의 정보를 가져오는 코드로 나중에 변경
  // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // 리덕스 사용자 정보 불러오기
  const loggedInUser = useSelector(selectUser);
  console.log(loggedInUser);

  // loggedInUser의 해당 글에 대한 코멘트가 존재할 경우 댓글창 대신 해당 댓글을 보여준다.
  const navigate = useNavigate();
  // 수안님 코드의 경우 (party정보에 memberId가 존재할 경우) 주석 해제
  useEffect(() => {
    if (meetingInfo && meetingInfo.memberId) {
      axios
        .get(`/v1/members/${meetingInfo.memberId}`)
        .then((response) => {
          console.log(response.data);
          setUserInfo(response.data.data);
          // setUserInfo({
          //   memberId: 1,
          //   email: "user1@example.com",
          //   nickname: "당근이",
          // });
        })
        .catch((error) => {
          console.error("Error getting user data: ", error);
        });
      // console.log(userInfo);
    }
  }, [meetingInfo]);
  useEffect(() => {
    console.log(commentsPerPage);
    console.log(currentPage);
  }, [commentsPerPage, currentPage]);
  // 코멘트 등록 핸들러
  const commentSubmitHandler = (e) => {
    e.preventDefault();
    let commentDTO = {
      partyId: meetingId,
      memberId: loggedInUser.memberId,
      comment: enteredComment,
    };
    console.log(commentDTO);
    axios
      .post(`/v1/comments`, commentDTO)
      .then((response) => {
        getComments(currentPage, commentsPerPage);
        setHasMyComment(true);
        setEnteredComment("");

        const locationHeaderValue = response.headers.location;

        // '/v1/comments/{commentId}'에서 commentId 부분을 추출
        const commentIdMatch = locationHeaderValue.match(
          /\/v1\/comments\/(\d+)/
        );

        if (commentIdMatch && commentIdMatch[1]) {
          // commentId를 사용하여 원하는 작업 수행
          const commentId = commentIdMatch[1];
          console.log("Extracted Comment ID:", commentId);
          axios.get(`/v1/comments/${commentId}`).then((response) => {
            // 등록된 나의 댓글을 my comment state로 업데이트
            setMyComment(response.data.data);
          });
        } else {
          console.error("Comment ID not found in Location header.");
        }
      })
      .catch((error) => {
        console.error("Error posting comment data: ", error);
      });
  };
  useEffect(() => {
    getComments(currentPage, commentsPerPage);
  }, [currentPage, commentsPerPage]);
  // 전체 코멘트를 가져오는 function
  const getComments = async (currentPage, commentsPerPage) => {
    console.log(meetingId);
    console.log(currentPage, commentsPerPage);
    let page = currentPage ? currentPage : 1;
    let size = commentsPerPage ? commentsPerPage : 10;
    try {
      // pagination 동작하면 size와 page 값을 동적으로 줘야 함.
      const res = await axios.get(
        `/v1/comments?partyId=${meetingId}&page=${page}&size=${size}`
      );
      const comments = res.data.data;
      const totalPages = res.data.pageInfo.totalPages;
      const totalLength = res.data.pageInfo.totalElements;
      console.log(totalPages);
      setTotalPages(totalPages);
      setTotalLength(totalLength);
      // 댓글 중에 나의 댓글이 있는지 확인하는 로직
      if (userInfo) {
        const myComment = comments.find(
          (comment) => comment.nickname === loggedInUser.nickname
        );
        if (myComment) {
          // 조건에 맞는 comment가 있으면 setMyComment에 저장
          setHasMyComment(true);
          setMyComment(myComment);
        } else {
          console.log("No comment found for the user.");
        }
        // 전체 코멘트를 업데이트
        setComments(comments);
        console.log("comments are updated successfully");
      }
    } catch (error) {
      console.error("Error fetching comment datas: ", error);
    }
  };
  useEffect(() => {
    console.log(comments);
  }, [comments]);
  // 나의 코멘트를 수정하는 핸들러
  const commentEditHandler = () => {
    const userConfirmed = window.confirm("댓글을 수정하시겠습니까?");
    let updatedDTO = {
      comment: myComment.comment,
    };
    if (userConfirmed) {
      axios
        .patch(`/v1/comments/${myComment.commentId}`, updatedDTO)

        .then((response) => {
          alert("댓글이 수정되었습니다!");
          getComments(currentPage, commentsPerPage);
        })
        .catch((error) => {
          console.error("Error updating comment data: ", error);
          alert("오류가 발생했습니다!");
        });
    }
  };
  // 나의 코멘트를 삭제하는 핸들러
  const commentDeleteHandler = () => {
    const userConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (userConfirmed) {
      axios
        .delete(`/v1/comments/${myComment.commentId}`)
        .then((response) => {
          alert("댓글이 삭제되었습니다!");
          setHasMyComment(false);
          getComments(currentPage, commentsPerPage);
        })
        .catch((error) => {
          console.error("Error deleting comment data: ", error);
          alert("오류가 발생했습니다!");
        });
    }
  };
  // 처음 렌더링 될 때 코멘트를 가져옴.

  // 코멘트의 입력 상태를 관리하는 핸들러
  // 입력된 나의 코멘트가 있으면 myComment 업데이트, 아니면 enterend comment 업데이트.
  const commentChangeHandler = (e) => {
    if (hasMyComment) {
      setMyComment((prev) => ({
        ...prev,
        comment: e.target.value,
      }));
    } else {
      setEnteredComment(e.target.value);
    }
  };
  // localStorage를 쓸지 함수를 쓸지 추후에 방식 변경 가능성 존재
  // meeting의 userInfo의 id와 현재 로그인된 사용자의 id를 비교하여 isMyPost 업데이트
  useEffect(() => {
    if (userInfo) {
      if (userInfo.memberId == loggedInUser.memberId) {
        setIsMyPost(true);
      }
    }
  }, [userInfo]);
  // meeting info의 모집 여부로 isRecruiting 상태를 업데이트 하는 로직
  useEffect(() => {
    if (meetingInfo) {
      if (meetingInfo.partyStatus === "PARTY_OPENED") {
        console.log("PARTY_OPENED");
        setIsRecruiting(true);
      } else {
        console.log("PARTY_CLOSED");
        setIsRecruiting(false);
      }
    }
  }, [meetingInfo]);
  // 파티를 삭제하는 핸들러
  const deleteMeetingHandler = () => {
    const userConfirmed = window.confirm("해당 글을 삭제하시겠습니까?");
    if (userConfirmed) {
      axios
        .delete(`/v1/parties/${meetingId}`)
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
  // 처음 party의 상태를 업데이트 하는 로직.
  // 현재는 meetingInfo에 memberId가 없어서 임시로 고정값을 준 상태이다.
  useEffect(() => {
    setIsLoading(true);
    console.log("get parties");
    axios
      .get(`/v1/parties/${meetingId}`)
      .then((response) => {
        setMeetingInfo(response.data.data);

        const weatherCode = response.data.data.weather;

        const meetingWeatherDescriptionObject = weatherDescKo.find(
          (item) => Object.keys(item)[0] === weatherCode
        );

        const meetingWeatherDescription = meetingWeatherDescriptionObject
          ? Object.values(meetingWeatherDescriptionObject)[0]
          : "예상 날씨 없음";

        setWeather(meetingWeatherDescription);

        // 모집 글의 모집 마감일이 현재 날짜보다 지난경우 모집 상태를 마감으로 업데이트!
        if (new Date(response.data.data.closingDate) <= new Date()) {
          const updatedDTO = {
            partyId: meetingId,
            title: response.data.data.title,
            maxCapacity: response.data.data.maxCapacity,
            currentCapacity: response.data.data.currentCapacity,
            partyStatus: response.data.data.partyStatus,
          };
          // axios로 patch 요청을 보내는 부분
          // 일단 조회수 때문에 주석처리!
          // axios
          //   .patch(`/v1/parties/${meetingInfo.partyId}`, updatedDTO)
          //   .then((response) => {
          //     setMeetingInfo(response.data.data);
          //   })
          //   .catch((error) => {
          //     console.error("Error updating meeting data: ", error);
          //     alert("오류가 발생했습니다!");
          //   });
        }
        // 아래는 나중에 주석처리
        // setUserInfo({
        //   memberId: 1,
        //   email: "chfhddl@example.com",
        //   nickname: "chfhddl",
        // });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting meeting data: ", error);
        setIsLoading(false);
      });
  }, []);
  //원래는 isParticipating이 의존성
  // 현재 모집글에 대한 북마크 상태를 불러오는 로직
  useEffect(() => {
    axios
      .get(
        `/v1/bookmarks/parties/${meetingId}/bookmark-status?memberId=${loggedInUser.memberId}`
      )

      .then((response) => {
        console.log(response.data);
        if (response.data.isBookmarked === true) {
          setBookmarked(true);
        } else {
          setBookmarked(false);
        }
      })
      .catch((error) => {
        console.error("Error getting bookmark data: ", error);
        alert("오류가 발생했습니다!");
      });
  }, []);
  // 위는 원래 의존성이 isParticipating이었다...오류 날시 점검 필요
  // 겹치는 로직 존재하여 아래는 임시 주석처리
  // useEffect(() => {
  //   axios
  //     .get(`/v1/parties/${meetingId}`)
  //     .then((response) => {
  //       if (response.data.partyStatus === "PARTY_OPENED") {
  //         setIsRecruiting(true);
  //       }
  //       if (response.data.partyStatus === "PARTY_CLOSED") {
  //         setIsRecruiting(false);
  //       }

  //     })
  //     .catch((error) => {
  //       console.error("Error getting meeting data: ", error);

  //     });

  // }, [isParticipating]);
  // 참여 핸들러
  const joinHandler = () => {
    if (!isParticipating) {
      const userConfirmed = window.confirm("해당 모임에 참여하시겠습니까?");

      if (userConfirmed) {
        console.log("참여되었습니다.");

        // 해당 meeting의 current capacity가 max capacity - 1 이하일 경우 참여가 가능하다
        // max capacity 랑 current capacity랑 같을 때 모임글 상태를 모집완료로 변경!
        axios

          .post(`/v1/parties/${meetingInfo.partyId}`, {
            memberId: loggedInUser.memberId,
          })
          .then((response) => {
            const updatedDTO = {
              partyId: meetingInfo.partyId,
              title: meetingInfo.title,
              maxCapacity: meetingInfo.maxCapacity,
              currentCapacity: meetingInfo.currentCapacity + 1,
              partyStatus: "PARTY_CLOSED",
            };
            console.log(updatedDTO);
            // if (meetingInfo.currentCapacity + 1 == meetingInfo.maxCapacity) {
            //   axios
            //     .patch(`/v1/parties/${meetingInfo.partyId}`, updatedDTO)
            //     .then((response) => {})
            //     .catch((error) => {
            //       console.error("Error updating meeting data: ", error);
            //     });
            // }
            setMeetingInfo((prev) => ({
              ...prev,
              partyStatus:
                prev.currentCapacity + 1 == prev.maxCapacity
                  ? "PARTY_CLOSED"
                  : "PARTY_OPENED",
              currentCapacity: prev.currentCapacity + 1,
            }));
            setIsParticipating(true);
          })
          .catch((error) => {
            console.error("Error posting participation data: ", error);
          });
      }
    }
    if (isParticipating) {
      const userConfirmed = window.confirm(
        "해당 모임에 참여 취소 하시겠습니까?"
      );

      if (userConfirmed) {
        console.log("참여 취소되었습니다.");

        axios

          .post(`/v1/parties/${meetingInfo.partyId}`, {
            memberId: loggedInUser.memberId,
          })
          .then((response) => {
            console.log(response);
            const updatedDTO = {
              partyId: meetingInfo.partyId,
              title: meetingInfo.title,
              maxCapacity: meetingInfo.maxCapacity,
              currentCapacity: meetingInfo.currentCapacity - 1,
              partyStatus: "PARTY_OPENED",
            };
            console.log(updatedDTO);
            // if (meetingInfo.currentCapacity - 1 <= meetingInfo.maxCapacity) {
            //   axios
            //     .patch(`/v1/parties/${meetingInfo.partyId}`, updatedDTO)
            //     .then((response) => {})
            //     .catch((error) => {
            //       console.error("Error updating meeting data: ", error);
            //     });
            // }
            setMeetingInfo((prev) => ({
              ...prev,
              partyStatus:
                prev.currentCapacity - 1 <= prev.maxCapacity
                  ? "PARTY_OPENED"
                  : "PARTY_CLOSED",
              currentCapacity: prev.currentCapacity - 1,
            }));

            setIsParticipating(false);
          })
          .catch((error) => {
            console.error("Error deleting participation data: ", error);
          });
      }
    }
  };
  // 참여 중 여부를 업데이트하는 로직
  // 현재 로그인한 사용자가 참여 중인 파티를 요청하고 그중에 현재 파티가 있을 경우 참여중으로 판단
  // useEffect(() => {
  //   axios
  //     .get(`/v1/parties?partyMemberId=${loggedInUser.memberId}&page=1&size=3`)
  //     .then((response) => {
  //       const hasParticipatingParty = response.data.data.some(
  //         (item) => item.partyId == meetingId
  //       );

  //       setIsParticipating(hasParticipatingParty);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating meeting data: ", error);
  //       alert("오류가 발생했습니다!");
  //     });
  // }, [meetingInfo]);
  useEffect(() => {
    axios
      .get(
        `/v1/parties/${meetingId}/partymember-status?memberId=${loggedInUser.memberId}`
      )
      .then((response) => {
        console.log(response.data.isJoined);
        setIsParticipating(response.data.isJoined);
      })
      .catch((error) => {
        console.error("Error updating meeting data: ", error);
        alert("오류가 발생했습니다!");
      });
  }, [meetingInfo]);
  // 북마크를 처리하는 핸들러
  const bookmarkHandler = () => {
    setBookmarked((prev) => !prev);
    axios
      .post(
        `/v1/bookmarks/parties/${meetingId}?memberId=${loggedInUser.memberId}`
      )
      .then((response) => {
        setMeetingInfo((prev) => ({
          ...prev,
          bookmarkCount: bookmarked
            ? prev.bookmarkCount - 1
            : prev.bookmarkCount + 1,
        }));
      })
      .catch((error) => {
        console.error("Error bookmarking meeting data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  // 페이지네이션 페이지를 선택하는 핸들러
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    console.log(meetingInfo);
  }, [bookmarked]);
  return (
    <div className={classes.wrapper}>
      {(isLoading || !meetingInfo || !userInfo) && (
        <>
          <Header />
          <div className={classes.loading}>
            <p>Loading...</p>
          </div>
          <Footer />
        </>
      )}
      {!isLoading && meetingInfo && userInfo && (
        <>
          <Header />
          <div className={classes.container}>
            <div className={classes.infoAndBtn}>
              <div className={classes.info}>
                <div className={classes.title}>
                  <IoIosArrowBack
                    style={{ fontSize: "2rem" }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  />
                  <h1>{meetingInfo.title}</h1>
                </div>
                <div className={classes.writerAndDate}>
                  <div className={classes.writer}>
                    <h4>{userInfo.nickname}</h4>
                  </div>
                  <div className={classes.date}>
                    <h4>{meetingInfo.createdAt.split("T")[0]}</h4>
                  </div>
                  {meetingInfo.partyStatus === "PARTY_OPENED" && (
                    <div className={classes.isRecruiting}>
                      <h4>모집중</h4>
                    </div>
                  )}
                  {meetingInfo.partyStatus === "PARTY_CLOSED" && (
                    <div className={classes.isNotRecruiting}>
                      <h4>모집완료</h4>
                    </div>
                  )}
                  <div className={classes.hits}>
                    <h4>조회수 {meetingInfo.hits}</h4>
                  </div>
                </div>
              </div>

              <div className={classes.btnCon}>
                <div className={classes.bookmark}>
                  <FaBookmark
                    style={{
                      color: bookmarked ? "green" : "black",
                      fontSize: "2rem",
                    }}
                    onClick={bookmarkHandler}
                  />
                  {meetingInfo.bookmarkCount}
                </div>
                {/* 파티가 모집중이고 내 포스트도 아니고 참여중도 아닐경우 렌더링 */}
                {isRecruiting && !isMyPost && !isParticipating && (
                  <button className={classes.joinBtn} onClick={joinHandler}>
                    <FaUsers style={{ fontSize: "1.5rem" }} />
                    참여
                  </button>
                )}
                {/* 내 포스트가 아니고 참여중일 경우 렌더링 (모집 완료인 경우에도 볼 수 있다) */}
                {!isMyPost && isParticipating && (
                  <button
                    className={classes.joinBtn}
                    onClick={joinHandler}
                    disabled={!isRecruiting}
                  >
                    <FaUsers style={{ fontSize: "1.5rem" }} />
                    참여중
                  </button>
                )}
              </div>
            </div>
            <div className={classes.detailInfo}>
              <div className={classes.detail}>
                <h2>상세 정보</h2>
                <div className={classes.info1}>
                  <div className={classes.info1_1}>
                    <h4>
                      모임 장소
                      <div className={classes.emp}>{meetingInfo.address}</div>
                    </h4>
                    <h4>
                      모집 인원
                      <div className={classes.emp}>
                        {meetingInfo.maxCapacity}
                      </div>
                    </h4>
                    <h4>
                      현재 인원
                      <div className={classes.emp}>
                        {meetingInfo.currentCapacity}
                      </div>
                    </h4>
                  </div>
                  <div className={classes.info1_2}>
                    <h4>
                      모임 일시
                      <div className={classes.emp}>
                        {new Date(meetingInfo.meetingDate).toLocaleString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </div>
                    </h4>
                    <h4>
                      모집 마감일
                      <div className={classes.emp}>
                        {new Date(meetingInfo.closingDate).toLocaleString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </div>
                    </h4>
                    {/* 내 포스트인경우나 참여중일 경우 연락처를 보여준다 */}
                    {/* 반대의 경우 안보여줌 */}
                    <h4>
                      연락 방법
                      {(isMyPost || isParticipating) && (
                        <div className={classes.emp}>
                          {meetingInfo.phoneNumber}
                        </div>
                      )}
                      {!isParticipating && !isMyPost && (
                        <div className={classes.alert}>참여 후 확인 가능</div>
                      )}
                    </h4>
                    <h4>
                      예상 날씨
                      <div className={classes.weather}>
                        {/* <WeatherIcon
                        className={classes.wIcon}
                        weatherType={meetingInfo.weather}
                        // weatherType="snow"
                      /> */}
                        {/* {meetingInfo.weather} */}
                        {weather}
                      </div>
                    </h4>
                  </div>
                </div>
                <h2>모임 소개</h2>
                <div className={classes.info2}>{meetingInfo.content}</div>
              </div>
              <div className={classes.map}>
                <MakeMap
                  setAddress={setAddress}
                  lat={meetingInfo.latitude}
                  lng={meetingInfo.longitude}
                />
                {/* 내 포스트일 경우 수정/삭제가 가능함, 수정버튼을 클릭 시 수정 페이지로 이동 */}
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
                      <FaTrash style={{ fontSize: "1.5rem" }} />
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* 모집 중 일경우 댓글 수와 댓글 등/수/삭 버튼 보여주고 모집 완료일경우 댓글 수만 보여줌 */}
            {!isRecruiting && (
              <div className={classes.comment}>
                {!isLoading && <h2>댓글 {comments ? totalLength : 0}</h2>}
              </div>
            )}
            {isRecruiting && (
              <div className={classes.comment}>
                {!isLoading && <h2>댓글 {comments ? totalLength : 0}</h2>}
                {hasMyComment && <h3>내가 쓴 댓글</h3>}
                <textarea
                  placeholder="댓글 내용을 입력하세요..."
                  value={hasMyComment ? myComment.comment : enteredComment}
                  onChange={commentChangeHandler}
                  required
                />
                {/* 내가 쓴 댓글이 없을 경우 새롭게 등록할 수 있도록 버튼을 렌더링 */}
                {!hasMyComment && (
                  <div className={classes.btnCon_2}>
                    <button
                      className={classes.joinBtn_1}
                      onClick={commentSubmitHandler}
                    >
                      댓글 등록
                    </button>
                  </div>
                )}
                {/* 내가 작성한 댓글이 있을 경우 수정/삭제 버튼 렌더링 */}
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
            {/* 댓글 컴포넌트 렌더링 */}

            <Comments
              isLoading={isLoading}
              comments={comments}
              loggedInUser={loggedInUser}
              partyId={meetingId}
              userInfo={userInfo}
              getComments={getComments}
            />

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
        </>
      )}
    </div>
  );
};
export default DetailReview;
