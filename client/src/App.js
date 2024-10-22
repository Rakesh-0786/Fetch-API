import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
// import './App.css';
import Register from './components/Register';
import './Resources/register.css'
import Login from './components/Login';
import Home from './components/Home';



function App() {
  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/home' element={<Home />} />
      {/* Add other routes as needed */}
    </Routes>
  </Router>

  );
}

export default App;
