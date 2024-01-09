//EditProfile.jsx
//프로필 수정 페이지 입니다. (작업자: 안민주)


//EditProfile.jsx
import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LeaveModal from './LeaveModal';
import classes from '../styles/pages/EditProfile.module.css';
import axios from 'axios';

function EditProfile() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState(null);

    const handleNicknameChange = (event) => {
        const newNickname = event.target.value;
        setNickname(newNickname);
        // 사용자가 새 닉네임을 입력하기 시작하면 에러 메시지 재설정
        setNicknameError(null);
    };

    const handleNicknameValidation = async () => {
        try {
            // 'your-api-endpoint'는 엔드포인트 받으면 바꿔야함
            const response = await axios.post('your-api-endpoint', { nickname: nickname });
            
            if (response.data.available) {
                setNicknameError("사용 가능한 닉네임입니다.");
            } else {
                setNicknameError("이미 사용중인 닉네임입니다.");
            }
        } catch (error) {
            console.error("닉네임 변경 오류:", error);
        }
    };


    return (
        <div className={classes.Main}>
            <Header />
            <div className={classes.MainContainer}>
                <h1 className={classes.EditProfileTitle}>회원정보수정</h1>

                <div className={classes.NicknameContainer}>
                    <p className={classes.Nickname}>닉네임</p>
                    <div className={classes.UserNickname}>
                        <input
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                        />
                        {nicknameError && <p className={classes.NicknameError}>{nicknameError}</p>}
                    <button
                        className={classes.CheckNicknameButton}
                        onClick={handleNicknameValidation}
                    >
                        닉네임 확인
                    </button>
                    </div>
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
