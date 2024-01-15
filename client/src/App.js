import Header from "./components/Layout/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./pages/MakePost";
import MainPage from "./pages/MainPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import EditProfile from "./pages/EditProfile";
import EditPost from "./pages/EditPost";
import DetailPost from "./pages/DetailPost";
import SignUpModal from "./pages/SignUpModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meetings/new" element={<MakePost />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/meetings/:meetingId/edit" element={<EditPost />} />
        <Route path="/meetings/:meetingId" element={<DetailPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
