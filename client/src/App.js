import Header from "./components/Layout/Header";
import Meeting from "./components/Meeting/Meeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./pages/MakePost";
import MainPage from './pages/MainPage';
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meetings/new" element={<MakePost />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/edit-profile' element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
