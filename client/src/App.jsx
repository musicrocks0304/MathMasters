
import { Router, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import MathPractice from "@/pages/math-practice";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={MathPractice} />
          <Route path="/practice" component={MathPractice} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
