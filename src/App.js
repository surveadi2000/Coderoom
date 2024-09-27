// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MentorDashboard from './components/MentorDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/student/aman" element={<StudentDashboard studentName="Aman" />} />
          <Route path="/student/harshit" element={<StudentDashboard studentName="Harshit" />} />
          <Route path="/student/aditya" element={<StudentDashboard studentName="Aditya" />} />
          <Route path="/student/sachin" element={<StudentDashboard studentName="Sachin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
