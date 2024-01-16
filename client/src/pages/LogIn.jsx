import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice'
import axios from 'axios';
import classes from "../styles/pages/LogIn.module.css"

// 해결할 문제
// 오류메시지 css 수정
// 이메일 또는 비밀번호 입력하지 않고 로그인 버튼 눌렀을 때 나오는 css 수정
// 유효성검사 뭘 할지 결정 (후순위 개발) 
// 더 추가될 수 있음

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        console.log('handleLogin 함수 호출')
        e.preventDefault();

        // 이메일이나 비밀번호를 입력하지 않았을 때
        if (email === '') {
            setEmailError(true);
            setTimeout(() => setEmailError(false),  1500);
        } else {
            setEmailError(false);
        }

        if (password === '') {
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 1500)
        } else {
            setPasswordError(false);
        }

        if (email === '' || password === '') {
            setError('이메일 또는 비밀번호를 입력하세요.');
            console.log('이메일 또는 비밀번호를 입력하세요.')
            return;
        }

        axios.post('/v1/auth/login', {
            username: email,
            password: password,
        },
        {
            headers : {
               // 'Content-Type' : 'application/json', //클라이언트가 서버한테 요청하는(원하는) 타입
              "Content-Type": "application/json;charset=UTF-8",
              // 서버로부터 받고자 하는 응답 데이터의 타입
              'Accept' : 'application/json',
              // CORS 정책에 관련된 헤더, '*' 값은 모든 도메인에서 이 서버에 접근할 수 있다는 것
              // 보안상의 이유로 '*' 대신에 특정 도메인을 명시하는 것이 좋으니 url 나오면 수정(?)
              'Access-Control-Allow-Origin' : '*',
            },
        })
            .then((response) => {
                console.log(response.data);
                console.log(response.headers.authorization); // Authorization 헤더 값, 주로 인증토큰 담고있음
                console.log('로그인 되었습니다!');

                const { email, memberId, nickname } = response.data
                const accessToken = response.headers.authorization

                localStorage.setItem('Authorization', accessToken);
                localStorage.setItem('email', email);
                localStorage.setItem('memberId', memberId);
                localStorage.setItem('nickname', nickname);
                
                dispatch(
                    login({
                        user: {
                            username: email,
                            nickname: nickname,
                            memberId, memberId,
                        },
                        accessToken: accessToken,
                    })
                )

                // 로그인 성공 시 입력 필드 초기화, 메인 페이지로 이동
                setEmail('');
                setPassword('');

                navigate('/');
            })
            .catch((error) => {
                // 서버로부터 에러 응답이 온 경우
                if (error.response) {
                    setError('이메일/비밀번호가 일치하지 않습니다.');
                } else {
                    // 네트워크 오류 등으로 인한 경우
                    console.error('로그인 오류:', error.message);
                    setError('로그인 중 오류가 발생했습니다.');
                }
            });
    }

    return (
        <div className={classes.page}>
            <section className={classes.loginForm}>
                <h1>쓰담</h1>
                <h3>로그인</h3>
                <form onSubmit={handleLogin}>
                    <div className={classes.inputArea}>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            autoComplete='off'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor='email' className={emailError ? classes.warning : ''}>이메일</label>
                    </div>
                    <div className={classes.inputArea}>
                        <input
                            type='password'
                            name='password'
                            id='pw'
                            autoComplete='off'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor='pw' className={passwordError ? classes.warning : ''}>비밀번호</label>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className={classes.btnArea}>
                        <button type='submit'>로그인</button>
                    </div>
                </form>
                <div className={classes.caption}>
                    계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </div>
            </section>
        </div>
    )
}

export default LogIn;