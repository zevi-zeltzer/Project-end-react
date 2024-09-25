import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({id:user.id,name:user.fullName,email:user.email}));
        navigate(`/users/${user.id}/home`);
      } else {
        // הצגת שגיאה אם יש
        setError(user.error || 'Username or password is incorrect');
      }
    } catch (err) {
      setError('An error occurred while logging in');
    }
  };
  return (
    <div className='login'>
      <h2 >Login Page</h2>
      <form onSubmit={handleLogin}>
        <input
        className='input-userName'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
        className='input-password'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className='btnLogin'>Login</button>
      </form>
      {error && <p>{error}</p>}
      <nav className='nav'>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}
export default Login;