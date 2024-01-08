//EditProfile.jsx
//프로필 수정 페이지 입니다. (작업자: 안민주)


//EditProfile.jsx
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LeaveModal from './LeaveModal';
import classes from '../styles/pages/EditProfile.module.css';

function EditProfile() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    return (
        <div className={classes.Main}>
            <Header />
            <div className={classes.MainContainer}>
                <h1 className={classes.EditProfileTitle}>회원정보수정</h1>

                <div className={classes.NicknameContainer}>
                    <p className={classes.Nickname}>닉네임</p>
                    <div className={classes.UserNickname}>유저 닉네임 출력</div>
                </div>

                <div className={classes.EmailContainer}>
                    <p className={classes.Email}>이메일</p>
                    <div className={classes.UserEmail}>유저 이메일 출력</div>
                </div>

                <div className={classes.CurrentPasswordContainer}>
                    <p className={classes.CurrentPassword}>현재 비밀번호</p>
                    <div className={classes.ConfirmCurrentPasswordContainer}>
                        <div className={classes.UserCurrentPassword}>유저 현재 비밀번호 출력</div>
                        <button className={classes.ConfirmCurrentPasswordButton}>비밀번호 확인</button>
                    </div>
                </div>

                <div className={classes.NewPasswordContainer}>
                    <p className={classes.NewPassword}>새 비밀번호</p>
                    <div className={classes.UserNewPassword}>유저 새 비밀번호 출력</div>
                </div>

                <div className={classes.ConfirmPasswordContainer}>
                    <p className={classes.ConfirmPassword}>새 비밀번호 확인</p>
                    <div className={classes.UserConfirmPassword}>유저 새 비밀번호 확인 출력</div>
                </div>

                <div className={classes.EditButtons}>
                    <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                    {/* <button className={classes.WithdrawalButton}>회원탈퇴</button> */}
                    <button className={classes.EditChangeButton}>변경사항수정</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;
