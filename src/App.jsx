import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.example.com/data')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          if (error.response) {
            // The server responded with a status code outside the 2xx range
            console.log('Error response:', error.response);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Error request:', error.request);
          } else {
            // Something happened in setting up the request that triggered an error
            console.log('Error message:', error.message);
          }
        });
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const handleAnswer = (answer) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Error loading quiz: {error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full sm:w-2/3 md:w-1/2 lg:w-1/3 p-8">
        {!showResults ? (
          <>
            <div className="text-center text-white mb-6">
              <h1 className="text-4xl font-bold">Quiz Time</h1>
              <p className="text-lg">Answer the following questions:</p>
            </div>
            <div className="text-white mb-6">
              <h2 className="text-2xl mb-4">{questions[currentQuestionIndex].question}</h2>
              <div className="space-y-4">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handleAnswer(answer)}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg mb-6">Your Results:</p>
            <div className="space-y-4">
              {userAnswers.map((answer, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-lg">{`Q${index + 1}: ${answer}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
