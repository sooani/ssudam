//EditProfile.jsx
//프로필 수정 페이지 입니다. (작업자: 안민주)


//EditProfile.jsx
// import React,{useState} from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../components/Layout/Header';
// import Footer from '../components/Layout/Footer';
// import LeaveModal from './LeaveModal';
// import classes from '../styles/pages/EditProfile.module.css';
// import axios from 'axios';
// import { useForm } from "react-hook-form";

// function EditProfile() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [nickname, setNickname] = useState("");
//     const [nicknameError, setNicknameError] = useState(null);

//     const handleNicknameChange = (event) => {
//         const newNickname = event.target.value;
//         setNickname(newNickname);
//         // 사용자가 새 닉네임을 입력하기 시작하면 에러 메시지 재설정
//         setNicknameError(null);
//     };

//     const handleNicknameValidation = async () => {
//         try {
//             // 'your-api-endpoint'는 엔드포인트 받으면 바꿔야함
//             const response = await axios.post('your-api-endpoint', { nickname: nickname });
            
//             if (response.data.available) {
//                 setNicknameError("사용 가능한 닉네임입니다.");
//             } else {
//                 setNicknameError("이미 사용중인 닉네임입니다.");
//             }
//         } catch (error) {
//             console.error("닉네임 변경 오류:", error);
//         }
//     };


//     return (
//         <div className={classes.Main}>
//             <Header />
//             <div className={classes.MainContainer}>
//                 <h1 className={classes.EditProfileTitle}>회원정보수정</h1>

//                 <div className={classes.NicknameContainer}>
//                     <p className={classes.Nickname}>닉네임</p>
//                         <input
//                             type="text"
//                             value={nickname}
//                             onChange={handleNicknameChange}
//                             className={classes.UserNickname}
//                         />
//                         {nicknameError && <p className={classes.NicknameError}>{nicknameError}</p>}
//                     <button
//                         className={classes.CheckNicknameButton}
//                         onClick={handleNicknameValidation}
//                     >
//                         닉네임 확인
//                     </button>
//                 </div>

//                 <div className={classes.EmailContainer}>
//                     <p className={classes.Email}>이메일</p>
//                     <div className={classes.UserEmail}>유저 이메일 출력</div>
//                 </div>

//                 <div className={classes.CurrentPasswordContainer}>
//                     <p className={classes.CurrentPassword}>현재 비밀번호</p>
//                     <div className={classes.ConfirmCurrentPasswordContainer}>
//                         <div className={classes.UserCurrentPassword}>유저 현재 비밀번호 출력</div>
//                         <button className={classes.ConfirmCurrentPasswordButton}>비밀번호 확인</button>
//                     </div>
//                 </div>

//                 <div className={classes.NewPasswordContainer}>
//                     <p className={classes.NewPassword}>새 비밀번호</p>
//                     <div className={classes.UserNewPassword}>유저 새 비밀번호 출력</div>
//                 </div>

//                 <div className={classes.ConfirmPasswordContainer}>
//                     <p className={classes.ConfirmPassword}>새 비밀번호 확인</p>
//                     <div className={classes.UserConfirmPassword}>유저 새 비밀번호 확인 출력</div>
//                 </div>

//                 <div className={classes.EditButtons}>
//                     <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
//                     {/* <button className={classes.WithdrawalButton}>회원탈퇴</button> */}
//                     <button className={classes.EditChangeButton}>변경사항수정</button>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default EditProfile;



// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LeaveModal from './LeaveModal';
import classes from '../styles/pages/EditProfile.module.css';
import axios from 'axios';
import { useForm } from "react-hook-form";

function EditProfile() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setError, 
        clearErrors
    } = useForm();

    const password = watch('newPassword');
    const passwordCheck = watch('confirmPassword');

    useEffect(() => {
        if (password !== passwordCheck && passwordCheck) {
            setError('confirmPassword', {
                type: 'password-mismatch',
                message: '비밀번호가 일치하지 않습니다',
            });
        } else {
            // 비밀번호 일치시 오류 제거
            clearErrors('confirmPassword');
        }
    }, [password, passwordCheck, setError, clearErrors]);

    const onSubmit = async (data) => {
        try {
            // 닉네임을 변경하는 API 엔드포인트가 '/v1/members/{member}'라 가정합니다.
            // 이때, {member}는 실제 사용자 ID 또는 다른 식별자로 대체되어야 합니다.
            const response = await axios.post(`/v1/members/{member}`, {
                newNickname: data.nickname,
            });
            console.log(response.data);
        } catch (error) {
            console.error('닉네임 변경 중 오류 ', error);
        }
    };

    return (
        <div className={classes.Main}>
            <Header />
            <div className={classes.MainContainer}>
                <h1 className={classes.EditProfileTitle}>회원정보수정</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.NicknameContainer}>
                        <label className={classes.Nickname}>닉네임</label>
                        <input
                            {...register("nickname", {
                                required: {
                                    value: true,
                                    message: '닉네임을 입력하세요.',
                                },
                                minLength: {
                                    value: 2,
                                    message: '2글자 이상 입력해주세요.',
                                },
                                maxLength: {
                                    value: 12,
                                    message: '최대 12글자까지 입력 가능합니다.',
                                },
                            })}
                            className={classes.UserNickname}
                        />
                        {errors.nickname && <p>{errors.nickname.message}</p>}
                    </div>

                    <div className={classes.EmailContainer}>
                        <label className={classes.Email}>이메일</label>
                        <div className={classes.UserEmail}>유저 이메일 출력</div>
                    </div>

                    <div className={classes.CurrentPasswordContainer}>
                        <label className={classes.CurrentPassword}>현재 비밀번호</label>
                        <input
                            {...register("currentPassword", { required: true })}
                            className={classes.UserCurrentPassword}
                        />
                        {errors?.currentPassword && <p>이 필드는 필수입니다</p>}
                        <button className={classes.ConfirmCurrentPasswordButton}>비밀번호 확인</button>
                    </div>

                    <div className={classes.NewPasswordContainer}>
                        <label className={classes.NewPassword}>새 비밀번호</label>
                        <input
                            {...register("newPassword", { required: true })}
                            className={classes.UserNewPassword}
                        />
                        {errors?.newPassword && <p>이 필드는 필수입니다</p>}
                    </div>

                    <div className={classes.ConfirmPasswordContainer}>
                        <label className={classes.ConfirmPassword}>새 비밀번호 확인</label>
                        <input
                            {...register("confirmPassword", { required: true })}
                            className={classes.UserConfirmPassword}
                        />
                        {errors?.confirmPassword && <p>이 필드는 필수입니다</p>}
                    </div>

                    <div className={classes.EditButtons}>
                        <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                        <button className={classes.EditChangeButton}>변경사항수정</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;

