import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SurveyQuestion from "../components/SurveyQuestion";
import { questions } from "../data";

const LoadingSpinner = () => {
  return (
    <>
      {/* Inline keyframes definition */}
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    </>
  );
};

const SurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false); // Track loading state
  const questionIndex = parseInt(id, 10) - 1; // zero-based

  const setAnswer = (answer, questionId) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionId - 1] = answer;
      return newAnswers;
    });
  };

  const handleFinishSurvey = async () => {
    try {
      setLoading(true);  // show spinner

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBVs7ETCkQA_bxY98MfAjfXMdqtfAbaO5g",
        {
          contents: [
            {
              parts: [
                {
                  text: `Based on these answers, create a well-structured, professional workout training plan in plain text: ${JSON.stringify(answers)}
                  **Formatting Requirements**:
                  1. **No Asterisks**. Do not use "*" or "**" for bullets or bold text.
                  2. **Headings**: Use a line starting with "#" (or "##", etc.) for each major section. For example:
                     # My Heading
                  3. **Key-Value Pairs**: For important data, format them with a colon on the same line. For instance:
                     Goal: Build Muscle
                  4. **Line-by-Line Output**: Place each item on its own line, separated by newlines. For sub-points or clarifications, you can indent with two spaces or add an extra dash.
                  6. **No MarkDown or HTML**: Avoid code fences or HTML tags. Just plain text lines.
                  Please follow these instructions carefully so the result can be easily parsed by our application. Provide a concise but comprehensive training plan, with headings, bullet points, and key-value lines as requested.`
                }
              ]
            }
          ]
        }
      );

      // Double-check the shape of response. This might differ if the API changes.
      const trainingPlan =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No training plan generated.";

      // Navigate to results page (assuming you have a <Route path="/results" ... /> in your Router)
      navigate("/results", {
        state: { trainingPlan }
      });
    } catch (error) {
      console.error("Error fetching training plan:", error);
      navigate("/results", {
        state: {
          trainingPlan: "Error generating training plan. Please try again."
        }
      });
    }
  };

  const handleNextQuestion = (currentQuestionId) => {
    if (currentQuestionId < questions.length) {
      navigate(`/survey/q/${currentQuestionId + 1}`);
    } else {
      handleFinishSurvey();
    }
  };

  // If loading is true, return the spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {questionIndex >= 0 && questionIndex < questions.length ? (
        <SurveyQuestion
          question={questions[questionIndex]}
          questionId={questionIndex + 1}
          setAnswer={setAnswer}
          handleNextQuestion={handleNextQuestion}
        />
      ) : (
        <p>Question not found.</p>
      )}
    </div>
  );
};

export default SurveyPage;

const styles = {
  spinnerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px"
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};
