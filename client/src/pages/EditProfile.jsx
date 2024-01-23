// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import classes from '../styles/pages/EditProfile.module.css';
import { useForm } from 'react-hook-form';
import { useAxiosInterceptors } from '../axios';
import { Link } from 'react-router-dom';

function EditProfile() {
  const [isNicknameBlurred, setIsNicknameBlurred] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { memberId } = useParams();
  console.log(memberId);
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState();
  const [size, setSize] = useState();
  const navigateFunc = useNavigate();
  const instance = useAxiosInterceptors();

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
  });

  const { isSubmitting, isSubmitted, errors, isValid } = formState;

  useEffect(() => {
    trigger('Nickname');
    console.log('Form State:', formState);
    console.log('Is Form Valid:', formState.isValid);
  }, []);

  useEffect(() => {
    setValue('Nickname', '');
  }, [setValue]);

  const handleNicknameBlur = async () => {
    await trigger('Nickname');
    setIsNicknameBlurred(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(`/v1/members/${memberId}`);
        const { email, nickname } = response.data.data;

        setValue('email', email);
        setValue('Nickname', nickname);
        console.log('email', email);
        console.log('Nickname', nickname);
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

  const EditUserProfileHandler = async () => {
    try {
      const userConfirmed = window.confirm('회원정보를 수정하시겠습니까?');
      if (!userConfirmed) {
        return;
      }

      const updatedUserProfile = {
        nickname: watch('Nickname'),
      };

      const newPassword = watch('NewPassword');

      if (newPassword) {
        updatedUserProfile.password = newPassword;
        updatedUserProfile.confirmPassword = watch('ConfirmPassword');
      }

      const response = await instance.patch(`/v1/members/${memberId}`, updatedUserProfile);

      if (response.status === 200) {
        alert('회원정보가 변경되었습니다');

        navigateFunc(`/mypage/${memberId}`);
      } else {
        console.error('사용자 프로필 업데이트 오류:', response.data.error);
        // alert('회원정보 변경 오류가 발생했습니다!');
        alert('이미 존재하는 닉네임입니다!');
      }
    } catch (error) {
      console.error('사용자 프로필 업데이트 오류:', error);
      alert('모든 입력란을 양식에 맞게 입력해주세요.');
    }
  };

  if (!user) {
    navigate('/login');
  }

  console.log('Form State:', formState);

    //깃 푸시할때 아래부분 주석 꼭 해제하기!
  // 로그인아닐때 로그인 페이지로 이동 (로그인 상태유지 부분)
  if (!user) {
    navigate('/login');
}


  return (
    <form>
      <Header />
      <div className={classes.Main}>
        <div className={classes.MainContainer}>
          <h1 className={classes.EditProfileTitle}>회원정보수정</h1>

          <div className={classes.NicknameContainer}>
            <label htmlFor="Nickname" className={classes.Nickname}>
              닉네임
            </label>
            <div className={classes.UserNicknameContainer}>
              <input
                id="Nickname"
                type="text"
                {...register('Nickname', {
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
                  pattern: {
                    value: /^[a-zA-Z0-9가-힣]*$/,
                    message: '특수문자는 사용할 수 없습니다.',
                  },
                })}
                className={classes.UserNickname}
                onBlur={handleNicknameBlur}
                value={watch('Nickname') || ''}
              />

              {isNicknameBlurred && errors.Nickname && (
                <small className={classes.UserNicknameMSG}>{errors.Nickname.message}</small>
              )}
            </div>
          </div>

          <div className={classes.EmailContainer}>
            <label htmlFor="email" className={classes.Email}>
              이메일
            </label>
            <input className={classes.UserEmail} id="email" type="text" readOnly value={watch('email')} />
          </div>

          <div className={classes.NewPasswordContainer}>
            <label htmlFor="NewPassword" className={classes.NewPassword}>
              새 비밀번호
            </label>
            <div className={classes.UserNewPasswordContainer}>
              <input
                id="NewPassword"
                type="password"
                {...register('NewPassword', {
                  required: '새 비밀번호를 입력해주세요.',
                  minLength: { value: 8, message: '8글자 이상 입력해주세요.' },
                  maxLength: { value: 20, message: '최대 20글자까지 입력 가능합니다.' },
                  pattern: {
                    value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
                    message: '영문, 숫자, 특수문자가 하나씩 포함되어야 합니다.',
                  },
                })}
                defaultValue={''}
                className={classes.UserNewPassword}
              />
              {errors.NewPassword && (
                <small className={classes.UserNewPasswordMSG}>{errors.NewPassword.message}</small>
              )}
            </div>
          </div>

          <div className={classes.ConfirmPasswordContainer}>
            <label htmlFor="ConfirmPassword" className={classes.ConfirmPassword}>
              비밀번호 확인
            </label>
            <div className={classes.ConfirmUserPasswordContainer}>
              <input
                id="ConfirmPassword"
                type="password"
                {...register('ConfirmPassword', {
                  required: '새 비밀번호를 한번 더 입력해주세요.',
                  validate: (value) => value === watch('NewPassword') || '비밀번호가 일치하지 않습니다.',
                })}
                defaultValue={''}
                className={classes.UserConfirmPassword}
                onChange={(e) => {
                  setValue('ConfirmPassword', e.target.value);
                  trigger('ConfirmPassword');
                }}
              />
              {errors?.ConfirmPassword && (
                <small className={classes.UserConfirmPasswordMSG}>{errors.ConfirmPassword.message}</small>
              )}
            </div>
          </div>

          <div className={classes.EditButtons}>
            <button
              type="button"
              onClick={EditUserProfileHandler}
              disabled={isSubmitting}
              className={classes.EditChangeButton}
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
