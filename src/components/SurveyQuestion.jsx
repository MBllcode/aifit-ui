import React, { useState, useEffect } from 'react';
import '../SurveyStyles.css'; // Import the new CSS styles

const SurveyQuestion = ({ question, questionId, setAnswer, handleNextQuestion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);  // For checkbox answers
  const [textAnswer, setTextAnswer] = useState('');  // For text input
  const [sliderValue, setSliderValue] = useState(question.min); // For slider input
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(true);

  useEffect(() => {
    // Reset text input when the question changes
    setTextAnswer('');
    setSelectedAnswers([]);
    setSliderValue(question.min);
    setIsNextBtnDisabled(true);
  }, [questionId]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedAnswers;

    if (e.target.checked) {
      updatedAnswers = [...selectedAnswers, value];
    } else {
      updatedAnswers = selectedAnswers.filter((answer) => answer !== value);
    }

    setSelectedAnswers(updatedAnswers);
    setIsNextBtnDisabled(updatedAnswers.length === 0);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextAnswer(value);
    setIsNextBtnDisabled(value.trim().length === 0); // Disable if text input is empty
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    setIsNextBtnDisabled(false);
  };

  const handleNext = () => {
    setAnswer(question.type === 'text' ? textAnswer : question.type === 'slider' ? sliderValue : selectedAnswers, questionId);
    handleNextQuestion(questionId);
  };

  return (
    <div className="survey-question-container">
      <h2 className="question-text">{question.question}</h2>
      {question.type === 'radio' && (
        <ul className="options-list">
          {question.options.map((option, index) => (
            <li key={index} className="option-item">
              <input
                type="checkbox"
                className="checkbox-input"
                name={question.id}
                value={option}
                checked={selectedAnswers.includes(option)}
                onChange={handleCheckboxChange}
              />
              <span className="option-text">{option}</span>
            </li>
          ))}
        </ul>
      )}
      {question.type === 'text' && (
        <input 
          type="text" 
          className="text-input" 
          value={textAnswer}  
          onChange={handleTextChange}  
        />
      )}
      {question.type === 'slider' && (
        <div className="slider-container">
          <input
            type="range"
            className="slider-input"
            min={12}
            max={50}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <span className="slider-value">{sliderValue} {question.unit}</span>
        </div>
      )}
      <button className="next-btn" onClick={handleNext} disabled={isNextBtnDisabled}>
        Next question
      </button>
    </div>
  );
};

export default SurveyQuestion;
