import { useState } from "react"
import axios from "axios"

function Signup(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const signup = async () => {

 try{

 await axios.post(
 "http://localhost:5000/api/auth/signup",
 {
  email: email,
  password: password
 }
 )

 alert("Signup Successful")

 }catch(err){
  alert("Signup Failed")
 }

}

return(

<div>

<h2>Signup</h2>

<input
type="email"
placeholder="Enter Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Enter Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button onClick={signup}>
Signup
</button>

</div>

)

}

export default Signup