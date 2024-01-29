<p align="center">
  <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/ee677d7e-7f19-499e-a74d-9dc2ad0263a5">
</p>
<h3 align='center'> 쓰담(SSUDAM)은 쓰레기 담기의 줄인말로 
<br>
  지역 생태계 보호와 걷기를 통한 주민들의 건강 증진을 돕는 커뮤니티 사이트입니다. </h3>
  
<br>

## 🚩 개요
- 프로젝트 이름 : 쓰담 (SSUDAM)
- 프로젝트 기간 : 2023.12.22 ~ 2024.01.23
- 배포주소 : ~~*[쓰담✨ 배포중지](http://ssdam.s3-website.ap-northeast-2.amazonaws.com/)*~~
- 백엔드 서비스 메뉴얼 : [SSUDAM 백엔드 서비스 메뉴얼 ✨](https://gregarious-diagram-be0.notion.site/SSUDAM-a654f4266fcf4111b404737bf1ff1b31?pvs=4)

<br>

## 🧩 담당 역할

### Restful Api를 활용한 모임글 CRUD 기능 구현
   - `Party` 도메인 작성
   - JPA 쿼리 메서드를 활용하여 특정 조건의 모임 조회기능
     - 키워드로 제목,글내용 검색기능
     - 최신글 조회 기능
   - 조인테이블 `PartyMember` 를 사용해 `Party` 와 `Member`를 연결
   - 모임글 조회수 기능
### 모임글 참여/취소 기능
   - 해당 멤버의 모임 가입 여부를 확인 후 모임의 참가인원을 증가
### Scheduler를 활용한 모집상태 변경 기능
   - 모임일자와 모집마감일자가 지난 모임글을 `Scheduler` 를 활용해 일정시간마다 확인 후 모집종료로 상태변경
### MySQL을 통한 데이터베이스 관리
   - `AWS RDS`와 `MySQL`연동을 통해 안정적인 데이터베이스 저장환경 구성
### AWS(EC2,RDS-MySQL) 배포환경 구축 및 배포
   - AWS의 배포환경과 `EC2`를 사용하여 서버 배포
### Swap Memory 적용을 통한 EC2 메모리 부족 해결
   - AWS 프리티어 `t2.micro` 램 부족 현상을 리눅스 `SWAP` 메모리 설정으로 해결
### Apache Benchmarking tool을 활용한 성능 테스트
   - `Gnuplot`을 사용해서 결과파일과 그래프이미지 생성
### Apache Jmeter를 활용한 성능 테스트
   - `Jmeter` 를 사용해 서버 부하테스트 진행 후 안전성 확인
### 슬라이스 테스트에 Mockito 적용
   - `PartyController` 클래스의 `test case` 구현
### Spring Rest Docs를 이용한 API 문서 작성
   - 테스트 실행 후 성공하는 경우 자동으로 문서스니펫을 생성하여 API문서를 구축
### 깃허브 관리
   - 이슈와 칸반에 계획일정들을 세분화하여 등록 후 관리

<br>

------

<br>

## 🖥 Pages Preview

| 메인 : 일반유저 | 메인 : 관리자 |
| :---: | :---: |
| <img src="https://github.com/hyezuu/suudam/assets/147456219/0e572cc9-e182-443d-a7bc-6746365909d3" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/50210814-0cfa-4d3c-9459-ed3d616f69a0" width="370" height="200"/> |

| 메인 : 검색 | 메인 : 비로그인 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/99bb458d-5676-4d2d-be5c-09d3cf7f61c0" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/48a7a7d7-3ea5-4776-b13a-6df2f63d2e72" width="370" height="200"/> |

| 모임글 등록 | 북마크 기능 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/03daf867-43ad-4d3d-97b7-1939f8d779dd" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/1de7774d-d871-41f1-b614-3aad6cabc1ce" width="370" height="200"/> |

| 모임글 수정 | 모임글 삭제 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/88f257c8-4720-4d81-91e0-dc953035eafa" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/0dd96fbf-3576-40b2-bcc7-dd7ccf8d28c3" width="370" height="200"/> |

| 참여 기능 | 댓글 등록 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/cc36ec60-e84c-4af4-9f7c-91cb85699c3d" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/ff6af06f-2e82-4909-93de-946d5230f56c" width="370" height="200"/> |

| 댓글 삭제 | 대댓글 등록 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/1eb14cbc-7adb-4ea7-8404-e7f0185f1213" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/8e56e3f4-f719-4731-a59a-db9b4f3ea6f2" width="370" height="200"/> |

| 후기 등록 | 후기 조회 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/7398a83a-60b1-440f-91d2-f1a239fad495" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/d3f1dd7f-1fae-4b56-b6de-a9039019315b" width="370" height="200"/> |

| 후기 수정 삭제 | 관리자 페이지 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/f0801cec-58ef-437d-b8cd-091d76696f16" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/9c9a63a0-e57e-448a-bc28-76847f324cf6" width="370" height="200"/> |

| 마이페이지 : 나의모임 | 마이페이지 : 나의 글/댓글 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/40b9a0ac-0e36-4456-8975-b57cdff6b4f8" width="370" height="210"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/b0bb509d-9f65-4be3-87ee-ca94558d8487" width="370" height="200"/> |

| 마이페이지 : 북마크 | 회원 탈퇴 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/7dda3383-2f5b-42f7-9274-031ab859841b" width="370" height="210"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/b1a2c74b-7f78-4d94-a0c9-6d86531b2809" width="370" height="200"/> |

<br>

## 👀 Team list

|**강혜주**|**김수안**|**최준하**|**조은희**|
|:--:|:--:|:--:|:--:|
|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/f316cf92-de9c-472b-80b3-8e98eae90e93" width="150px" height="150px">|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/ae043c41-5b33-4a5c-a7ab-0af2ca31cd06" width="150px" height="150px"> | <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/6c1cc0e2-8455-4044-a71b-4fab234faa9f" width="150px" height="150px"> | <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/e118b13e-d2e7-4e52-81ef-c35bed264eb6" width="150px" height="150px">|
|BE(팀장)|BE|BE|BE|
|[hyezuu](https://github.com/hyezuu)|[sooani](https://github.com/sooani)|[choijh0309](https://github.com/choijh0309)|[eunhee78](https://github.com/eunhee78)|

<br><br>

|**배정현**|**이혜원**|**안민주**|**김윤한**|
|:--:|:--:|:--:|:--:|
|<img src="https://i.namu.wiki/i/dCfctGiBtIhlNvrYVKHez9BMIyUZAwd5-N35oTRXxuZs_KRkDOK9laZuXxcf2IJmlA6kVInSeQ7h5XjGS3MUuc_eAanFwTPQ1OkuuS80kwp8gYrbYIguJMvLqlxYntSMRY2UFlZLuSk8erpT40dfNw.webp" width="150px" height="150px">|<img src="https://i.namu.wiki/i/srbCqpZfNdcLJfOm91Z9BAncS862x9vsQPx0U5l62Y7yBz23iexnelKuZ8916D2NkEtQv5emlPMUGZczv6gZTelexPgnJSSdXbntOUtMUaxQrkpNUnCWv2GwM-FGQm4h76CWIy8i2RJX39Y-cA3qOg.webp" width="150px" height="150px"> |<img src="https://static.wikia.nocookie.net/catchteeniepin/images/5/58/Sandping_render_1.png/revision/latest?cb=20231104013915" width="140px" height="140px"> |<img src="https://github.com/sooani/ssudam/assets/118452650/abd055e3-bcdc-4eec-815e-3188f37da66d" width="150px" height="150px">|
|FE(팀장)|FE|FE|FE|
|[bjh0524](https://github.com/bjh0524)|[hyehye225](https://github.com/hyehye225)|[anminjoo](https://github.com/anminjoo)|[YunHanKIM](https://github.com/YunHanKIM)|

<br><br>

## 🛠 기술 스택
![image](https://github.com/codestates-seb/abc02_002/assets/118452650/60fc2529-6f19-4a69-932a-75c0549433e3)

### 공통
<img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white"><img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">
<img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=Discord&logoColor=white">
<br>
    
### 백엔드
<img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white"><img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white"><img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=Java&logoColor=white"><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=for-the-badge&logo=Gradle&logoColor=white)

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![SpringSecurity](https://img.shields.io/badge/SpringSecurity-6DB33F.svg?style=for-the-badge&logo=SpringSecurity&logoColor=white)

<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white"><img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">

![IntelliJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Windows](https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=macos&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
<br>

### 프론트엔드
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"><img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/Axios-181717?style=for-the-badge&logo=Axios&logoColor=white"><img src="https://img.shields.io/badge/Redux Toolkit-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
<img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">

<br>

## 🧰 백엔드 아키텍처
<img width="575" alt="Untitled" src="https://github.com/codestates-seb/abc02_002/assets/118452650/9f3d09b9-a135-456f-b237-08e392fc254c">

<br><br>



