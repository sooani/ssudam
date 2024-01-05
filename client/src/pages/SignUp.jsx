import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from "../styles/pages/SignUp.module.css"

// 해결할 문제
// 오류메시지 안나옴(비밀번호 확인과 회원가입 버튼 사이, 각 칸들 사이에 나와야함)
// 빈 칸이 있을 때 회원가입 버튼 누르면 애니메이션 나와야하는데 안나옴
// 각 칸에 유효하지 않은 정보 입력 시 오류메시지 나오는 코드 작성(이메일, 닉네임, 비밀번호 형식 / 비밀번호 확인이 비밀번호와 일치해야함)
// axios(확정x)로 회원가입 정보 보내는 코드 작성
// 더 추가될 수도 있음 유효성 검사 백엔드에서 다 하면 되는건지 확인

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

    const handleSignUp = (e) => {
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

        if (email === '' || nickname === '' || password === '' || confirmPassword === '') {
            setError('모든 정보를 입력하세요.');
            return;
        }

        // axios 등을 사용해 회원가입 로직 수행

        // 회원가입 성공 시 메인페이지로 이동

    }

    return (
        <div className={classes.page}>
            <section className={classes.signupForm}>
                <h1>쓰담</h1>
                <h3>회원가입</h3>
                <form onSubmit={handleSignUp}>
                    <div className={`${classes.inputArea} ${emailError ? classes.warning : ''}`}>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            autoComplete='off'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor='email'>이메일</label>
                    </div>
                    <div className={`${classes.inputArea} ${nicknameError ? classes.warning : ''}`}>
                        <input
                            type='text'
                            name='nickname'
                            id='nickname'
                            autoComplete='off'
                            required
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <label htmlFor='nickname'>닉네임</label>
                    </div>
                    <div className={`${classes.inputArea} ${passwordError ? classes.warning : ''}`}>
                        <input
                            type='password'
                            name='password'
                            id='pw'
                            autoComplete='off'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor='pw'>비밀번호</label>
                    </div>
                    <div className={`${classes.inputArea} ${confirmPasswordError ? classes.warning : ''}`}>
                        <input
                            type='password'
                            name='confirmPassword'
                            id='confirmPw'
                            autoComplete='off'
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor='confirmPw'>비밀번호 확인</label>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className={classes.btnArea}>
                        <button type='submit'>회원가입</button>
                    </div>
                </form>
                <div className={classes.caption}>
                    이미 가입하셨나요? <Link to="/LogIn">로그인</Link>
                </div>
            </section>
        </div>
    )
}

export default SignUp;
