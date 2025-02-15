import { Routes, Route, useLocation } from 'react-router-dom';
import SurveyStart from './Pages/SurveyStart';
import SurveyPage from './Pages/SurveyPage';
import Results from './Pages/Results';
import './App.css';

function App() {
  const location = useLocation();
  const isResultsPage = location.pathname === "/results";

  return (
    <div className={isResultsPage ? "app-container results-page" : "app-container"}>
      <Routes>
        <Route path="/" element={<SurveyStart />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/survey/q/:id/*" element={<SurveyPage />} />
        <Route path="/results" element={<Results />} />
      </Routes>

      {/* Footer is always displayed, but styled differently for results page */}
      <footer className={isResultsPage ? "footer results-footer" : "footer"}>
        © {new Date().getFullYear()} Wiktoria Solska. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
