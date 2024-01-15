
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
    const [newNickname, setNewNickname] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        clearErrors,
        watch
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

    const [initialLoad, setInitialLoad] = useState(true);

    const handleNicknameChange = (e) => {
        setNewNickname(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };


    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`/v1/members/{member}`, {
                newNickname: data.nickname,
                newPassword : data.newpassword
            });
            console.log(response.data);
        } catch (error) {
            console.error('닉네임 변경 중 오류 ', error);
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.Main}>
                <Header />
                <div className={classes.MainContainer}>
                    <h1 className={classes.EditProfileTitle}>회원정보수정</h1>
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
                                    onChange={handleNicknameChange}
                                />
                                {errors.nickname && <p className={classes.UserNicknameMSG}>{errors.nickname.message}</p>}
                            </div>
                        </div>

                        <div className={classes.EmailContainer}>
                            <label className={classes.Email}>이메일</label>
                            <input
                                type="text"
                                className={classes.UserEmail}
                                value={currentEmail}
                                readOnly
                            />
                        </div>


                            <>
                                <div className={classes.NewPasswordContainer}>
                                    <label className={classes.NewPassword}>새 비밀번호</label>
                                    <div className={classes.UserNewPasswordContainer}>
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
                                            onChange={handleNewPasswordChange}
                                        />
                                        {errors?.newPassword && <p className={classes.UserNewPasswordMSG}>{errors.newPassword.message}</p>}
                                    </div>
                                </div>


                                <div className={classes.ConfirmPasswordContainer}>
                                    <label className={classes.ConfirmPassword}>새 비밀번호 확인</label>
                                    <div className={classes.ConfirmUserPasswordContainer}>
                                        <input
                                            {...register("confirmPassword", {
                                                required: { value: true, message: "비밀번호를 입력해주세요." },
                                                validate: (value) => value === watch('newPassword') || '비밀번호가 일치하지 않습니다.2',
                                            })}
                                            className={classes.UserConfirmPassword}
                                        />
                                        {errors?.confirmPassword && <p className={classes.UserConfirmPasswordMSG}>{errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </>
                        

                        <div className={classes.EditButtons}>
                            <LeaveModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
                            <button type="submit" className={classes.EditChangeButton}>변경사항수정</button>
                        </div>

                </div>
                <Footer />
            </div>
        </form>
    );
};

export default EditProfile;
