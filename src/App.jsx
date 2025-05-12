import { Routes, Route } from 'react-router-dom';
import Booking from './booking.jsx';
import Homepage from './Homepage.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
function App() {
  return (
    <Routes>
      <Route path="/booking" element={<Booking />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;

