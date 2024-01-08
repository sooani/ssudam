import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from "../styles/pages/LogIn.module.css"

// 해결할 문제
// 오류메시지 css 수정
// 이메일 또는 비밀번호 입력하지 않고 로그인 버튼 눌렀을 때 나오는 css 수정
// axios(확정x)로 로그인 정보 보내는 코드 작성
// 유효성검사 뭘 할지 결정 (후순위 개발)
// 더 추가될 수 있음

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogin = (e) => {
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

        // 왜 오류 메시지가 안나오지? handleLogin이 호출이 되지 않는 것 같다.
        if (email === '' || password === '') {
            setError('이메일 또는 비밀번호를 입력하세요.');
            console.log('이메일 또는 비밀번호를 입력하세요.')
            return;
        }

        // 이메일이나 비밀번호가 틀릴 때 (이메일/비밀번호가 일치하지 않습니다.)

        //로그인 처리 로직 axios?
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