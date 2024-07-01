import axios from "axios"
import { useEffect, useState } from "react"

export const Balance = () => {
    const [balance,setBalance] = useState();
    useEffect(()=>{
        
          
          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/account/balance',
            headers: { 
              'Authorization': 'Bearer '+localStorage.getItem("token"), 
              'Content-Type': 'application/json'
            },
            
          };
          
          axios.request(config)
          .then((response) => {
            const formattedBalance = Number(response.data.balance).toFixed(2);
            setBalance(formattedBalance);
          })
          .catch((error) => {
            console.log(error);
          });
          
    },[])
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}