import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from "../styles/pages/LogIn.module.css"

// 해결할 문제
// 오류메시지 css 수정
// 이메일 또는 비밀번호 입력하지 않고 로그인 버튼 눌렀을 때 나오는 css 수정
// jwt 토큰 관련 코드 수정
// 유효성검사 뭘 할지 결정 (후순위 개발)
// 더 추가될 수 있음

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();

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

        try {
            const response = await axios.post('/v1/auth/login', {
                email: email,
                password: password,
            })

            // jwt토큰 localstorage에 저장하는 코드 / 상황에 맞게 수정하기
            localStorage.setItem('loginToken', response.data.token);

            // 로그인 성공 시 입력 필드 초기화, 메인 페이지로 이동
            setEmail('');
            setPassword('');

            navigate('/')
        } catch (error) {
            // 서버로부터 에러 응답이 온 경우
            if (error.response) {
                setError('이메일/비밀번호가 일치하지 않습니다.');
            } else {
                // 네트워크 오류 등으로 인한 경우
                console.error('로그인 오류:', error.message);
                setError('로그인 중 오류가 발생했습니다.');
            }
        }
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