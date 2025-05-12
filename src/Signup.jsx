import React from "react";
import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import { nav } from "framer-motion/client";

function Signup() {
    const [form, setForm] = React.useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        terms: false
    })

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setForm(prev => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.terms) {
            toast.warn("Please accept the terms");
            return;
        }
        if (!form.name || !form.email || !form.password || !form.phone || !form.role) {
            toast.warn("Please fill in all fields");
            return;
        }
        const payload = {
            name: form.name,
            email: form.email,
            role: form.role,
          };
        try {
            console.log("Payload being sent:", payload);
    
            const res = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
    
            if (res.ok) {
                toast.success(json.message || "Signup successful");
            } else {
                toast.error(json.error || "Signup failed");
            }
        } catch (err) {
            console.error("Network error", err);
            toast.error("Server error. Please try again later.");
        }
    };
    
    return (
        <div className="signup-layout">
            <div className="signup-image">
                <img height={800} width={800} src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7863.jpg?t=st=1746814511~exp=1746818111~hmac=fc4d40d5a2892acb02c59e9e628f0ae9c6c9b8677ed33dde73bf3966de24f850&w=900" />
            </div>
            <div className="signup-container">
                <div className="card">
                    <p className="headingsignup">Sign up to QueueSeva</p>
                    <form onSubmit={handleSubmit}>
                        <input className="inputsignup" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" />
                        <input className="inputsignup" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" />
                        <input className="inputsignup" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
                        <input className="inputsignup" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" />
                        <select className="inputsignup" name="role" value={form.role} onChange={handleChange}>
                            <option value="" disabled>Select your role</option>
                            <option value="student">User</option>
                            <option value="faculty">Admin</option>
                            <option value="admin">Staff</option>
                        </select>
                        <div className="checkbox-container">
                            <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange}/>
                            <label htmlFor="terms">I agree to the Terms and Conditions</label>
                        </div>
                        <button type="submit" className="signup-btn">Sign Up</button>
                    </form>
                    
                    <p className="account-link">Already have an account? <a href="/login">Log in</a></p>
                </div>
            </div>
            <ToastContainer aria-label="Toast Notifications" />

        </div>
    );
}

export default Signup;