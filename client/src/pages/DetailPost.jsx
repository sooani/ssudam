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
const DetailPost = () => {
  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.container}>
        <div className={classes.infoAndBtn}>
          <div className={classes.info}>
            <div className={classes.title}>
              <IoIosArrowBack style={{ fontSize: "2rem" }} />
              <h1>제목</h1>
            </div>
            <div className={classes.writerAndDate}>
              <div className={classes.writer}>
                <h4>작성자1</h4>
              </div>
              <div className={classes.date}>
                <h4>2024.01.06</h4>
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
                <h4>모임 이름</h4>
                <h4>모임 장소</h4>
                <h4>모임 장소</h4>
                <h4>현재 인원</h4>
              </div>
              <div className={classes.info1_2}>
                <h4>모임 날짜</h4>
                <h4>모임 마감일 </h4>
                <h4>연락 방법</h4>
              </div>
            </div>
            <h2>모임 소개</h2>
            <div className={classes.info2}>
              1시에 모여서 같이 달리면서 쓰레기 주워요 겁나 달려요, 주워요,
              돌아가요
            </div>
          </div>
          <div className={classes.map}>
            <MakeMap />
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
          <h2>댓글 0</h2>
          <textarea placeholder="댓글 내용을 입력하세요..." />
          <div className={classes.btnCon_2}>
            <button className={classes.joinBtn}>
              댓글 등록
              {/* <FaPlus style={{ fontSize: "1.5rem" }} /> */}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default DetailPost;
