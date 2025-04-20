import {  useSelector } from "react-redux";


import logo from './logo.svg';

import './App.css';

import Login from './containers/Login/Login';
import Signup from "./containers/Login/SignUp";
import ActivateAcount from "./containers/Login/ActivateAcount";
import ForgetPassword from "./containers/Login/ForgetPassword";
import ResetPassword from "./containers/Login/ResetPassword";
import BaseApp from "./components/BaseApp/BaseApp";
import {Notification} from "./containers/Notification/Notification";
import { Toaster } from "react-hot-toast";
import {
    BrowserRouter, Route, Routes,Redirect,
    useNavigate,Navigate
} from "react-router-dom";

function NotFound()
{
  const navigate = useNavigate()

  return(
    navigate("/login")
  )
}

function App() {
  const {mode,isAuthenticated,} = useSelector((state) => state.login)

  return (

    <div className="App">
      {!isAuthenticated &&
      <BrowserRouter>
        <Routes>
          <Route path="/activate-account/:token" Component={ActivateAcount} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="/forget-password" Component={ForgetPassword} />
          <Route path="/reset-passwrod/:token" Component={ResetPassword}/>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>

      }
      {isAuthenticated && <BaseApp otherActionButtons={[<Notification/>]}/>}
      <Toaster position="botton-left" />
    </div>
  );
}

export default App;
