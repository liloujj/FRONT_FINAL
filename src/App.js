import {  useSelector } from "react-redux";


import logo from './logo.svg';

import './App.css';

import Login from './containers/Login/Login';
import Signup from "./containers/Login/SignUp";
import ActivateAcount from "./containers/Login/ActivateAcount";
import { useState } from "react";
import BaseApp from "./components/BaseApp/BaseApp";
import {Notification} from "./containers/Notification/Notification";
import { Toaster } from "react-hot-toast";

function App() {
  const {mode,isAuthenticated,} = useSelector((state) => state.login)

  return (
    <div className="App">
      {isAuthenticated && <BaseApp otherActionButtons={[<Notification/>]}/>}
      {(!isAuthenticated && mode == "login") && <Login/>}
      {(!isAuthenticated && mode == "signup") && <Signup/>}
      <Toaster position="botton-left" />
    </div>
  );
}

export default App;
