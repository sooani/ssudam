import Header from "./components/Layout/Header";
import Meeting from "./components/Meeting/Meeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./pages/MakePost";
//테스트용 주석입니다 안민주안민주 지워도됩니다.
//테스트용 주석입니다 2 한번더 커밋&푸시 지워도됩니다.


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/meetings/new" element={<MakePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
