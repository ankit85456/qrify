import React,{useState} from "react"
import QRCode from "qrcode.react"

function QRGenerator(){

const [text,setText]=useState("")

return(

<div>

<h2>Generate QR</h2>

<input
placeholder="Enter URL"
onChange={(e)=>setText(e.target.value)}
/>

<br/><br/>

<QRCode value={text} size={200}/>

</div>

)
}

export default QRGenerator