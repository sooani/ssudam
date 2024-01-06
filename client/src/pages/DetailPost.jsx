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
  const meetingId = 1;
  // const meetingId = useParams();
  useEffect(() => {
    axios
      // .get(`/comments`, {
      //   params: {
      //     meetingId: 1,
      //   },
      // })
      .get(`/meetings/${meetingId}/comments`)
      .then((response) => {
        setIsLoading(true);
        console.log(response);
        setComments(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting comment datas: ", error);
        setIsLoading(false);
      });
    console.log(comments);
  }, [isLoading]);
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
      {meetingInfo && (
        <div className={classes.container}>
          <div className={classes.infoAndBtn}>
            <div className={classes.info}>
              <div className={classes.title}>
                <IoIosArrowBack style={{ fontSize: "2rem" }} />
                <h1>{meetingInfo.postedtitle}</h1>
              </div>
              <div className={classes.writerAndDate}>
                <div className={classes.writer}>
                  <h4>{meetingInfo.owneremail}</h4>
                </div>
                <div className={classes.date}>
                  <h4>{meetingInfo.posteddate.split("T")[0]}</h4>
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
                  <h4>모임 이름 {meetingInfo.meetingname}</h4>
                  <h4>모집 인원 {meetingInfo.numofpeople}</h4>
                  <h4>모임 장소 {meetingInfo.place}</h4>
                  <h4>현재 인원 {meetingInfo.presentnum}</h4>
                </div>
                <div className={classes.info1_2}>
                  <h4>모임 날짜 {meetingInfo.meetingdate.split("T")[0]}</h4>
                  <h4>모임 마감일 {meetingInfo.duedate.split("T")[0]}</h4>
                  <h4>연락 방법 {meetingInfo.contact}</h4>
                </div>
              </div>
              <h2>모임 소개</h2>
              <div className={classes.info2}>{meetingInfo.content}</div>
            </div>
            <div className={classes.map}>
              <MakeMap setAddress={setAddress} />
              <div className={classes.btnCon_1}>
                <button className={classes.joinBtn}>
                  수정
                  <FaEdit style={{ fontSize: "1.5rem" }} />
                </button>
                <button className={classes.deleteBtn}>
                  삭제
                  <FaTrash style={{ fontSize: "1.5rem" }} />
                </button>
              </div>
            </div>
          </div>
          <div className={classes.comment}>
            {comments && !isLoading && <h2>댓글 {comments.length}</h2>}
            <textarea placeholder="댓글 내용을 입력하세요..." />
            <div className={classes.btnCon_2}>
              <button className={classes.joinBtn}>
                댓글 등록
                {/* <FaPlus style={{ fontSize: "1.5rem" }} /> */}
              </button>
            </div>
          </div>
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
