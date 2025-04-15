import {  useSelector } from "react-redux";


import logo from './logo.svg';

import './App.css';

import Login from './containers/Login/Login';
import Signup from "./containers/Login/SignUp";
import { useState } from "react";
import BaseApp from "./components/BaseApp/BaseApp";

function App() {
  const {mode,isAuthenticated,} = useSelector((state) => state.login)

  return (
    <div className="App">
      {isAuthenticated && <BaseApp/>}
      {(!isAuthenticated && mode == "login") && <Login/>}
      {(!isAuthenticated && mode == "signup") && <Signup/>}

    </div>
  );
}

export default App;
