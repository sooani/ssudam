// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams  } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
// import LeaveModal from './LeaveModal';
import classes from '../styles/pages/EditProfile.module.css';
import { useForm } from "react-hook-form";
import instance from '../axios';
// import useAxiosInstance from "../axios";
import { Link } from 'react-router-dom';

function EditProfile() {
    // const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isNicknameBlurred, setIsNicknameBlurred] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const { memberId } = useParams(); 
    console.log(memberId); 
    const [userData, setUserData] = useState({});
    const [page, setPage] = useState();
    const [size, setSize] = useState();
    const navigateFunc = useNavigate();
    // const instance = useAxiosInstance();
    //닉네임이랑 비번 분리안되는오류가 있는것같음
    //이부분 데이터 넣고 테스트 해보기 (초기로드시에 닉네임이 있으니까)

    const {
        register,
        handleSubmit,
        formState, 
        watch,
        setValue,
        trigger,
        setError,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            Nickname: '',  // 또는 원하는 초기값으로 설정
            NewPassword: '',
            ConfirmPassword: '',
            // 다른 필드들도 추가할 수 있습니다.
        },
    });

    const { isSubmitting, isSubmitted, errors, isValid } = formState;  
    

    useEffect(() => {
        trigger("Nickname");
        console.log('Form State:', formState);
        console.log('Is Form Valid:', formState.isValid);
    }, []);

    useEffect(() => {
        setValue('Nickname', ''); 
    }, [setValue]);

    const handleNicknameBlur = async () => {
        await trigger("Nickname");
        setIsNicknameBlurred(true);
    };

    // 닉네임, 이메일 받아오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await instance.get(`/v1/members/${memberId}`);  
                const { email, nickname } = response.data.data;

                setValue('email', email);  
                setValue('Nickname', nickname);  
                console.log('email', email);
                console.log('Nickname', nickname);
                // trigger('Nickname');  
            } catch (error) {
                console.error('닉네임/이메일 get error:', error);
            }
        };

        fetchData();
    }, [memberId]); 
    
    useEffect(() => {
        trigger('Nickname');
    }, [setValue]);

let isNicknameAvailableCache = null;

const validateNickname = async (value) => {
    try {
        // const response = await instance.get(`/v1/members/${memberId}`, { params: { memberId, page, size } });
        const response = await instance.get(`/v1/members/${memberId}` );
        const responseData = response.data.data;
        const nicknames = Array.isArray(responseData) ? responseData.map(member => member.nickname) : [];

        if (nicknames.includes(value)) {
            setError("Nickname", {
                type: "manual",
                message: '이미 사용 중인 닉네임입니다.',
            });
            console.log('이미 사용중인 닉네임입니다.');
            return false;
        } else {
            console.log('사용가능한 닉네임입니다.');
            return true;
        }
    } catch (error) {
        console.error('닉네임 중복 검사 오류:', error);
        return false;
    }
};

// const EditUserProfileHandler = async () => {
//     try {
//       const userConfirmed = window.confirm("회원정보를 수정하시겠습니까?");
//       if (!userConfirmed) {
//         return;
//       }
//     const updatedUserProfile = {
//         nickname: watch("Nickname"),
//         // 사용자가 새 비밀번호를 입력한 경우에만 업데이트
//         ...(watch("NewPassword") && {
//             password: watch("NewPassword"),
//             confirmPassword: watch("ConfirmPassword"),
//         }),
//     };
//     const response = await instance.patch(`/v1/members/${memberId}`, updatedUserProfile);

//       if (response.status === 200) {
//         alert("회원정보가 변경되었습니다");
//         window.location.href = `/mypage/${memberId}`;

//       } else {
//         console.error("사용자 프로필 업데이트 오류:", response.data.error);
//         alert("회원정보 변경 오류가 발생했습니다!");
//       }
//     } catch (error) {
//       console.error("사용자 프로필 업데이트 오류:", error);
//       alert("회원정보 변경 중 오류가 발생했습니다!");
//     }
//   };

const EditUserProfileHandler = async () => {
    try {
        const userConfirmed = window.confirm("회원정보를 수정하시겠습니까?");
        if (!userConfirmed) {
            return;
        }

        // 사용자 프로필을 업데이트할 데이터를 수집합니다.
        const updatedUserProfile = {
            nickname: watch("Nickname"),
        };

        const newPassword = watch("NewPassword");

        // 새 비밀번호가 입력된 경우에만 업데이트
        if (newPassword) {
            updatedUserProfile.password = newPassword;
            updatedUserProfile.confirmPassword = watch("ConfirmPassword");
        }

        const response = await instance.patch(`/v1/members/${memberId}`, updatedUserProfile);

        if (response.status === 200) {
            alert("회원정보가 변경되었습니다");

            navigateFunc(`/mypage/${memberId}`);
        } else {
            console.error("사용자 프로필 업데이트 오류:", response.data.error);
            alert("회원정보 변경 오류가 발생했습니다!");
        }
    } catch (error) {
        console.error("사용자 프로필 업데이트 오류:", error);
        alert("회원정보 변경 중 오류가 발생했습니다!");
    }
};


    // 로그인아닐때 로그인 페이지로 이동(로그인 상태유지 부분)
    //푸시할때 주석해제
    if (!user) {
        navigate('/login');
    }

    console.log('Form State:', formState);

    return (
        <form>
            <Header />
            <div className={classes.Main}>
                <Header />
                <div className={classes.MainContainer}>
                    <h1 className={classes.EditProfileTitle}>회원정보수정</h1>

                    <div className={classes.NicknameContainer}>
                        <label htmlFor="Nickname" className={classes.Nickname}>닉네임</label>
                        <div className={classes.UserNicknameContainer}>
                            <input
                                    id="Nickname"
                                    type="text"
                                    {...register("Nickname", {
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
                                        validate: {
                                            isAvailable: async value => {
                                                const isNicknameAvailable = await validateNickname(value);
                                                return isNicknameAvailable || '이미 사용중인 닉네임입니다.4';
                                            },
                                        },
                                    })}
                                    
                                    className={classes.UserNickname}
                                    onBlur={handleNicknameBlur}
                                    value={watch("Nickname") || ''}
                                />

                            {isNicknameBlurred && errors.Nickname && (
                                <small className={classes.UserNicknameMSG}>{errors.Nickname.message}</small>
                            )}
                            {/* {isNicknameBlurred && errors.Nickname && <small className={classes.UserNicknameMSG}>{errors.Nickname.message}</small>} */}
                        </div>
                    </div>

                    <div className={classes.EmailContainer}>
                        <label htmlFor="email" className={classes.Email}>이메일</label>
                        <input className={classes.UserEmail} id="email" type="text" readOnly value={watch('email')}  />
                    </div>

                    <div className={classes.NewPasswordContainer}>
                        <label htmlFor="NewPassword" className={classes.NewPassword}>새 비밀번호</label>
                        <div className={classes.UserNewPasswordContainer}>
                            <input
                                id="NewPassword"
                                type="password"
                                {...register("NewPassword", {
                                    required: "새 비밀번호를 입력해주세요.",
                                    minLength: { value: 8, message: "8글자 이상 입력해주세요." },
                                    maxLength: { value: 20, message: "최대 20글자까지 입력 가능합니다." },
                                    pattern: {
                                        // value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,}$/,
                                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/ ,
                                        message: "영문 대,소문자와 숫자, 특수기호(@$!%*#?&)가 적어도 1개 이상씩 포함되어야 합니다."
                                    }
                                })}
                                defaultValue={""} 
                                className={classes.UserNewPassword}
                            />
                            {errors.NewPassword && <small className={classes.UserNewPasswordMSG}>{errors.NewPassword.message}</small>}
                            </div>
                    </div>

                    <div className={classes.ConfirmPasswordContainer}>
                        <label htmlFor="ConfirmPassword" className={classes.ConfirmPassword}>비밀번호 확인</label>
                        <div className={classes.ConfirmUserPasswordContainer}>
                        <input
                            id="ConfirmPassword"
                            type="password"
                            {...register("ConfirmPassword", {
                                required: "새 비밀번호를 한번 더 입력해주세요.",
                                validate: (value) => value === watch('NewPassword') || '비밀번호가 일치하지 않습니다.2',
                            })}
                            defaultValue={""} 
                            className={classes.UserConfirmPassword}
                            onChange={(e) => {
                                setValue("ConfirmPassword", e.target.value);
                                trigger("ConfirmPassword");
                            }}
                        />
                        {errors?.ConfirmPassword && <small className={classes.UserConfirmPasswordMSG}> {errors.ConfirmPassword.message}</small>}
                        </div>
                    </div>

                    <div className={classes.EditButtons}>
                        {/* <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} /> */}
                        <button
                            type="button"
                            // onClick={handleSubmit((data) => updateUserData(data))}
                            onClick={EditUserProfileHandler}
                            disabled={isSubmitting}
                            className={classes.EditChangeButton}
                        >
                            변경사항수정
                        </button>

                        {/* <button
                            type="button"
                            onClick={handleSubmit((data) => updateUserData(data))}
                            disabled={isSubmitting || !formState.isValid}//중복제출방지
                            className={`${classes.EditChangeButton} ${(!formState.isValid) ? classes.DisabledButton : ''}`}
                        >
                            변경사항수정
                        </button> */}

                    </div>

                </div>
            </div>
            <Footer />
        </form>
    );
}



export default EditProfile;



