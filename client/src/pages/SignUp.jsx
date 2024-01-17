import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instance from '../axios';
import classes from '../styles/pages/SignUp.module.css';

// 해결할 문제
// 오류메시지 css 수정
// 빈 칸이 있을 때 회원가입 버튼 누르면 나오는 css 수정
// 유효성 검사 뭘 할지 결정(예시. 이메일, 닉네임 중복) (후순위 개발)
// 더 추가될 수도 있음

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  // const [emailMessage, setEmailMessage] = useState('')
  // const [nicknameMessage, setNicknameMessage] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (email === '') {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 1500);
    } else {
      setEmailError(false);
    }

    if (nickname === '') {
      setNicknameError(true);
      setTimeout(() => setNicknameError(false), 1500);
    } else {
      setNicknameError(false);
    }

    if (password === '') {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1500);
    } else {
      setPasswordError(false);
    }

    if (confirmPassword === '' || confirmPassword !== password) {
      setConfirmPasswordError(true);
      setTimeout(() => setConfirmPasswordError(false), 1500);
    } else {
      setConfirmPasswordError(false);
    }

    if (
      email === '' ||
      nickname === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      setError('모든 정보를 입력하세요.');
      return;
    }

    instance
      .post(
        '/v1/members',
        {
          email: email,
          nickname: nickname,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json',
          },
        }
      )
      .then((response) => {
        // 회원가입 성공 시 입력 필드 초기화, 메인페이지로 이동
        console.log(response);
        console.log('회원가입이 되었습니다!');
        setEmail('');
        setNickname('');
        setPassword('');
        setConfirmPassword('');

        navigate('/');
      })
      .catch((error) => {
        // 회원가입 실패 처리 (기존 에러 처리와 유사)
        console.error('회원가입 오류:', error.message);
        setError('회원가입 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className={classes.page}>
      <section className={classes.signupForm}>
        <h1>쓰담</h1>
        <h3>회원가입</h3>
        <form onSubmit={handleSignUp}>
          <div className={classes.inputArea}>
            <input
              type="text"
              name="email"
              id="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className={emailError ? classes.warning : ''}
            >
              이메일
            </label>
          </div>
          <div className={classes.inputArea}>
            <input
              type="text"
              name="nickname"
              id="nickname"
              autoComplete="off"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <label
              htmlFor="nickname"
              className={nicknameError ? classes.warning : ''}
            >
              닉네임
            </label>
          </div>
          <div className={classes.inputArea}>
            <input
              type="password"
              name="password"
              id="pw"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="pw"
              className={passwordError ? classes.warning : ''}
            >
              비밀번호
            </label>
          </div>
          <div className={classes.inputArea}>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPw"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              htmlFor="confirmPw"
              className={confirmPasswordError ? classes.warning : ''}
            >
              비밀번호 확인
            </label>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className={classes.btnArea}>
            <button type="submit">회원가입</button>
          </div>
        </form>
        <div className={classes.caption}>
          이미 가입하셨나요? <Link to="/login">로그인</Link>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
