import Loginpage from "./Loginpage.jsx";
import RegisterPage from "./RegisterPage.jsx"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import homes from "./Home.jsx";
import Homes from "./Home.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
function App() {

  return (
    <Router>
          <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/home" element={<Homes/>}/>
      
        </Routes>
      </Router>
    
  );
}

export default App;
