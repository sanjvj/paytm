import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/Subheading"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
export const Signup = () => {
    const [firstName,setFirstname] = useState("");
    const [lastName,setLastname] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChangeValue={(e)=>{
            setFirstname(e.target.value); s
        }} placeholder="John" label={"First Name"} />
        <InputBox onChangeValue={(e)=>{
            setLastname(e.target.value);
        }} placeholder="Doe" label={"Last Name"} />
        <InputBox onChangeValue={(e)=>{
            setUsername(e.target.value);
        }} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChangeValue={(e)=>{
            setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async ()=>{
            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
                firstName,
                lastName,
                username,
                password
            })
            localStorage.setItem("token",response.data.token); //We store the response of json webtokens in local storage which we can access later wherever user making requests
            navigate("/dashboard")
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}