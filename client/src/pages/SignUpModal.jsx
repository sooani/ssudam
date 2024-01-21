import React, { useState } from "react";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import classes from "../styles/pages/SignUpModal.module.css";
import { useAxiosInterceptors } from "../axios";

// 해결할 문제
// 모달창 X 버튼, 모달창 바깥부분 눌러도 안닫힘
// 오류메시지 css 수정
// 빈 칸이 있을 때 회원가입 버튼 누르면 나오는 css 수정
// 유효성 검사 뭘 할지 결정(예시. 이메일, 닉네임 중복) (후순위 개발)
// 더 추가될 수도 있음

const SignUpModal = ({ isOpen, onClose }) => {
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
      setError("모든 정보를 입력하세요.");
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

    // 닉네임 길이 검증
    if (nickname.length < 2 || nickname.length > 12) {
      setNicknameError(true);
      setError("닉네임은 2~12자여야 합니다.");
      return;
    } else {
      setNicknameError(false);
    }

    // 비밀번호 요구사항 검증
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      setError(
        "비밀번호는 특수문자, 대문자, 소문자, 숫자를 혼합하여 8자 이상 20자 이하로 입력하세요."
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
    <Modal className={classes.modal} isOpen={isOpen} onRequestClose={onClose}>
      <div className={classes.page}>
        <button className={classes.exit} onClick={onClose}>
          X
        </button>
        <section className={classes.signupForm}>
          <h1>
            이 게시글에 <br />
            관심이 있으신가요?
          </h1>
          <h3>
            지금 쓰담에 가입하고 <br />
            어떤 게시글인지 확인해보세요
          </h3>
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
    </Modal>
  );
};

export default SignUpModal;
