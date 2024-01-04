import Header from "./components/Layout/Header";
import Meeting from "./components/Meeting/Meeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./pages/MakePost";
import LeaveModal from "./pages/LeaveModal";//이거삭제

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/meetings/new" element={<MakePost />} />
      </Routes>
      <LeaveModal />
    </BrowserRouter>
  );
}

export default App;
