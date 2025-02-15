import { Routes, Route } from 'react-router-dom';
import SurveyStart from './Pages/SurveyStart';
import SurveyPage from './Pages/SurveyPage';
import Results from './Pages/Results';
import './App.css';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<SurveyStart />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/survey/q/:id/*" element={<SurveyPage />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;