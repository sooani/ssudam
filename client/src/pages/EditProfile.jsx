//EditProfile.jsx
//프로필 수정 페이지 입니다. (작업자: 안민주)


// EditProfile.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../components/Layout/Header';
// import Footer from '../components/Layout/Footer';
// import LeaveModal from './LeaveModal';
// import classes from '../styles/pages/EditProfile.module.css';
// import axios from 'axios';
// import { useForm } from "react-hook-form";

// function EditProfile() {
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [currentNickname, setCurrentNickname] = useState('');
//     const [currentEmail, setCurrentEmail] = useState('');
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//         watch,
//         setError, 
//         clearErrors,
//         getValue
//     } = useForm();

//     // 서버에서 현재 닉네임을 받아오기
//     useEffect(() => {
//         const fetchCurrentNickname = async () => {
//             try {
//                 const response = await axios.get('/v1/members/{member-id}');
//                 setCurrentNickname(response.data.nickname);
//             } catch (error) {
//                 console.error('현재 닉네임 호출오류:', error);
//             }
//         };
//         fetchCurrentNickname();
//     }, []);

//     // 서버에서 현재 이메일을 받아오기
//     useEffect(() => {
//         const fetchCurrentEmail = async () => {
//             try {
//                 const response = await axios.get('/v1/members/{member-id}');
//                 setCurrentEmail(response.data.email);
//             } catch (error) {
//                 console.error('현재 이메일 호출오류:', error);
//             }
//         };
//         fetchCurrentEmail();
//     }, []);

//     const password = watch('newPassword');
//     const passwordCheck = watch('confirmPassword');

//     useEffect(() => {
//         if (password !== passwordCheck && passwordCheck) {
//             setError('confirmPassword', {
//                 type: 'password-mismatch',
//                 message: '비밀번호가 일치하지 않습니다',
//             });
//         } else {
//             // 비밀번호 일치시 오류 제거
//             clearErrors('confirmPassword');
//         }
//     }, [password, passwordCheck, setError, clearErrors]);

//     const onSubmit = async (data) => {
//         try {
//             const response = await axios.post(`/v1/members/{member}`, {
//                 newNickname: data.nickname,
//             });
//             console.log(response.data);
//         } catch (error) {
//             console.error('닉네임 변경 중 오류 ', error);
//         }
//     };

//     return (
//         <div className={classes.Main}>
//             <Header />
//             <div className={classes.MainContainer}>
//                 <h1 className={classes.EditProfileTitle}>회원정보수정</h1>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className={classes.NicknameContainer}>
//                         <label className={classes.Nickname}>닉네임</label>
//                         <div className={classes.UserNicknameContainer}>
//                             <input
//                                 {...register("nickname", {
//                                     required: {
//                                         value: true,
//                                         message: '닉네임을 입력하세요.',
//                                     },
//                                     minLength: {
//                                         value: 2,
//                                         message: '2글자 이상 입력해주세요.',
//                                     },
//                                     maxLength: {
//                                         value: 12,
//                                         message: '최대 12글자까지 입력 가능합니다.',
//                                     },
//                                 })}
//                                 className={classes.UserNickname}
//                                 defaultValue={currentNickname}
//                             />
//                             {errors.nickname && <p className={classes.UserNicknameMSG}>{errors.nickname.message}</p>}
//                         </div>
//                     </div>

//                     <div className={classes.EmailContainer}>
//                         <label className={classes.Email}>이메일</label>
//                         <div className={classes.UserEmail}>{currentEmail}</div>
//                     </div>

//                     <div className={classes.CurrentPasswordContainer}>
//                         <label className={classes.CurrentPassword}>현재 비밀번호</label>
//                         <div className={classes.UserCurrentPasswordcontainer}>
//                             <input
//                                 {...register("currentPassword", { required: 
//                                     {value: true, message: '현재 비밀번호를 입력하세요.'} })}
//                                 className={classes.UserCurrentPassword}
//                             />
//                             {errors?.currentPassword && <p className={classes.UserCurrentPasswordMSG}>{errors.currentPassword.message}</p>}
//                             <button className={classes.ConfirmCurrentPasswordButton}>비밀번호 확인</button>
//                         </div>
//                     </div>

//                     <div className={classes.NewPasswordContainer}>
//                         <label className={classes.NewPassword}>새 비밀번호</label>
//                         <input
//                             {...register("newPassword", { required: 
//                                 {value: true, message: '비밀번호를 입력하세요.'}
//                                 ,minLength: {
//                                     value: 8,
//                                     message: '8글자 이상 입력해주세요.',
//                                 },maxLength:{value:20,
//                                     message:'최대 20글자까지 입력가능합니다.' 
//                                 },pattern : {
//                                     value: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]+$',
//                                     message: '영문 대문자, 소문자, 숫자, 특수문자를 각각 최소한 하나씩 포함해야됩니다.'}
//                                 })}
//                             className={classes.UserNewPassword}
//                         />
//                         {errors?.newPassword && <p className={classes.UserNewPasswordMSG}>{errors.newPassword.message}</p>}
//                     </div>

//                     <div className={classes.ConfirmPasswordContainer}>
//                         <label className={classes.ConfirmPassword}>새 비밀번호 확인</label>
//                         <div className={classes.ConfirmUserPasswordContainer}>
//                             <input
//                                 {...register("confirmPassword", { required: {
//                                     value:true, message : "비밀번호를 입력해주세요."},
//                                     validate:(value) =>
//                                         value === password || '비밀번호가 일치하지 않습니다.',
//                                 })}
//                                 className={classes.UserConfirmPassword}
//                             />
//                             {errors?.confirmPassword && <p className={classes.UserConfirmPasswordMSG}>{errors.confirmPassword.message}</p>}
//                         </div>
//                     </div>

//                     <div className={classes.EditButtons}>
//                         <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
//                         <button className={classes.EditChangeButton}>변경사항수정</button>
//                     </div>
//                 </form>
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
import axios from '../axios';
import { useForm } from "react-hook-form";

const EditProfile = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentNickname, setCurrentNickname] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setError,
        clearErrors,
    } = useForm();

    useEffect(() => {
        const fetchCurrentNickname = async () => {
            try {
                const response = await axios.get('/v1/members/{member-id}');
                setCurrentNickname(response.data.nickname);
            } catch (error) {
                console.error('현재 닉네임 호출오류:', error);
            }
        };
        fetchCurrentNickname();
    }, []);

    useEffect(() => {
        const fetchCurrentEmail = async () => {
            try {
                const response = await axios.get('/v1/members/{member-id}');
                setCurrentEmail(response.data.email);
            } catch (error) {
                console.error('현재 이메일 호출오류:', error);
            }
        };
        fetchCurrentEmail();
    }, []);

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

    const handleConfirmCurrentPassword = async (data) => {
        try {
            // 서버에 현재 비밀번호 확인 요청
            const response = await axios.post('/v1/members/check-password', {
                currentPassword: data.currentPassword,
            });

            // 현재 비밀번호가 맞으면 새 비밀번호 입력란을 보여줌
            setShowNewPasswordFields(true);
        } catch (error) {
            console.error('현재 비밀번호 확인 중 오류:', error);
            // 현재 비밀번호가 틀리면 에러 메시지 표시 또는 다른 처리
        }
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`/v1/members/{member}`, {
                newNickname: data.nickname,
                // 기타 회원 정보 업데이트 로직 추가
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
                        <div className={classes.UserNicknameContainer}>
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
                                defaultValue={currentNickname}
                            />
                            {errors.nickname && <p className={classes.UserNicknameMSG}>{errors.nickname.message}</p>}
                        </div>
                    </div>

                    <div className={classes.EmailContainer}>
                        <label className={classes.Email}>이메일</label>
                        <div className={classes.UserEmail}>{currentEmail}</div>
                    </div>

                    <div className={classes.CurrentPasswordContainer}>
                        <label className={classes.CurrentPassword}>현재 비밀번호</label>
                        <div className={classes.UserCurrentPasswordcontainer}>
                            <input
                                {...register("currentPassword", {
                                    required: {
                                        value: true,
                                        message: '현재 비밀번호를 입력하세요.',
                                    },
                                })}
                                className={classes.UserCurrentPassword}
                            />
                            {errors?.currentPassword && <p className={classes.UserCurrentPasswordMSG}>{errors.currentPassword.message}</p>}
                            <button onClick={handleSubmit(handleConfirmCurrentPassword)} className={classes.ConfirmCurrentPasswordButton}>비밀번호 확인</button>
                        </div>
                    </div>

                    {showNewPasswordFields && (
                        <>
                            <div className={classes.NewPasswordContainer}>
                                <label className={classes.NewPassword}>새 비밀번호</label>
                                <input
                                    {...register("newPassword", {
                                        required: { value: true, message: '비밀번호를 입력하세요.' },
                                        minLength: { value: 8, message: '8글자 이상 입력해주세요.' },
                                        maxLength: { value: 20, message: '최대 20글자까지 입력 가능합니다.' },
                                        pattern: {
                                            value: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]+$',
                                            message: '영문 대문자, 소문자, 숫자, 특수문자를 각각 최소한 하나씩 포함해야됩니다.'
                                        }
                                    })}
                                    className={classes.UserNewPassword}
                                />
                                {errors?.newPassword && <p className={classes.UserNewPasswordMSG}>{errors.newPassword.message}</p>}
                            </div>

                            <div className={classes.ConfirmPasswordContainer}>
                                <label className={classes.ConfirmPassword}>새 비밀번호 확인</label>
                                <div className={classes.ConfirmUserPasswordContainer}>
                                    <input
                                        {...register("confirmPassword", {
                                            required: { value: true, message: "비밀번호를 입력해주세요." },
                                            validate: (value) => value === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
                                        })}
                                        className={classes.UserConfirmPassword}
                                    />
                                    {errors?.confirmPassword && <p className={classes.UserConfirmPasswordMSG}>{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </>
                    )}

                    <div className={classes.EditButtons}>
                        <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                        <button className={classes.EditChangeButton}>변경사항수정</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditProfile;
