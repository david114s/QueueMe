import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
        email: form.email,
      };      

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        console.log("Login successful:", json);
        localStorage.setItem("userName", json.name);
        navigate("/booking", { replace: true });
      } else {
        toast.error(json.error || "Login failed. Please try again.");
        console.log("Login failed:", json.error);
        setError(json.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Server error. Please try again later.");
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-layout">
        <div className="login-image">
          <img
          src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1746814366~exp=1746817966~hmac=ebac790054d98af1a9ed8a757668359e90759c89962be45bdb003779b5f852f3&w=900"
            alt="Login Illustration"
            height={800}
            width={800}
          />
        </div>

        <div className="login-container">
          <div className="card">
            <p className="headinglogin">Welcome Back to QueueSeva</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                className="inputlogin"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <input
                className="inputlogin"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="account-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
            <p className="recaptcha-text">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer aria-label="notifications" />
    </div>
  );
}

export default Login;
