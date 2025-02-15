import React from 'react';
import { useNavigate } from 'react-router-dom';

const SurveyStart = () => {
  const navigate = useNavigate();

  const startSurvey = () => {
    navigate('/survey/q/1'); // Przekierowanie do pierwszego pytania
  };

  return (
    <div>
      <h1>Witaj w naszej ankiecie</h1>
      <button onClick={startSurvey}>Rozpocznij ankietę</button>
    </div>
  );
};

export default SurveyStart;
