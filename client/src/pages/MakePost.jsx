import { useState, useEffect } from "react";
import classes from "../styles/pages/MakePost.module.css";
import MakeMap from "../components/Map/MakeMap";
import SearchMap from "../components/Map/SearchMap";
import { MdSearch } from "react-icons/md";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import KakaoMap from "../components/Map/KakaoMap";
import axios from "../axios";
const MakePost = () => {
  // 도로명 주소
  const [address, setAddress] = useState({ address_name: "" });

  // 위도와 경도
  // const [position, setPosition] = useState({ lat: 33.450701, lng: 126.570667 });
  const [latlng, setLatLng] = useState({ lat: 33.450701, lng: 126.570667 });
  // 검색용 키워드
  const [searchkeyword, setSearchkeyword] = useState("");
  // 오늘 날짜에서 년/월/일 도출
  const today = new Date().toISOString().split("T")[0];

  const [postedInfo, setPostedInfo] = useState({
    postedtitle: "",
    meetingname: "",
    numofpeople: "",
    meetingdate: today,
    duedate: today,
    contact: "",
    content: "",
  });

  // useEffect(() => {
  //   console.log(position);
  // }, [position]);
  // map 에서 추출한 주소 뒤에 상세 주소 붙이는 function
  const addressHandler = (e) => {
    console.log(address);
    console.log(address.address_name);
    setAddress((prevAddress) => ({
      ...prevAddress,
      address_name: e.target.value,
    }));
    console.log(address.address_name);
    // setPostedInfo((prevInfo) => ({
    //   ...prevInfo,
    //   place: ,
    // }));
  };
  // const titleHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     postedtitle: e.target.value,
  //   }));
  //   console.log(postedInfo);
  // };
  // const nameHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     meetingname: e.target.value,
  //   }));
  // };
  // const placeHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     place: e.target.value,
  //   }));
  // };
  // const numberHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     numofpeople: e.target.value,
  //   }));
  // };
  // const dateHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     meetingdate: e.target.value,
  //   }));
  // };
  // const dueHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     duedate: e.target.value,
  //   }));
  // };
  // const contactHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     contact: e.target.value,
  //   }));
  // };
  // const contentHandler = (e) => {
  //   setPostedInfo((prevInfo) => ({
  //     ...prevInfo,
  //     content: e.target.value,
  //   }));
  // };
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
    console.log(postedInfo);
    // console.log(position);
    const data = new FormData(e.target);
    const meetingdate = data.get("meetingdate");
    const postedtitle = data.get("postedtitle");
    const content = data.get("content");
    const numofpeople = data.get("numofpeople");
    const meetingname = data.get("meetingname");
    const duedate = data.get("duedate");
    const contact = data.get("contact");

    let postDTO = {
      id: Math.random() * 1000, //
      // memberId 하나로 가져오기!
      // owneruserId: 1,
      // owneremail: "user1@example.com",
      member_id: 1, //
      meeting_date: meetingdate,
      location: address.address_name,
      lat: latlng.lat,
      lng: latlng.lng,
      title: postedtitle,

      content: content,
      max_capacity: numofpeople,
      current_capacity: 5, //
      // 참여 기능 완성되면 수정 필요 // 글 등록할 때는 기본적으로 0 아님??
      hits: 0, //

      created_at: new Date(), //
      last_modified_at: new Date(), //

      // 아래는 테이블에서 생략됨 이야기 필요
      meetingname: meetingname,
      duedate: duedate,
      contact: contact,

      // hits 필요
      party_status: "모집중", //
    };
    setPostedInfo({
      postedtitle: "",
      meetingname: "",
      numofpeople: "",
      meetingdate: today,
      duedate: today,
      contact: "",
      content: "",
    });
    // setAddress({ address_name: "" });
    setLatLng({
      lat: 33.450701,
      lng: 126.570667,
    });

    setSearchkeyword("");
    setLatLng({ lat: 33.450701, lng: 126.570667 });
    console.log(postedInfo);
    axios
      .post(`/meetings`, postDTO)
      .then((response) => {
        console.log(response.data);
        console.log("submit 완료");
        alert("모집글이 등록되었습니다!");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error posting meeting data: ", error);
        // error.message 판단하여 alert 메세지 던져주기
        alert("오류가 발생했습니다!");
      });
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
              required
              // onChange={titleHandler}
              name="postedtitle"
              // value={postedInfo.postedtitle}
            />
          </div>
          <div className={classes.info}>
            <div className={classes.inputs}>
              <h2>상세 정보</h2>
              <div className={classes.field}>
                <h4>모임 이름</h4>
                <input
                  type="text"
                  required
                  name="meetingname"
                  // onChange={nameHandler}
                  // value={postedInfo.meetingname}
                />
              </div>
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
                  // onChange={numberHandler}
                  // value={postedInfo.numofpeople}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 날짜</h4>
                <input
                  type="date"
                  min={today}
                  required
                  name="meetingdate"
                  // onChange={dateHandler}
                  // value={postedInfo.meetingdate}
                />
              </div>
              <div className={classes.field}>
                <h4>모임 마감일</h4>
                <input
                  type="date"
                  min={today}
                  required
                  name="duedate"
                  // onChange={dueHandler}
                  // value={postedInfo.duedate}
                />
              </div>
              <div className={classes.field}>
                <h4>연락 방법</h4>
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                  required
                  name="contact"
                  // onChange={contactHandler}
                  // value={postedInfo.contact}
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
                // position={position}
                // setPosition={setPosition}
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
              // onChange={contentHandler}
              // value={postedInfo.content}
              name="content"
            />
            <div className={classes.btnCon}>
              <button className={classes.cancelBtn}>취소</button>
              <button type="submit" className={classes.postBtn}>
                글 등록
              </button>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};
export default MakePost;
