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