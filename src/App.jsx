import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = "/api/Uw5CrX"; // Replace with your API endpoint
        const response = await axios.get(API_URL);
        setQuizData(response.data.questions);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnswerSelection = (option) => {
    setSelectedOption(option);
    const correct = option.is_correct; // Check the `is_correct` field
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black dark:text-white shadow-md"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className={`w-full max-w-2xl p-6 shadow-lg rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {quizCompleted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl mt-4">
              Your Score: {score} / {quizData.length}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-lg mb-6">
              {quizData[currentQuestion].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300
                    ${
                      selectedOption === option
                        ? isCorrect
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }
                    ${selectedOption && selectedOption !== option ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => selectedOption ? null : handleAnswerSelection(option)}
                  disabled={selectedOption}
                >
                  {option.description}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className="mt-6 w-full p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {currentQuestion + 1 === quizData.length ? "Finish Quiz" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;