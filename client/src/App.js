// import Header from './components/Layout/Header';
// import Meeting from './components/Meeting/Meeting';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MakePost from './pages/MakePost';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meetings/new" element={<MakePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
