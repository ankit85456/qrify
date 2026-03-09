import {useEffect,useState} from "react"
import axios from "axios"

function Dashboard(){

const [qrs,setQrs]=useState([])

useEffect(()=>{

const token = localStorage.getItem("token")

axios.get(
"http://localhost:5000/api/qr/myqr",
{
headers:{
authorization:token
}
}
).then(res=>{

setQrs(res.data)

})

},[])

return(

<div>

<h2>My QR Codes</h2>

{
qrs.map(q=>(
<div key={q._id}>

<p>{q.text}</p>
<p>Scans: {q.scanCount}</p>

</div>
))
}

</div>

)
}

export default Dashboard