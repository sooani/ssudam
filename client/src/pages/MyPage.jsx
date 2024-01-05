//MyPage.jsx
//마이페이지 화면입니다. (작업자:안민주)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import footerLogo from '../images/footerLogo.png';
import '../styles/pages/MyPage.module.css'; 

const MyPage = () => {
    return (
        <div>
            <Header />
            <div className="MypageContainer">
                <div className="MyInfo">
                    <div className="Myprofile">
                        <h1 className="ProfileHeader">내 프로필</h1>
                        <div className="ProfileImageContainer">
                            <img alt='ProfileImage' src={footerLogo} />
                        </div>
                        <Link to="/edit-profile" className="Btn_EditProfile">회원정보수정</Link>
                    </div>
                    <div className="MyData">
                        <div className="NicknameContainer">
                            <p className="Nickname">닉네임</p>
                            <div className="UserNickname">유저의 닉네임이 출력됩니다.</div>
                        <div className="EmailContainer">
                            <p className="Email">이메일</p>
                            <div className="UserEmail">유저의 이메일이 출력됩니다.</div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="MyEvent">
                    <h1 className="MyEventHeader">내가 참여한 모임</h1>
                    {/* 내가 참여한 모임 나타내기 */}
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default MyPage;