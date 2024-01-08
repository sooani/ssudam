import { useState, useEffect } from "react";
import classes from "../styles/pages/MakePost.module.css";
import MakeMap from "../components/Map/MakeMap";
import SearchMap from "../components/Map/SearchMap";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import KakaoMap from "../components/Map/KakaoMap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
const EditPost = () => {
  const { meetingId } = useParams();
  // 도로명 주소
  const [address, setAddress] = useState({});
  // 검색용 키워드
  const [searchkeyword, setSearchkeyword] = useState("");
  // 오늘 날짜에서 년/월/일 도출
  const today = new Date().toISOString().split("T")[0];
  const [meetingInfo, setMeetingInfo] = useState({
    postedtitle: "",
    meetingname: "",
    numofpeople: "",
    meetingdate: today,
    duedate: today,
    contact: "",
    content: "",
  });
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  // useParams로 받은 meetingId로 meeting 조회
  useEffect(() => {
    console.log(meetingId);
    axios
      .get(`/meetings/${meetingId}`)
      .then((response) => {
        console.log(response);
        setMeetingInfo(response.data);
        console.log(meetingInfo);
        setAddress({ address_name: response.data.location });
      })
      .catch((error) => {
        console.error("Error getting meeting data: ", error);
      });
  }, [meetingId]);

  // map 에서 추출한 주소 뒤에 상세 주소 붙이는 function
  const addressHandler = (e) => {
    setAddress({ ...e.target.value });
  };
  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
    console.log(searchkeyword);
  };
  // 돋보기 이모지의 handler...아마 필요 없을 예정...
  const onSearchHandler = () => {
    console.log("입력 완료");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit 완료");
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <form onSubmit={submitHandler}>
        <div className={classes.container}>
          {/* <h1>모임 글 등록</h1> */}
          <div className={classes.title}>
            <h2>제목</h2>
            <input
              type="text"
              placeholder="글 제목을 입력하세요..."
              value={meetingInfo.title}
            />
          </div>
          <div className={classes.info}>
            <div className={classes.inputs}>
              <h2>상세 정보</h2>
              <div className={classes.field}>
                <h4>모임 이름</h4>
                <input type="text" value={meetingInfo.meetingname} />
              </div>
              <div className={classes.field}>
                <h4>모임 장소</h4>
                <input
                  type="text"
                  value={address.address_name}
                  onChange={addressHandler}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 인원</h4>
                <input
                  type="number"
                  placeholder="2명 이상~50명 이하"
                  min={2}
                  max={50}
                  value={meetingInfo.max_capacity}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 날짜</h4>
                <input
                  type="date"
                  min={today}
                  value={meetingInfo.meeting_date}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 마감일</h4>
                <input type="date" min={today} value={meetingInfo.duedate} />
              </div>
              <div className={classes.field}>
                <h4>연락 방법</h4>
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  value={meetingInfo.contact}
                />
              </div>
            </div>
            <div className={classes.map}>
              <div className={classes.search}>
                <MdSearch className={classes.icon} onClick={onSearchHandler} />
                <input
                  type="text"
                  placeholder="검색할 장소를 입력하세요..."
                  value={searchkeyword}
                  onChange={onKeywordHandler}
                />
              </div>
              {/* <KakaoMap /> */}
              {/* <MakeMap setAddress={setAddress} searchkeyword={searchkeyword} /> */}
              <SearchMap
                setAddress={setAddress}
                searchkeyword={searchkeyword}
                lat={meetingInfo.lat}
                lng={meetingInfo.lng}
              />
            </div>
          </div>
          <div className={classes.comment}>
            <h2>내용</h2>
            <textarea
              placeholder="내용을 작성해 주세요..."
              value={meetingInfo.content}
            />
            <div className={classes.btnCon}>
              <button className={classes.cancelBtn} onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className={classes.postBtn}>
                글 수정
              </button>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};
export default EditPost;
