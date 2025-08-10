
import React, { useState } from 'react'
import { Router, Route, Switch } from 'wouter'
import MathPractice from './pages/math-practice.jsx'
import NotFound from './pages/not-found.jsx'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Switch>
          <Route path="/" component={MathPractice} />
          <Route path="/practice" component={MathPractice} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </div>
  )
}

export default App
