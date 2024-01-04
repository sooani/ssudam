import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from "../styles/pages/LogIn.module.css"

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        //로그인 처리 로직 axios?
    }

    return (
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
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='email'>이메일</label>
                </div>
                <div className={classes.inputArea}>
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
                <div className={classes.btnArea}>
                    <button type='submit'>로그인</button>
                </div>
            </form>
            <div className={classes.caption}>
                계정이 없으신가요? <Link to="/SignUp">회원가입</Link>
            </div>
        </section>
    )
}

export default LogIn;