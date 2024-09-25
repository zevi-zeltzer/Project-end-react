import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    street: "",
    suite: "",
    city: "",
    zipcode: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { fullName, username, password, email, phone, company },
          address
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/Login");
      } else {
        setError(data.error || "Registration error");
      }
    } catch (error) {
      setError("Server error");
    }
  };

  const handleAddressChange = (field, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  return (
    <div className="register">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street"
          value={address.street}
          onChange={(e) => handleAddressChange("street", e.target.value)}
        />
        <input
          type="text"
          placeholder="Suite"
          value={address.suite}
          onChange={(e) => handleAddressChange("suite", e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => handleAddressChange("city", e.target.value)}
        />
        <input
          type="text"
          placeholder="Zipcode"
          value={address.zipcode}
          onChange={(e) => handleAddressChange("zipcode", e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
      <nav className="register-nav">
        <Link to="/login">Already have an account? Login</Link>
      </nav>
    </div>
  );
}

export default Register;
