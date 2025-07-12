import React, { useState } from 'react';
import background from '../../images/background.png';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateUsername } from '../../utils/helper';

const Login = () => {
  const  [username, setUsername] = useState("");
  const  [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //Handel Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateUsername(username)){
      setError("Invalid Username");
      return;
    }

    if(!password){
      setError("Invalid Password");
      return;
    }
    setError("");

    //Login API Call
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
     {/* Welcome Text */}
      <div className="absolute top-8 left-8 text-white text-3xl font-semibold drop-shadow-lg">
        Welcome to CEB Welfare Portal !
      </div>

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg w-half max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Login</h2>
        <form className="space-y-4" onSubmit = {handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username"  value={username}  onChange = {({target}) => setUsername (target.value)} className="mt-1 block w-full rounded-md border border-orange-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2" placeholder="Enter your username"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" className="mt-1 block w-full rounded-md border border-orange-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 pr-10" placeholder="Enter your password"/>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</div>
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
