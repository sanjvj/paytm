import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/Subheading"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export const Signin = () => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChangeValue={(e)=>{
          setUsername(e.target.value)
        }} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChangeValue={(e)=>{
          setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async ()=>{
            const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                
                username,
                password
            })

            localStorage.setItem("token",response.data.token); //We store the response of json webtokens in local storage which we can access later wherever user making requests
            navigate("/dashboard")
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}