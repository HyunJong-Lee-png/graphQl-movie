import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Home"
import Movie from "./Movie"
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
