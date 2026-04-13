import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardList from "./components/BoardList";
import BoardWrite from "./components/BoardWrite";
import BoardDetail from "./components/BoardDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
