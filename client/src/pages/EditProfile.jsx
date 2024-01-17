// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LeaveModal from './LeaveModal';
import classes from '../styles/pages/EditProfile.module.css';
import { useForm } from "react-hook-form";
import axios from '../axios';

function EditProfile() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isNicknameBlurred, setIsNicknameBlurred] = useState(false);
    const navigate = useNavigate();
    const user = useSelector(selectUser)
    
    //닉네임이랑 비번 분리안되는오류가 있는것같음
    //이부분 데이터 넣고 테스트 해보기 (초기로드시에 닉네임이 있으니까)

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { isSubmitting, isSubmitted, errors, isValid },
    //     watch,
    //     setValue,
    //     trigger
    // } = useForm({
    //     mode: 'onChange'
    // });

    const {
        register,
        handleSubmit,
        formState, 
        watch,
        setValue,
        trigger
    } = useForm({
        mode: 'onChange'
    });

    const { isSubmitting, isSubmitted, errors, isValid } = formState;  
    // formState 에러나서 구조 분해 할당해준부분.. 왜?

    

    useEffect(() => {
        trigger("Nickname");
    }, []);

    const handleNicknameBlur = () => {
        setIsNicknameBlurred(true);
        trigger("Nickname");
    };

    // 닉네임, 이메일 받아오기
    //$가 들어가면?``
    //리덕스의 정보를 불러온다(닉네임, 이메일)->이코드를 작성해서 아래코드 대신 적는다.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/v1/members/1` , { timeout: 10000 });  
                const { email, nickname } = response.data.data;

                setValue('email', email);  
                setValue('Nickname', nickname);  
                trigger('Nickname');  
            } catch (error) {
                console.error('닉네임,이메일 get error:', error);
            }
        };

        fetchData();
    }, []);  

    //닉네임 중복검사! 이거 엔드포인트가 달라야하는지???
    const GetDuplicateNickname = async (value) => {
        try {
            const response = await axios.post("/v1/members/1", { nickname: value });
            if (!response.data.result) {
                // 사용 가능한 닉네임은 false 반환
                console.log('닉네임 중복 체크 결과: 사용 가능한 닉네임');
                return true;
            } else {
                console.log('닉네임 중복 체크 결과: 이미 사용 중인 닉네임');
                return false;
            }
        } catch (error) {
            console.error('닉네임 중복 검사 오류:', error);
            console.error('에러 메시지:', error.message);

            if (error.response) {
                console.error('에러 응답 데이터:', error.response.data);
                console.error('에러 응답 상태 코드:', error.response.status);
                console.error('에러 응답 헤더:', error.response.headers);
            }
    
            throw error;
        }
    }

    //닉네임이랑 비밀번호를 부분적으로 변경 가능하게 분리
    const updateUserData = async (data) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            let updatedUserData = {};
    
            if (data.Nickname) {
                updatedUserData = {
                    nickname: data.Nickname,
                };
            } else if (data.NewPassword) {
                updatedUserData = {
                    password: data.NewPassword,
                    confirmPassword: data.ConfirmPassword,
                };
            }
    
            await axios.post('/v1/members/1', updatedUserData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
    
            alert('회원 정보 수정완료.');
        } catch (error) {
            console.error('회원정보 수정 중 업데이트 오류:', error);
            alert('회원정보 수정 중 오류가 발생했습니다.');
        }
    };

    // 로그인아닐때 로그인 페이지로 이동(로그인 상태유지 부분)
    //푸시할때 주석해제
    // if (!user) {
    //     navigate('/login');
    // }


    return (
        <form>
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
                                            const res = await GetDuplicateNickname(value);
                                            return (
                                                (res && res.data.result) ||
                                            '이미 사용중인 닉네임입니다. 다른 닉네임을 입력하세요'
                                            );
                                            }
                                        },
                                })}
                                className={classes.UserNickname}
                                aria-invalid={isNicknameBlurred && errors.Nickname ? "true" : "false"}
                                onBlur={handleNicknameBlur}
                            />
                            {isNicknameBlurred && errors.Nickname && <small className={classes.UserNicknameMSG}>{errors.Nickname.message}</small>}
                        </div>
                    </div>

                    <div className={classes.EmailContainer}>
                        <label htmlFor="email" className={classes.Email}>이메일</label>
                        <input className={classes.UserEmail} id="email" type="text" readOnly />
                    </div>

                    <div className={classes.NewPasswordContainer}>
                        <label htmlFor="NewPassword" className={classes.NewPassword}>새 비밀번호</label>
                        <div className={classes.UserNewPasswordContainer}>
                            <input
                                id="NewPassword"
                                type="text"
                                {...register("NewPassword", {
                                    required: "새 비밀번호를 입력해주세요.",
                                    minLength: { value: 8, message: "8글자 이상 입력해주세요." },
                                    maxLength: { value: 20, message: "최대 20글자까지 입력 가능합니다." },
                                    pattern: {
                                        // value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,}$/,
                                        value: /^[a-zA-Z\d@$!%*#?&]+$/ ,
                                        message: "영문 대,소문자와 숫자, 특수기호(@$!%*#?&)가 적어도 1개 이상씩 포함되어야 합니다."
                                    }
                                })}
                                aria-invalid={isSubmitted ? (errors.NewPassword ? "true" : "false") : undefined}
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
                            type="text"
                            {...register("ConfirmPassword", {
                                required: "새 비밀번호를 한번 더 입력해주세요.",
                                validate: (value) => value === watch('NewPassword') || '비밀번호가 일치하지 않습니다.2',
                            })}
                            className={classes.UserConfirmPassword}
                            aria-invalid={isSubmitted ? (errors.ConfirmPassword ? "true" : "false") : undefined}
                            onChange={(e) => {
                                setValue("ConfirmPassword", e.target.value);
                                trigger("ConfirmPassword");
                            }}
                        />
                        {errors?.ConfirmPassword && <small className={classes.UserConfirmPasswordMSG}> {errors.ConfirmPassword.message}</small>}
                        </div>
                    </div>

                    <div className={classes.EditButtons}>
                        <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                        {/* <button
                            type="button"
                            onClick={handleSubmit((data) => updateUserData(data))}
                            disabled={isSubmitting}
                            className={classes.EditChangeButton}
                        >
                            변경사항수정
                        </button> */}

                        <button
                            type="button"
                            onClick={handleSubmit((data) => updateUserData(data))}
                            disabled={isSubmitting || !formState.isValid}
                            className={`${classes.EditChangeButton} ${(!formState.isValid) ? classes.DisabledButton : ''}`}
                        >
                            변경사항수정
                        </button>

                    </div>

                </div>
            </div>
            <Footer />
        </form>
    );
}



export default EditProfile;
