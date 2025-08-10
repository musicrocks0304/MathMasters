
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

function MathPractice() {
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [totalProblems, setTotalProblems] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const { toast } = useToast()

  const generateProblem = () => {
    const operations = ['+', '-']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1, num2, answer
    
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 999) + 10 // 10-999
      num2 = Math.floor(Math.random() * 999) + 10 // 10-999
      answer = num1 + num2
    } else {
      num1 = Math.floor(Math.random() * 999) + 100 // 100-999
      num2 = Math.floor(Math.random() * (num1 - 10)) + 10 // ensure positive result
      answer = num1 - num2
    }

    setProblem({
      num1,
      num2,
      operation,
      answer
    })
    setUserAnswer('')
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!problem || userAnswer === '') return

    const userNum = parseInt(userAnswer)
    const correct = userNum === problem.answer
    
    setIsCorrect(correct)
    setShowResult(true)
    setTotalProblems(prev => prev + 1)
    
    if (correct) {
      setScore(prev => prev + 1)
      toast({
        title: "Correct! 🎉",
        description: "Great job! Keep practicing.",
      })
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is ${problem.answer}. Try again!`,
        variant: "destructive"
      })
    }
  }

  const nextProblem = () => {
    generateProblem()
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showResult) {
        nextProblem()
      } else {
        checkAnswer()
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Math Practice Pro
        </h1>
        <p className="text-lg text-muted-foreground">
          Master addition and subtraction with regrouping
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Score: {score} out of {totalProblems} problems
              {totalProblems > 0 && (
                <span className="ml-2">
                  ({Math.round((score / totalProblems) * 100)}% correct)
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {problem && (
          <Card>
            <CardHeader>
              <CardTitle>Solve this problem:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold space-y-2">
                  <div>{problem.num1.toLocaleString()}</div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl">{problem.operation}</span>
                    <span>{problem.num2.toLocaleString()}</span>
                  </div>
                  <div className="border-t-4 border-primary pt-2">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-center bg-transparent border-none outline-none w-full"
                      placeholder="?"
                      disabled={showResult}
                    />
                  </div>
                </div>
              </div>

              {showResult && (
                <div className={`text-center p-4 rounded-lg ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="text-lg font-semibold">
                    {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                  </div>
                  <div className="text-sm mt-1">
                    The answer is {problem.answer}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {!showResult ? (
                  <Button 
                    onClick={checkAnswer} 
                    disabled={!userAnswer}
                    size="lg"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextProblem} size="lg">
                    Next Problem
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MathPractice
