import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MathPractice() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [problemsAttempted, setProblemsAttempted] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState(2); // Number of digits

  const generateProblem = () => {
    const operation = Math.random() > 0.5 ? 'addition' : 'subtraction';
    const max = Math.pow(10, difficulty) - 1;
    const min = Math.pow(10, difficulty - 1);
    
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // For subtraction, ensure num1 >= num2 to avoid negative results
    if (operation === 'subtraction' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }
    
    const answer = operation === 'addition' ? num1 + num2 : num1 - num2;
    
    return {
      num1,
      num2,
      operation,
      answer
    };
  };

  const handleSubmit = () => {
    if (!currentProblem || userAnswer === '') return;
    
    const correct = parseInt(userAnswer) === currentProblem.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    setProblemsAttempted(problemsAttempted + 1);
  };

  const nextProblem = () => {
    setCurrentProblem(generateProblem());
    setUserAnswer('');
    setShowResult(false);
  };

  useEffect(() => {
    setCurrentProblem(generateProblem());
  }, [difficulty]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextProblem();
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Math Practice Pro
          </h1>
          <p className="text-gray-600">
            Master addition and subtraction with regrouping
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Settings & Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Difficulty (Number of Digits)
                </label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={2}>2 Digits</option>
                  <option value={3}>3 Digits</option>
                  <option value={4}>4 Digits</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-bold text-green-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Problems Attempted:</span>
                  <span className="font-bold">{problemsAttempted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold text-blue-600">
                    {problemsAttempted > 0 ? Math.round((score / problemsAttempted) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Problem</CardTitle>
            </CardHeader>
            <CardContent>
              {currentProblem && (
                <div className="text-center space-y-6">
                  <div className="text-6xl font-mono bg-gray-50 p-6 rounded-lg">
                    <div className="text-right">
                      {currentProblem.num1.toLocaleString()}
                    </div>
                    <div className="text-right">
                      {currentProblem.operation === 'addition' ? '+' : '-'} {currentProblem.num2.toLocaleString()}
                    </div>
                    <div className="border-t-4 border-gray-800 my-2"></div>
                    <div className="text-right">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={showResult}
                        className="bg-transparent border-none outline-none text-right w-full"
                        placeholder="Your answer"
                        autoFocus
                      />
                    </div>
                  </div>

                  {showResult && (
                    <div className={`flex items-center justify-center gap-2 text-lg font-semibold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Correct! Well done!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6" />
                          Incorrect. The answer is {currentProblem.answer.toLocaleString()}
                        </>
                      )}
                    </div>
                  )}

                  <div className="space-x-4">
                    {!showResult ? (
                      <Button onClick={handleSubmit} disabled={userAnswer === ''}>
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={nextProblem} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Next Problem
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MathPractice;
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MathPractice() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [difficulty, setDifficulty] = useState(2); // 2, 3, or 4 digits
  const [operation, setOperation] = useState('addition');
  const [showHint, setShowHint] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const generateProblem = () => {
    const maxNum = Math.pow(10, difficulty) - 1;
    const minNum = Math.pow(10, difficulty - 1);
    
    let num1, num2;
    
    if (operation === 'addition') {
      num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    } else {
      // For subtraction, ensure num1 > num2 for positive results
      num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      num2 = Math.floor(Math.random() * (num1 - minNum + 1)) + minNum;
    }

    const answer = operation === 'addition' ? num1 + num2 : num1 - num2;
    const answerDigits = answer.toString().split('').map(d => parseInt(d));
    
    setCurrentProblem({ num1, num2, answer, answerDigits });
    setUserAnswers(new Array(answerDigits.length).fill(''));
    setShowHint(false);
    setIsRetrying(false);
    setFeedback([]);
  };

  useEffect(() => {
    generateProblem();
  }, [difficulty, operation]);

  const handleAnswerChange = (index, value) => {
    if (value === '' || /^\d$/.test(value)) {
      const newAnswers = [...userAnswers];
      newAnswers[index] = value;
      setUserAnswers(newAnswers);
    }
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(userAnswers.join('')) || 0;
    const isCorrect = userAnswer === currentProblem.answer;
    
    const newFeedback = userAnswers.map((digit, index) => 
      digit === currentProblem.answerDigits[index].toString() ? 'correct' : 'incorrect'
    );
    setFeedback(newFeedback);

    if (isCorrect) {
      if (!isRetrying) {
        setScore(score + 1);
      }
      setTotalProblems(totalProblems + 1);
      setTimeout(() => generateProblem(), 1500);
    } else {
      setShowHint(true);
      if (!isRetrying) {
        setTotalProblems(totalProblems + 1);
      }
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setShowHint(false);
    setUserAnswers(new Array(currentProblem.answerDigits.length).fill(''));
    setFeedback([]);
  };

  const formatNumber = (num) => {
    return num.toString().padStart(difficulty + 1, ' ').split('');
  };

  const getHintMessage = () => {
    if (!currentProblem) return '';
    
    if (operation === 'addition') {
      return `Hint: Start from the rightmost column and add ${currentProblem.num1} + ${currentProblem.num2}. Remember to carry over when the sum is 10 or more!`;
    } else {
      return `Hint: Start from the rightmost column and subtract ${currentProblem.num2} from ${currentProblem.num1}. Remember to borrow when needed!`;
    }
  };

  if (!currentProblem) return <div>Loading...</div>;

  const num1Digits = formatNumber(currentProblem.num1);
  const num2Digits = formatNumber(currentProblem.num2);
  const gridCols = Math.max(difficulty + 1, currentProblem.answerDigits.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-purple-700">
              Math Practice Pro
            </CardTitle>
            <div className="text-center text-lg text-gray-600">
              Master {operation} with regrouping!
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-500" />
                <span className="font-semibold">Score: {score}/{totalProblems}</span>
                {totalProblems > 0 && (
                  <span className="text-sm text-gray-500">
                    ({Math.round((score / totalProblems) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Digits:</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="border rounded p-2"
                >
                  <option value={2}>2-digit</option>
                  <option value={3}>3-digit</option>
                  <option value={4}>4-digit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Operation:</label>
                <select 
                  value={operation} 
                  onChange={(e) => setOperation(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="addition">Addition</option>
                  <option value="subtraction">Subtraction</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div 
                  className="grid gap-2 justify-end mb-2"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, 3rem)`
                  }}
                >
                  {num1Digits.map((digit, index) => (
                    <div key={`num1-${index}`} className="math-cell">
                      {digit !== ' ' ? digit : ''}
                    </div>
                  ))}
                </div>

                <div 
                  className="grid gap-2 justify-end mb-2"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, 3rem)`
                  }}
                >
                  <div className="math-cell text-2xl">
                    {operation === 'addition' ? '+' : '-'}
                  </div>
                  {num2Digits.slice(1).map((digit, index) => (
                    <div key={`num2-${index}`} className="math-cell">
                      {digit !== ' ' ? digit : ''}
                    </div>
                  ))}
                </div>

                <div 
                  className="border-t-3 border-black grid gap-2 justify-end pt-2"
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, 3rem)`
                  }}
                >
                  {currentProblem.answerDigits.map((_, index) => (
                    <input
                      key={`answer-${index}`}
                      type="text"
                      maxLength="1"
                      value={userAnswers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className={`math-input ${feedback[index] || ''}`}
                      disabled={feedback.length > 0 && !showHint}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              {!feedback.length && (
                <Button onClick={checkAnswer} className="bg-purple-600 hover:bg-purple-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check Answer
                </Button>
              )}
              
              {showHint && (
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              
              <Button onClick={generateProblem} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                New Problem
              </Button>
            </div>

            {showHint && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">Need a hint?</p>
                <p className="text-blue-700 mt-2">{getHintMessage()}</p>
                <p className="text-sm text-blue-600 mt-2">
                  The correct answer is: {currentProblem.answer}
                </p>
              </div>
            )}

            {feedback.length > 0 && !showHint && (
              <div className="mt-4 text-center">
                {feedback.every(f => f === 'correct') ? (
                  <div className="text-green-600 font-bold text-xl flex items-center justify-center">
                    <CheckCircle className="mr-2" />
                    Excellent! Well done!
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
