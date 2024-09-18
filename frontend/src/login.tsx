import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Background from "./background";
import ArrowSvg from "./assets/arrow.svg";

export default function Login() {

  const navigate = useNavigate();

  const [inputs, set_inputs] = useState({
    email: "",
    password: "",
  });

  const [message, set_message] = useState("");

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    set_inputs({...inputs, [name]: value});
  }

  const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const [data, error] = await login_request();
    // console.log(data);
    if (data) {
      set_message(data.message);
      const timeout = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timeout);
    } else if (error) {
      console.log(error);
    }
  }

  const login_request = async() => {
    try {
      const url = import.meta.env.MODE === "production" ? "https://backend-z770.onrender.com/login" : "http://localhost:3000/login"
      const { data } = await axios.post(url, inputs, { withCredentials: true });
      return [data, null];
    } catch(error) {
      return [null, error];
    }
  }

  return (
    <div className="fixed h-screen w-screen">
      <NavLink to="/" className="absolute h-2/25 aspect-square m-6 backdrop-blur-sm bg-blue-400/20 shadow-md rounded-md flex justify-center items-center z-10">
        <img src={ArrowSvg} alt="arrow" className="size-1/2" />
      </NavLink>
      <Background />
      <div className="absolute size-full flex justify-center items-center">
        <div className={`absolute w-1/4 h-2/25 ${message !== "" ? "top-6": "-top-16"} transition-all duration-500 backdrop-blur-sm bg-blue-300/20 shadow-sm rounded-md flex justify-center items-center text-xl font-semibold`}>{message}</div>
        <form onSubmit={onSubmit} className="h-3/5 w-1/3 backdrop-blur-sm bg-blue-300/20 shadow-md rounded-md flex flex-col items-center justify-center">
          <div className="text-2xl font-extrabold">Welcome back</div><br />
          <label className="w-3/4 mb-0.5 text-md font-semibold">Email</label>
          <input 
            type="email" name="email" required placeholder="name@gmail.com" value={inputs.email}
            className="w-3/4 h-1/10 bg-transparent border-b-2 border-blue-400 outline-none pl-2" 
            onChange={onChange}
          /><br />
          <label className="w-3/4 mb-0.5 text-md font-semibold">Password</label>
          <input 
            type="password" name="password" required placeholder="••••••••" value={inputs.password}
            className="w-3/4 h-1/10 bg-transparent border-b-2 border-blue-400 outline-none pl-2" 
            onChange={onChange}
          /><br />
          <label className="w-3/4 text-sm text-blue-600 font-bold flex justify-end">Forgot your password?</label><br />
          <input type="submit" className="h-1/10 w-3/4 bg-blue-400 hover:bg-blue-500 hover:scale-105 transition-transform rounded-lg font-bold tracking-wide" value="Login" /><br />
          <NavLink to="/signup" className="w-3/4 text-sm text-blue-600 font-bold">Don't have an account yet?</NavLink>
        </form>
      </div>
    </div>
  );
}
