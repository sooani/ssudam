import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAxiosInterceptors } from "../axios";
import classes from "../styles/pages/SignUp.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const instance = useAxiosInterceptors();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (email === "") {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 1500);
    } else {
      setEmailError(false);
    }

    if (nickname === "") {
      setNicknameError(true);
      setTimeout(() => setNicknameError(false), 1500);
    } else {
      setNicknameError(false);
    }

    if (password === "") {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1500);
    } else {
      setPasswordError(false);
    }

    if (confirmPassword === "") {
      setConfirmPasswordError(true);
      setTimeout(() => setConfirmPasswordError(false), 1500);
    } else {
      setConfirmPasswordError(false);
    }

    if (
      email === "" ||
      nickname === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("입력하지 않은 정보가 있습니다.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setError("올바른 이메일 주소 형식을 입력하세요.");
      return;
    } else {
      setEmailError(false);
    }

    // 닉네임 검증
    if (nickname.length < 2 || nickname.length > 12) {
      setNicknameError(true);
      setError("닉네임은 2~12자여야 합니다.");
      return;
    } else {
      setNicknameError(false);
    }

    const nicknameRegex = /^[a-zA-Z0-9가-힣]*$/;
    if (!nicknameRegex.test(nickname)) {
      setNicknameError(true);
      setError("특수문자는 입력할 수 없습니다.")
      return;
    }

    // 비밀번호 요구사항 검증
    const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      setError(
        "비밀번호는 영문, 특수문자, 숫자를 혼합하여 8~20자로 입력하세요."
      );
      return;
    } else {
      setPasswordError(false);
    }

    // 비밀번호 확인 일치 검증
    if (confirmPassword !== password) {
      setConfirmPasswordError(true);
      setError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setConfirmPasswordError(false);
    }

    instance
      .post(
        "/v1/members",
        {
          email: email,
          nickname: nickname,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Accept: "application/json",
          },
        }
      )

      .then((response) => {
        // 회원가입 성공 시 입력 필드 초기화, 메인페이지로 이동
        console.log(response);
        console.log("회원가입이 되었습니다!");
        setEmail("");
        setNickname("");
        setPassword("");
        setConfirmPassword("");

        navigate("/");
      })
      .catch((error) => {
        // 회원가입 실패 처리 (기존 에러 처리와 유사)
        console.error("회원가입 오류:", error.message);
        
        // 이메일 또는 닉네임 중복 검증
        if (error.response && error.response.status === 409) {
          setEmailError(true);
          setNicknameError(true);
          setError("이메일 또는 닉네임이 이미 사용 중입니다.")
        } else {
          setError("회원가입 중 오류가 발생했습니다.");
        }
        
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
              className={emailError ? classes.warning : ""}
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
              className={nicknameError ? classes.warning : ""}
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
              className={passwordError ? classes.warning : ""}
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
              className={confirmPasswordError ? classes.warning : ""}
            >
              비밀번호 확인
            </label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className={classes.btnArea}>
            <button type="submit">회원가입</button>
          </div>
        </form>
        <div className={classes.caption}>
          이미 가입하셨나요? <span className={classes.loginLink} onClick={() => navigate("/login")}>로그인</span>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
