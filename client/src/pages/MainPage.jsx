import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import classes from '../styles/pages/MainPage.module.css';
import banner from '../images/banner.png';
import TodoList from '../components/MainPage/TodoList';
import ListSlider from '../components/MainPage/ListSlider';

/*
    헤더는 컴포넌트로 불러온다.
    배너 구역에 이미지 삽입
    투두 리스트 출력 화면을 왼쪽에 표시 그 옆에 새로운 모임 슬라이드 형태로 출력
    모임중, 모집 완료 탭이 보이고 탭에 따른 게시글 출력
    게시글은 페이지네이션 처리
*/

const MainPage = () => {
  return (
    <div className={classes.test}>
      {/* 헤더 */}
      <Header />

      {/* 배너 이미지 출력 */}
      <div className={classes.banner}>
        <img
          className={classes.bannerImage}
          alt="배너 이미지 구역"
          src={banner}
        />
      </div>

      {/* 투두 리스트와 새로운 모임 출력하는 섹션 */}
      <section className={classes.todoListAndNewSection}>
        <TodoList />
        <ListSlider />
      </section>

      {/* 메인 페이지 */}
      <div className={classes.main}></div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};
export default MainPage;
