import React, { useState, useEffect } from 'react';
import '../SurveyStyles.css';

const SurveyQuestion = ({ question, questionId, setAnswer, handleNextQuestion }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [sliderValue, setSliderValue] = useState(question.min);
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(true);
  const [additionalInput, setAdditionalInput] = useState('');

  useEffect(() => {
    setTextAnswer('');
    setSelectedAnswers([]);
    setSliderValue(question.min);
    setAdditionalInput('');
    setIsNextBtnDisabled(true);
  }, [questionId]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedAnswers = e.target.checked
      ? [...selectedAnswers, value]
      : selectedAnswers.filter((answer) => answer !== value);

    setSelectedAnswers(updatedAnswers);

    setIsNextBtnDisabled(updatedAnswers.length === 0);
  };

  const handleAdditionalInputChange = (e) => {
    setAdditionalInput(e.target.value);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextAnswer(value);
    setIsNextBtnDisabled(value.trim().length === 0);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    setIsNextBtnDisabled(false);
  };

  const handleNext = () => {
    let finalAnswer = question.type === 'text' ? textAnswer : question.type === 'slider' ? sliderValue : selectedAnswers;

    if (selectedAnswers.some(option => ["Other", "Yes"].includes(option)) && additionalInput.trim()) {
      finalAnswer = [...selectedAnswers, `Additional Info: ${additionalInput.trim()}`];
    }

    setAnswer(finalAnswer, questionId);
    handleNextQuestion(questionId);
  };

  return (
    <div className="survey-question-container">
      <h2 className="question-text">{question.question}</h2>

      {question.type === 'radio' && (
        <>
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

          {selectedAnswers.some(option => ["Other", "Yes"].includes(option)) && (
            <input
              type="text"
              className="text-input"
              placeholder="Provide more details..."
              value={additionalInput}
              onChange={handleAdditionalInputChange}
            />
          )}
        </>
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
            min={question.min}
            max={question.max}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          <div className="slider-visualization">
            <span className="slider-value">{sliderValue} {question.unit}</span>
          </div>
        </div>
      )}

      <button 
        className="next-btn tooltip" 
        onClick={handleNext} 
        disabled={isNextBtnDisabled}
      >
        Next question
        {isNextBtnDisabled && <span className="tooltip-text">Please answer the question to continue</span>}
      </button>
    </div>
  );
};

export default SurveyQuestion;
