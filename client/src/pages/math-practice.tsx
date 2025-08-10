import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, Eye, EyeOff, Check, Lightbulb, TrendingUp } from 'lucide-react';

type Operation = 'addition' | 'subtraction';
type Difficulty = '2digit' | '3digit' | '4digit';

interface ProblemData {
  num1: number;
  num2: number;
  operation: Operation;
  difficulty: Difficulty;
}

export default function MathPractice() {
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('3digit');
  const [problem, setProblem] = useState<ProblemData>({ num1: 0, num2: 0, operation: 'addition', difficulty: '3digit' });
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [carries, setCarries] = useState<number[]>([]);
  const [borrows, setBorrows] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelpers, setShowHelpers] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Progress tracking
  const [progress, setProgress] = useState({
    '2digit': { solved: 0, total: 0 },
    '3digit': { solved: 0, total: 0 },
    '4digit': { solved: 0, total: 0 }
  });

  const getDigitCount = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case '2digit': return 2;
      case '3digit': return 3;
      case '4digit': return 4;
      default: return 3;
    }
  };

  const getMaxAnswer = (): number => {
    const digitCount = getDigitCount(difficulty);
    if (operation === 'addition') {
      return digitCount === 4 ? 5 : 4; // 4-digit addition can result in 5 digits
    }
    return digitCount;
  };

  const generateProblem = () => {
    const digitCount = getDigitCount(difficulty);
    const min = Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    
    let num1, num2;
    
    if (operation === 'addition') {
      // Generate numbers that will likely require regrouping
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      // For subtraction, ensure num1 > num2 for positive results
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (num1 - min + 1)) + min;
    }

    const newProblem = { num1, num2, operation, difficulty };
    setProblem(newProblem);
    
    const maxAnswerDigits = getMaxAnswer();
    setUserAnswer(new Array(maxAnswerDigits).fill(''));
    setShowResult(false);
    
    calculateHelpers(num1, num2, operation);
  };

  const calculateHelpers = (num1: number, num2: number, op: Operation) => {
    const digitCount = getDigitCount(difficulty);
    const newCarries = new Array(digitCount).fill(0);
    const newBorrows = new Array(digitCount).fill(0);
    
    if (op === 'addition') {
      const d1 = getDigitsArray(num1, digitCount);
      const d2 = getDigitsArray(num2, digitCount);
      
      // Calculate carries from right to left
      for (let i = digitCount - 1; i >= 0; i--) {
        const sum = d1[i] + d2[i] + (i < digitCount - 1 ? newCarries[i + 1] : 0);
        if (sum >= 10 && i > 0) {
          newCarries[i] = 1;
        }
      }
    } else {
      const d1 = getDigitsArray(num1, digitCount);
      const d2 = getDigitsArray(num2, digitCount);
      let tempNum1 = [...d1];
      
      // Calculate borrows from right to left
      for (let i = digitCount - 1; i >= 0; i--) {
        if (tempNum1[i] < d2[i]) {
          // Need to borrow
          newBorrows[i] = 1;
          tempNum1[i] += 10;
          if (i > 0) {
            tempNum1[i - 1] -= 1;
          }
        }
      }
    }
    
    setCarries(newCarries);
    setBorrows(newBorrows);
  };

  const getDigitsArray = (num: number, length: number): number[] => {
    const str = num.toString().padStart(length, '0');
    return str.split('').map(Number);
  };

  const getAnswerDigitsArray = (num: number, length: number): number[] => {
    const str = num.toString().padStart(length, '0');
    return str.split('').map(Number);
  };

  useEffect(() => {
    generateProblem();
  }, [operation, difficulty]);

  const handleInputChange = (index: number, value: string) => {
    if (value === '' || /^\d$/.test(value)) {
      const newAnswer = [...userAnswer];
      newAnswer[index] = value;
      setUserAnswer(newAnswer);
      
      // Auto-focus next input
      if (value && index < userAnswer.length - 1) {
        const nextInput = document.getElementById(`digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer.join('')) || 0;
    const correctAnswer = operation === 'addition' 
      ? problem.num1 + problem.num2 
      : problem.num1 - problem.num2;
    
    const correct = answer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    // Update progress
    setProgress(prev => ({
      ...prev,
      [difficulty]: {
        solved: correct ? prev[difficulty].solved + 1 : prev[difficulty].solved,
        total: prev[difficulty].total + 1
      }
    }));
    
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const hasAnswer = userAnswer.some(digit => digit !== '');
  const correctAnswer = operation === 'addition' 
    ? problem.num1 + problem.num2 
    : problem.num1 - problem.num2;

  const digitCount = getDigitCount(difficulty);
  const maxAnswerDigits = getMaxAnswer();
  const num1Digits = getDigitsArray(problem.num1, digitCount);
  const num2Digits = getDigitsArray(problem.num2, digitCount);
  const correctDigits = getAnswerDigitsArray(correctAnswer, maxAnswerDigits);

  const getProgressPercentage = (diff: Difficulty) => {
    const p = progress[diff];
    return p.total > 0 ? Math.round((p.solved / p.total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Math Practice Pro</h1>
          <p className="text-lg text-gray-600">Master Addition & Subtraction with Regrouping</p>
        </div>

        {/* Main Practice Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          
          {/* Controls Section */}
          <div className="mb-8 space-y-6">
            {/* Operation Toggle */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Operation</label>
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setOperation('addition')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    operation === 'addition'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Addition
                </button>
                <button
                  onClick={() => setOperation('subtraction')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    operation === 'subtraction'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Subtraction
                </button>
              </div>
            </div>

            {/* Difficulty Toggle */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Difficulty</label>
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                {(['2digit', '3digit', '4digit'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      difficulty === diff
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase()}-Digit
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">{score}/{attempts}</div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-purple-600">
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-lg text-green-600">{streak}</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
            </div>
          </div>

          {/* Math Problem Display */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Solve the Problem</h3>
              <button
                onClick={() => setShowHelpers(!showHelpers)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                {showHelpers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showHelpers ? 'Hide' : 'Show'} helps</span>
              </button>
            </div>

            {/* Problem Container with Proper Alignment */}
            <div className="bg-gray-50 rounded-xl p-6 font-mono">
              {/* Helpers Row (conditional) */}
              {showHelpers && (
                <div className="flex justify-end mb-2 h-6">
                  <div className={maxAnswerDigits === 5 ? 'math-grid-5' : 'math-grid'}>
                    {(maxAnswerDigits === 5 ? new Array(5) : new Array(4)).fill(0).map((_, index) => (
                      <div key={index} className="carry-indicator">
                        {operation === 'addition' 
                          ? (carries[index] > 0 ? carries[index] : '')
                          : (borrows[index] > 0 ? borrows[index] : '')
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* First Number */}
              <div className="flex justify-end mb-2">
                <div className={maxAnswerDigits === 5 ? 'math-grid-5' : 'math-grid'}>
                  {maxAnswerDigits === 5 && <div className="math-cell text-gray-800"></div>}
                  {num1Digits.map((digit, index) => (
                    <div key={index} className="math-cell text-gray-800">{digit}</div>
                  ))}
                </div>
              </div>

              {/* Operation Sign + Second Number */}
              <div className="flex justify-end mb-2">
                <div className={maxAnswerDigits === 5 ? 'math-grid-5' : 'math-grid'}>
                  <div className="math-cell text-purple-600">
                    {operation === 'addition' ? '+' : '−'}
                  </div>
                  {num2Digits.map((digit, index) => (
                    <div key={index} className="math-cell text-gray-800">{digit}</div>
                  ))}
                </div>
              </div>

              {/* Horizontal Line */}
              <div className="flex justify-end mb-4">
                <div className={maxAnswerDigits === 5 ? 'w-80' : 'w-64'}>
                  <div className="border-t-3 border-gray-800"></div>
                </div>
              </div>

              {/* Answer Input Row */}
              <div className="flex justify-end">
                <div className={maxAnswerDigits === 5 ? 'math-grid-5' : 'math-grid'}>
                  {userAnswer.map((digit, index) => {
                    const isFirstDigit = index === 0;
                    const shouldDisable = isFirstDigit && correctAnswer < Math.pow(10, maxAnswerDigits - 1);
                    
                    return (
                      <input
                        key={index}
                        id={`digit-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`math-input ${
                          showResult
                            ? digit === correctDigits[index].toString()
                              ? 'correct'
                              : 'incorrect'
                            : ''
                        } ${shouldDisable ? 'opacity-30' : ''}`}
                        disabled={showResult || shouldDisable}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mb-6">
              <div className={`flex items-center gap-3 p-4 border rounded-xl mb-4 ${
                isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`p-2 rounded-lg ${
                  isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? 'Excellent work! 🎉' : 'Not quite right'}
                  </div>
                  <div className={`text-sm ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCorrect 
                      ? 'You solved this problem correctly!'
                      : `The correct answer is ${correctAnswer}`
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            {!showResult && hasAnswer && (
              <button
                onClick={checkAnswer}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Check Answer
              </button>
            )}
            
            <button
              onClick={generateProblem}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New Problem
            </button>
          </div>

          {/* Educational Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold text-yellow-800 mb-2">💡 Learning Tips</div>
                <div className="text-sm text-yellow-700 space-y-1">
                  {operation === 'addition' ? (
                    <>
                      <p><strong>Addition with Regrouping:</strong></p>
                      <p>• Start from the rightmost column (ones place)</p>
                      <p>• If the sum is 10 or more, write the ones digit and carry the tens digit to the next column</p>
                      <p>• Continue this process for each column, remembering to add any carried numbers</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Subtraction with Borrowing:</strong></p>
                      <p>• Start from the rightmost column (ones place)</p>
                      <p>• If the top digit is smaller than the bottom digit, borrow 10 from the next column</p>
                      <p>• Reduce the next column by 1 and add 10 to the current column</p>
                      <p>• Continue this process as needed for each column</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Your Progress
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Problems */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-600 font-medium">Problems Solved</div>
            </div>
            
            {/* Best Streak */}
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{bestStreak}</div>
              <div className="text-sm text-green-600 font-medium">Best Streak</div>
            </div>
            
            {/* Current Accuracy */}
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
              </div>
              <div className="text-sm text-purple-600 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Difficulty Progress Bars */}
          <div className="space-y-3">
            {(['2digit', '3digit', '4digit'] as Difficulty[]).map((diff) => {
              const percentage = getProgressPercentage(diff);
              const colorClass = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
              
              return (
                <div key={diff}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {diff.charAt(0).toUpperCase()}-Digit Mastery
                    </span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colorClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
