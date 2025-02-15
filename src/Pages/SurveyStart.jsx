import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30, // Moves content up when appearing
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }, // Smooth animation
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const SurveyStart = () => {
  const navigate = useNavigate();

  const startSurvey = () => {
    navigate("/survey/q/1"); // Redirect to first question
  };

  return (
    <motion.div
      className="survey-start-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="survey-content">
        <h1>
          Welcome to Our <span>Personal Training Plan Generator</span>
        </h1>
        <p>
          Powered by <strong style={{ color: "rgb(71, 96, 185)" }}>Gemini AI 🤖</strong>
        </p>
        <motion.button
          className="start-btn"
          onClick={startSurvey}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Survey
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SurveyStart;
