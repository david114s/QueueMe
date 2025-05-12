import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Booking.css';

function Booking() {
  const [userId, setUserId] = useState('');
  const [providerId, setProviderId] = useState('');
  const [slotId, setSlotId] = useState('');
  const [appointmentId, setAppointmentId] = useState(null);
  const [eta, setEta] = useState(null);
  const [etaProviderId, setEtaProviderId] = useState('');
  

  const handleBooking = async () => {
    try {
      const response = await axios.post("http://localhost:5000/bookings", {
        user_id: userId,
        provider_id: providerId,
        slot_id: slotId
      });
  
      if (response.status === 200) {
        toast.success("Booking created successfully");
        setAppointmentId(response.data.appointment_id);
        try {
          const queueResponse = await axios.post("http://localhost:5000/join", {
            user_id: userId,
            provider_id: providerId
          });
  
          if (queueResponse.status === 200) {
            toast.success("You have joined the queue successfully");
            localStorage.setItem("queueId", queueResponse.data.queue_id);
          } else {
            toast.error("Failed to join the queue");
          }
        } catch (queueError) {
          console.error("Error joining queue:", queueError);
          toast.error("Queue join failed. Try again.");
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Slot already booked");
      } else {
        console.error("Booking error:", error);
        toast.error("Error creating your booking");
      }
    }
  };
    const handleCheckETA = () => {
    const queuePosition = appointmentId;
    const estimatedWaitMinutes = queuePosition * 5;

    const now = new Date();
    const etaTime = new Date(now.getTime() + estimatedWaitMinutes * 60000);
    const formattedEta = etaTime.toLocaleTimeString();

    setEta(formattedEta);
  };  

  return (
    <div>
      <div>
        <nav className="navbar">
          <div className="logo"><span className="title">QueueSeva</span></div>
          <div className="nav-links">
            <a>Features</a>
            <a>How It Works</a>
            <a>Use Cases</a>
            <a className="cta-nav">Get Started</a>
          </div>
        </nav>
      </div>

      <div className="form">
        <h1 className="heading">Book Your Appointments Here</h1>
        <p className="subheading">Use your registered details to book a slot. Need help? Contact your service provider.</p>

        <label htmlFor="userId">User ID (from login)</label>
        <input
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label htmlFor="providerId">Provider ID (e.g., Clinic ID or Office ID)</label>
        <input
          placeholder="Enter the provider ID"
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
        />

        <label htmlFor="slotId">Slot ID (choose from available slots)</label>
        <input
          placeholder="Enter your preferred slot"
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
        />

        <button onClick={handleBooking}>Book My Slot</button>
         {appointmentId && (
          <div className="appointment-id">
            <h3>Your Appointment ID: {appointmentId}</h3>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      <div className="eta">
        <h2>Check your Estimated Time of Arrival (ETA)</h2>
        <input
          placeholder="Enter your provider ID"
          value={etaProviderId}
          onChange={(e) => setEtaProviderId(e.target.value)}
        />
        <button onClick={handleCheckETA}>Check ETA</button>
        {eta && (
          <div className="appointment-id">
            <h3>Your ETA is: {eta}</h3>
          </div>
        )}
      </div>
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-left">
            <h3>QueueSeva</h3>
            <p>Revolutionizing how India queues — digitally, efficiently, and stress-free.</p>
            </div>

            <div className="footer-center">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
                <li><a href="/booking">Book Now</a></li>
            </ul>
            </div>

            <div className="footer-right">
            <h4>Contact Us</h4>
            <p>Email: <a href="mailto:support@queueme.com">support@queueme.com</a></p>
            <p>Phone: +91-9876543210</p>
            <p>Address: Noida,Uttar Pradesh</p>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2025 QueueSeva. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Booking;
