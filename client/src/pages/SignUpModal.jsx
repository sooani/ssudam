import React, { useState } from 'react';
import Modal from 'react-modal'
import { Link } from 'react-router-dom';
import classes from "../styles/pages/SignUpModal.module.css"

const SignUpModal = ({isOpen, onClose}) => {
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

        // 회원가입 성공 시 모달 닫고 메인페이지로 이동
        onClose();

    }

    return (
        <Modal className={classes.modal} isOpen={isOpen} onRequestClose={onClose}>
        <div className={classes.page}>
            <button className={classes.exit} onClick={onClose}>X</button>
            <section className={classes.signupForm}>
                <h1>이 게시글에 관심이 있으신가요?</h1>
                <h3>지금 쓰담에 가입하고 어떤 게시글인지 확인해보세요</h3>
                <form onSubmit={handleSignUp}>
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
                            type='text'
                            name='nickname'
                            id='nickname'
                            autoComplete='off'
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <label htmlFor='nickname' className={nicknameError ? classes.warning : ''}>닉네임</label>
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
                    <div className={classes.inputArea}>
                        <input
                            type='password'
                            name='confirmPassword'
                            id='confirmPw'
                            autoComplete='off'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label htmlFor='confirmPw' className={confirmPasswordError ? classes.warning : ''}>비밀번호 확인</label>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className={classes.btnArea}>
                        <button type='submit'>회원가입</button>
                    </div>
                </form>
                <div className={classes.caption}>
                    이미 가입하셨나요? <Link to="/login">로그인</Link>
                </div>
            </section>
        </div>
    </Modal>
    );
}

export default SignUpModal;