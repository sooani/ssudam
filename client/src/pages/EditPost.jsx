import { useState, useEffect } from "react";
import classes from "../styles/pages/MakePost.module.css";
import SearchMap from "../components/Map/SearchMap";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
const EditPost = () => {
  // useParams로 meetingId를 가져온다.
  const { meetingId } = useParams();
  // 도로명 주소
  const [address, setAddress] = useState({});
  // 검색용 키워드
  const [searchkeyword, setSearchkeyword] = useState("");

  const today = new Date();

  // 현재 날짜에 1일(24시간)을 더하여 하루 뒤의 일시를 얻음
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().slice(0, 16);

  const [latlng, setLatLng] = useState({ lat: 33.450701, lng: 126.570667 });
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const navigate = useNavigate();
  const [meetingInfo, setMeetingInfo] = useState({
    postedtitle: "",
    meetingname: "",
    numofpeople: "",
    meetingdate: today,
    closingDate: today,
    contact: "",
    content: "",
  });

  const handleCancel = () => {
    navigate(-1);
  };

  // useParams로 받은 meetingId로 meeting 조회
  useEffect(() => {
    console.log("get parties");
    axios
      .get(`/v1/parties/${meetingId}`)
      .then((response) => {
        // reponse로 받은 data로 meetingInfo 설정
        setMeetingInfo(response.data.data);
        // 지도에 찍을 위도, 경도 설정
        setLatLng({
          lat: response.data.data.latitude,
          lng: response.data.data.longitude,
        });
        // 도로명 주소 설정
        setAddress({ address_name: response.data.data.address });
      })
      .catch((error) => {
        console.error("Error getting meeting data: ", error);
      });
  }, []);
  // 위에 원래 meetingId 의존성
  const addressHandler = (e) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      address_name: e.target.value,
    }));
  };
  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
  };
  // 돋보기 이모지의 handler...아마 필요 없을 예정...
  const onSearchHandler = () => {
    console.log("입력 완료");
  };

  const titleHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      title: e.target.value,
    }));
  };
  const numberHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      maxCapacity: e.target.value,
    }));
  };
  const dateHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      meetingDate: e.target.value,
    }));
  };
  const dueHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      closingDate: e.target.value,
    }));
  };
  const contactHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      phoneNumber: e.target.value,
    }));
  };
  const contentHandler = (e) => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      content: e.target.value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();

    let postDTO = {
      title: meetingInfo.title,
      memberId: loggedInUser.id,
      meetingDate: meetingInfo.meetingDate,
      closingDate: meetingInfo.closingDate,
      latitude: latlng.lat,
      longitude: latlng.lng,
      address: address.address_name,
      content: meetingInfo.content,
      maxCapacity: meetingInfo.maxCapacity,
      partyStatus: meetingInfo.partyStatus,
      phoneNumber: meetingInfo.phoneNumber,
    };

    setSearchkeyword("");
    console.log(postDTO);
    axios
      .patch(`/v1/parties/${meetingInfo.partyId}`, postDTO)
      .then((response) => {
        alert("모집글이 수정되었습니다!");
        navigate(-1);
      })
      .catch((error) => {
        console.error("Error updating meeting data: ", error);

        alert("오류가 발생했습니다!");
      });
  };
  const toggleOnHandler = () => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      partyStatus: "PARTY_CLOSED",
    }));
  };
  const toggleOffHandler = () => {
    setMeetingInfo((prevInfo) => ({
      ...prevInfo,
      partyStatus: "PARTY_OPENED",
    }));
  };
  return (
    <div className={classes.wrapper}>
      <Header />
      <form onSubmit={submitHandler}>
        <div className={classes.container}>
          <div className={classes.title}>
            <h2>제목</h2>
            <input
              type="text"
              placeholder="글 제목을 입력하세요..."
              value={meetingInfo.title}
              name="postedtitle"
              onChange={titleHandler}
            />
          </div>
          <div className={classes.info}>
            <div className={classes.inputs}>
              <h2>상세 정보</h2>

              <div className={classes.field}>
                <h4>모임 장소</h4>
                <input
                  type="text"
                  value={address.address_name}
                  onChange={addressHandler}
                  name="address"
                />
              </div>
              <div className={classes.field}>
                <h4>모임 인원</h4>
                <input
                  type="number"
                  placeholder="2명 이상~50명 이하"
                  min={2}
                  max={50}
                  value={meetingInfo.maxCapacity}
                  name="numofpeople"
                  onChange={numberHandler}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 일시</h4>
                <input
                  type="datetime-local"
                  min={formattedTomorrow}
                  value={meetingInfo.meetingDate}
                  name="meetingdate"
                  onChange={dateHandler}
                />
              </div>
              <div className={classes.field}>
                <h4>모집 마감일</h4>
                <input
                  type="datetime-local"
                  min={formattedTomorrow}
                  value={meetingInfo.closingDate}
                  name="duedate"
                  onChange={dueHandler}
                />
              </div>
              <div className={classes.field}>
                <h4>연락 방법</h4>
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                  value={meetingInfo.phoneNumber}
                  name="contact"
                  onChange={contactHandler}
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

              <SearchMap
                setAddress={setAddress}
                searchkeyword={searchkeyword}
                lat={latlng.lat}
                lng={latlng.lng}
                setLatLng={setLatLng}
              />
            </div>
          </div>
          <div className={classes.comment}>
            <h2>내용</h2>
            <textarea
              placeholder="내용을 작성해 주세요..."
              value={meetingInfo.content}
              name="content"
              onChange={contentHandler}
            />
            <div className={classes.btnCon}>
              {/* 모집 상태에 따라 조건부 렌더링 */}
              {meetingInfo.partyStatus === "PARTY_OPENED" && (
                <button className={classes.onBtn} onClick={toggleOnHandler}>
                  현재 모집중
                </button>
              )}
              {meetingInfo.partyStatus === "PARTY_CLOSED" && (
                <button className={classes.offBtn} onClick={toggleOffHandler}>
                  현재 모집완료
                </button>
              )}
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
