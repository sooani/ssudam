import Header from "./components/Layout/Header";
import Meeting from "./components/Meeting/Meeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./pages/MakePost";
import MainPage from './pages/MainPage';
import LogIn from "./pages/LogIn";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/meetings/new" element={<MakePost />} />
        <Route path='/login' element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
