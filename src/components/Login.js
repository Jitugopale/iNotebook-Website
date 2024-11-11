import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom";

const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password:""})
    let navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();  //page not reload
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
            },
            body: JSON.stringify({email: credentials.email,password:credentials.password})

          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            //save the authtoken and redirect
            localStorage.setItem('token',json.authToken);
            //useHistory Hook for redirect
            navigate("/");
            props.showAlert("Logged in Sucessfully","success")

          }
          else{
            // alert("Invalid Credentials");
            props.showAlert("Invalid Details","danger")

          }
    }

    const onChange=(e)=>{
        setcredentials({...credentials,[e.target.name]:e.target.value}) //...=spread operator=jo value note object mai hai vo rahe laken jo properties note,....  ka age liki ja rahi hai use override ya fir add karna
  
    }
  return (
    <div className='mt-3'>
      <h2>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Login
