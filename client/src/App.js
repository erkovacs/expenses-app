import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ExpenseList from "./components/ExpenseList";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/expenses" component={ExpenseList} />
      </Switch>
    </Router>
  );
}

export default App;
