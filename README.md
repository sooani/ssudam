<p align="center">
  <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/ee677d7e-7f19-499e-a74d-9dc2ad0263a5">
</p>
<h3 align='center'> 쓰담(SSUDAM)은 쓰레기 담기의 줄인말로 
<br>
  함께 플로깅을 할 사람을 모집하는 플로깅 커뮤니티 사이트입니다. </h3>
<p align="center">  
  <em> * 플로깅(Plogging)은 '줍다'라는 뜻의 스웨덴어 플로카 업(plocka upp)과</em>
<br>
  <em>'달리다'라는 뜻의 영어 조깅(Jogging)을 합성한 단어로,</em>
<br>
  <em>쓰레기를 주우며 조깅하는 행동을 의미합니다</em>
<br>
</p>

## 🚩 개요
- 프로젝트 이름 : 쓰담 (SSUDAM)
- 프로젝트 기간 : 2023.12.22 ~ 2024.01.23
- 배포주소 : ~~*[쓰담 메인✨](https://github.com/codestates-seb/abc02_002)*~~
- 백엔드 서비스 메뉴얼 : [백엔드 서비스 메뉴얼 ✨](https://gregarious-diagram-be0.notion.site/SSUDAM-a654f4266fcf4111b404737bf1ff1b31?pvs=4)

<br>

### 🤷‍♀️ 기획 의도
- 코로나로 인한 비대면 상황을 거친 후 줄어든 사람들 간의 소통
- 점점 더 악화되는 환경 문제에 이바지하기 위함
- 운동은 하고싶은데 동기가 부족하거나, 작게나마 뿌듯함을 느끼고 싶은 분들, 지역 주민들과 함께 참여하고 건강 증진을 위한 운동 기회를 제공하기 위함

### 💡 목표 및 기대효과
- 사회적으로 소통하며 활동량을 높인다.
- 환경보호와 건강을 동시에 고려하는 활동으로 사용자들에게 지속 가능한 라이프 스타일의 중요성을 일깨운다.
- 사용자들은 쓰레기 수거와 운동의 조합으로 건강한 라이프스타일을 즐기며 만족감을 느낄 수 있다.

<br>

## 🦾 프로젝트 진행 과정
1. `Restful Api`를 활용한 모임글 CRUD 기능 구현
2. `Spring Rest Docs`를 이용한 API 문서 작성
3. `AWS(EC2,RDS-MySQL)` 배포환경 구축 및 배포
4. 프론트엔드와 서버 테스트 2회 진행
5. `Apache Jmeter`를 활용한 성능 테스트

<br>
   
## 🧩 담당 역할

<details>
<summary>
Restful Api를 활용한 모임글 CRUD 기능 구현
</summary>
  
 - `Party` 도메인 작성
 - 모임글 참여/취소
 - `Scheduler`를 활용한 모집상태 변경
 - 최신 모임글 조회
 - 제목과 내용 키워드 검색
    
</details>

<details>
<summary>
Spring Rest Docs를 이용한 API 문서 작성
</summary>
  
 - `PartyController` 클래스의 test case 구현
 - 슬라이스 테스트에 Mockito 적용
 - 테스트 실행 후 성공하는 경우 문서스니펫을 생성하여 자동으로 API문서를 구축
    
  </details>

<details>
<summary>
AWS(EC2,RDS-MySQL) 배포환경 구축 및 배포
</summary>
  
 - `RDS`와 `MySQL`연동을 통한 안정적인 데이터베이스 저장환경 구성
 - AWS의 배포환경과 EC2를 사용하여 서버 배포
 - `Swap Memory` 적용을 통한 EC2 메모리 부족 해결
    
  </details>

<details>
<summary>
Apache Jmeter를 활용한 성능 테스트
</summary>
  
 - `Jmeter` 를 사용해 서버 부하테스트 진행 후 안전성 확인
 - `Gnuplot`을 사용해서 결과파일과 그래프이미지 생성
 - Apache Benchmarking tool을 활용한 성능 테스트
    
  </details>

<br>

## 🖥 Pages Preview
<details>
<summary>
🎯 자세히 보기
</summary>
  
| 메인 : 모임 검색 | 최신 모임글 조회 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/99bb458d-5676-4d2d-be5c-09d3cf7f61c0" width="370" height="200"/> | <img src="https://github.com/YunHanKIM/-codestates_ABC-Lab_final/assets/88180966/9f7c4337-06ed-43f2-b7fe-4520764e75d8" width="370" height="200"/> |

| 모임글 등록 | 모임 참여/참여 취소 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/03daf867-43ad-4d3d-97b7-1939f8d779dd" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/cc36ec60-e84c-4af4-9f7c-91cb85699c3d" width="370" height="200"/> |

| 모임글 수정 | 모임글 삭제 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/88f257c8-4720-4d81-91e0-dc953035eafa" width="370" height="200"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/0dd96fbf-3576-40b2-bcc7-dd7ccf8d28c3" width="370" height="200"/> |

| 모집 상태 변경 | 모집중인 모임글 조회 |
| :---: | :---: |
| <img src="https://github.com/sooani/ssudam/assets/118452650/991b0850-ef0b-4ca2-9fd8-da94b11adcf0" width="370" height="200"/> | <img src="https://github.com/sooani/ssudam/assets/118452650/95f8fb26-03da-4d74-a987-2ad561abc9a8" width="370" height="200"/> |

| 내가 참여한 모임글 조회 | 내가 작성한 모임글 조회 |
| :---: | :---: |
| <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/40b9a0ac-0e36-4456-8975-b57cdff6b4f8" width="370" height="210"/> | <img src="https://github.com/codestates-seb/abc02_002/assets/147456219/b0bb509d-9f65-4be3-87ee-ca94558d8487" width="370" height="200"/> |
</details>
<br>

-----

<br>

## 👀 Team list

|**강혜주**|**김수안**|**최준하**|**조은희**|
|:--:|:--:|:--:|:--:|
|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/f316cf92-de9c-472b-80b3-8e98eae90e93" width="150px" height="150px">|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/ae043c41-5b33-4a5c-a7ab-0af2ca31cd06" width="150px" height="150px"> | <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/6c1cc0e2-8455-4044-a71b-4fab234faa9f" width="150px" height="150px"> | <img src="https://github.com/codestates-seb/abc02_002/assets/118452650/e118b13e-d2e7-4e52-81ef-c35bed264eb6" width="150px" height="150px">|
|BE(팀장)|BE|BE|BE|
|[hyezuu](https://github.com/hyezuu)|[sooani](https://github.com/sooani)|[choijh0309](https://github.com/choijh0309)|[eunhee78](https://github.com/eunhee78)|

<br>

|**배정현**|**이혜원**|**안민주**|**김윤한**|
|:--:|:--:|:--:|:--:|
|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/378c3d41-d1c9-47f2-98e6-9962c9776f0d" width="150px" height="150px">|<img src="https://github.com/codestates-seb/abc02_002/assets/118452650/f1eb2e43-2565-4da2-ae1c-182852581ea4" width="150px" height="150px"> |<img src="https://static.wikia.nocookie.net/catchteeniepin/images/5/58/Sandping_render_1.png/revision/latest?cb=20231104013915" width="140px" height="140px"> |<img src="https://github.com/sooani/ssudam/assets/118452650/abd055e3-bcdc-4eec-815e-3188f37da66d" width="150px" height="150px">|
|FE(팀장)|FE|FE|FE|
|[bjh0524](https://github.com/bjh0524)|[hyehye225](https://github.com/hyehye225)|[anminjoo](https://github.com/anminjoo)|[YunHanKIM](https://github.com/YunHanKIM)|

<br>

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

## 🎠 회고
[회고 블로깅💗](https://sooweio.tistory.com/110)

- 테스트 케이스 작성과 API 문서 자동화에 성공했습니다.
- EC2 메모리 부족을 Swap 메모리 적용을 통해 개선했습니다.
- Apache Benchmark 툴을 이용한 성능테스트를 통해 성능향상을 확인하고 개선했습니다.
- 수강 기간동안 배운 기본 지식을 활용하여 간결하고 가독성 있는 코드를 구현했습니다.

### 🍭 개선방향
1. 비즈니스 로직에 대한 단위 테스트 작성
2. API 문서에 Spring Security를 통한 JWT 부분을 추가
3. Spring MVC의 캐싱기능이나 JPA의 2차캐시를 활용해서 성능 보완
4. QueryDSL과 검색엔진을 적용해서 효과적으로 데이터 검색 진행
5. Java record를 이용해 간단한 매핑으로 불변 객체 구현
6. 도메인 위주의 비즈니스 로직 구현

<br>
