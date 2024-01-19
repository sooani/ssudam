import { useState } from "react";
import classes from "../styles/pages/MakePost.module.css";
import SearchMap from "../components/Map/SearchMap";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useAxiosInterceptors } from "../axios";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
const MakePost = () => {
  // 도로명 주소
  const [address, setAddress] = useState({ address_name: "" });
  // 현재 로그인한 사용자 정보 가져오기
  // const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const loggedInUser = useSelector(selectUser);
  // 위도와 경도
  const [latlng, setLatLng] = useState({ lat: 33.450701, lng: 126.570667 });
  // 검색용 키워드
  const [searchkeyword, setSearchkeyword] = useState("");
  const axios = useAxiosInterceptors();
  const today = new Date();
  // const axios = useAxiosInstance();
  // 현재 날짜에 1일(24시간)을 더하여 하루 뒤의 일시를 얻음
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().slice(0, 16);
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  // 모임 글 정보
  const [postedInfo, setPostedInfo] = useState({
    postedtitle: "",
    meetingname: "",
    numofpeople: "",
    meetingdate: today,
    duedate: today,
    contact: "",
    content: "",
  });
  // 도로명 주소를 관리하는 핸들러
  const addressHandler = (e) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      address_name: e.target.value,
    }));
  };
  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(-1);
  };
  // 입력된 검색 키워드를 state로 저장하는 function
  const onKeywordHandler = (e) => {
    setSearchkeyword(e.target.value);
  };
  // 돋보기 이모지의 handler...아마 필요 없을 예정...
  const onSearchHandler = () => {
    console.log("입력 완료");
  };
  const submitHandler = (e) => {
    e.preventDefault();

    // const fieldName = e.target.name;
    // const value = e.target.value;
    // console.log(fieldName);
    // switch (fieldName) {
    //   case "contact":
    //     const isValidPhoneNumber = e.target.checkValidity();
    //     console.log(isValidPhoneNumber);
    //     if (!isValidPhoneNumber) {
    //       e.target.setCustomValidity("000-0000-0000 형식으로 입력해주세요!");
    //     } else {
    //       e.target.setCustomValidity(""); // 유효한 경우 오류 메시지 제거
    //     }
    //     break;
    //   // 다른 필드에 대한 처리 추가 가능
    //   default:
    //     break;
    // }

    // form에서 값 추출
    const data = new FormData(e.target);
    const meetingdate = data.get("meetingdate");
    const postedtitle = data.get("postedtitle");
    const content = data.get("content");
    const numofpeople = data.get("numofpeople");
    const duedate = data.get("duedate");
    const contact = data.get("contact");

    let postDTO = {
      title: postedtitle,
      memberId: loggedInUser.memberId,
      meetingDate: meetingdate,
      closingDate: duedate,
      latitude: latlng.lat,
      longitude: latlng.lng,
      address: address.address_name,
      content: content,
      maxCapacity: numofpeople,
      phoneNumber: contact,
      partyStatus: "PARTY_OPENED",
    };
    // DTO 생성했으니 값 초기화
    setPostedInfo({
      postedtitle: "",
      meetingname: "",
      numofpeople: "",
      meetingdate: today,
      closingDate: today,
      contact: "",
      content: "",
    });

    setSearchkeyword("");
    console.log(postDTO);
    axios

      .post(`/v1/parties`, postDTO)
      .then((response) => {
        alert("모집글이 등록되었습니다!");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error posting meeting data: ", error);
        alert("오류가 발생했습니다!");
      });
  };
  // const handleInputChange = (e) => {
  //   const fieldName = e.target.name;
  //   const value = e.target.value;
  //   console.log(fieldName);
  //   switch (fieldName) {
  //     case "contact":
  //       const isValidPhoneNumber = e.target.checkValidity();
  //       console.log(isValidPhoneNumber);
  //       if (!isValidPhoneNumber) {
  //         e.target.setCustomValidity("000-0000-0000 형식으로 입력해주세요!");
  //       } else {
  //         e.target.setCustomValidity(""); // 유효한 경우 오류 메시지 제거
  //       }
  //       break;
  //     // 다른 필드에 대한 처리 추가 가능
  //     default:
  //       break;
  //   }
  // };
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
              required
              name="postedtitle"
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
                  required
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
                  required
                  name="numofpeople"
                />
              </div>
              <div className={classes.field}>
                <h4>모임 일시</h4>
                <input
                  type="datetime-local"
                  min={formattedTomorrow}
                  required
                  name="meetingdate"
                />
              </div>
              <div className={classes.field}>
                <h4>모집 마감일</h4>
                <input
                  type="datetime-local"
                  min={formattedTomorrow}
                  required
                  name="duedate"
                />
              </div>
              <div className={classes.field}>
                <h4>연락 방법</h4>
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"
                  required
                  name="contact"
                  title="000-0000-0000 형식으로 입력해주세요!"
                  // onChange={handleInputChange}
                  // value={contact}
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
                setLatLng={setLatLng}
              />
            </div>
          </div>
          <div className={classes.comment}>
            <h2>내용</h2>
            <textarea
              placeholder="내용을 작성해 주세요..."
              required
              name="content"
            />
            <div className={classes.btnCon}>
              <button className={classes.cancelBtn} onClick={handleCancel}>
                취소
              </button>
              <button type="submit" className={classes.postBtn}>
                글 등록
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* <Footer /> */}
    </div>
  );
};
export default MakePost;
