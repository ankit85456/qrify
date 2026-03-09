import {BrowserRouter,Routes,Route} from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

import QRGenerator from "./components/QRGenerator"

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>} />

<Route path="/dashboard" element={<Dashboard/>} />

<Route path="/generate" element={<QRGenerator/>} />

</Routes>

</BrowserRouter>

)

}

export default App