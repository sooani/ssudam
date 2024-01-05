import { useState, useEffect } from "react";
import classes from "../styles/pages/MakePost.module.css"
import MakeMap from "../components/Map/MakeMap";

const MakePost = () => {
  const [address, setAddress] = useState({});
  const addressHandler = () => {};
  return (
      <div className={classes.container}>
        <h1>모임 글 등록</h1>
        <div className={classes.title}>
          <h2>제목</h2>
          <input type="text" placeholder="글 제목을 입력하세요..." />
        </div>
        <div className={classes.info}>
          <div className={classes.inputs}>
            <h2>상세 정보</h2>
            <div className={classes.field}>
              <h3>모임 이름</h3>
              <input type="text" />
            </div>
            <div className={classes.field}>
              <h3>모임 장소</h3>
              <input
                type="text"
                value={address.address_name}
                onChange={addressHandler}
              />
            </div>
            <div className={classes.field}>
              <h3>모임 인원</h3>
              <input type="number" />
            </div>
            <div className={classes.field}>
              <h3>모임 날짜</h3>
              <input type="date" />
            </div>
            <div className={classes.field}>
              <h3>모임 마감일</h3>
              <input type="date" />
            </div>
            <div className={classes.field}>
              <h3>연락 방법</h3>
              <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
            </div>
          </div>
          <div className={classes.map}>
            <MakeMap setAddress={setAddress} />
          </div>
        </div>
        <div className={classes.comment}>
          <h2>내용</h2>
        </div>
      </div>
  );
};
export default MakePost;
