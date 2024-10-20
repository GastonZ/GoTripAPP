import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/LoginSignup/Login';
import SignUp from './pages/LoginSignup/SignUp';
import Navbar from './components/Navbar';
import Options from './pages/Options/Options';
import GoCalendar from './pages/Calendar/GoCalendar';
import MyTrips from './pages/Trips/MyTrips';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import Chatbot from './pages/Chatbot/Chatbot';
import ChargePoints from './pages/ChargePoints/ChargePoints';
import PlaceDetails from './pages/PlaceDetails/PlaceDetails';
import PointsAndEvents from './pages/TouristAndEvents/PointsAndEvents';

function App() {

  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path='/iniciar' element={<Login />} />
        <Route path='/registro' element={<SignUp />} />
        <Route path='/opciones' element={<Options />} />
        <Route path='/calendario' element={<GoCalendar />} />
        <Route path='/puntos-de-carga' element={<ChargePoints />} />
        <Route path="/place-details/:name" element={<PlaceDetails />} />
        <Route path='/misviajes' element={<MyTrips />} />
        <Route path='/chatbot' element={<Chatbot />} /> 
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/puntos-turisticos' element={<PointsAndEvents />} />
      </Routes>
    </>
  )
}

export default App
