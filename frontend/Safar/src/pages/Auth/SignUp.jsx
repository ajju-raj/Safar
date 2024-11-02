import React from "react"
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import {validateEmail} from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';

const SignUp = () => {

  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter a Name");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter a password");
      return;
    }

    setError("");

    // API call to signUp

    try{
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle Successful response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }

    catch(err){
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
      else{
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>

      <div className="login-ui-box right-10 -top-40"/>
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2"/>

        <div className="container h-screen flex items-center justify-center px-20 mx-auto">
          <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
            <div>
              <h4 className="text-5xl text-white font-semibold leading-[58px]">
                Join the <br /> Adventure
              </h4>
              <p className="text-[15px] text-white leading-6 pr-7 mt-4">
                Create an account to start documenting your travels and preserving your memories in your personal travel journal. 
              </p>
            </div>
          </div>

          <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
            <form onSubmit = {handleSignUp}>
              <h4 className="text-2xl font-semibold mb-7">SIGNUP</h4>


              <input type="text" placeholder="Full Name" className="input-box" 
              value={name}
              onChange={({target}) => {
                setName(target.value);
              }}
              />

              <input type="text" placeholder="Email" className="input-box" 
              value={email}
              onChange={({target}) => {
                setEmail(target.value);
              }}
              />

              <PasswordInput
                value = {password}
                onChange = {({target}) => {
                  setPassword(target.value);
                }}
              />

              {error && <p className="text-xs text-red-500 pb-1">{error}</p>}

              <button type="submit" className="btn-primary">
                CREATE ACCOUNT
              </button>

              <p className="text-xs text-slate-500 text-center my-4">Or</p>

              <button 
                className="btn-primary btn-light"
                type="submit"
                onClick={()=>{
                  navigate("/login");
                }}
                >
                  LOGIN
                </button>

            </form>
          </div>
        </div>
    </div>
  );
}

export default SignUp