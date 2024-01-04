import Header from "./components/Layout/Header";
import Meeting from "./components/Meeting/Meeting";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MakePost from "./components/Meeting/MakePost";
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
