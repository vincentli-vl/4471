'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth(); // Use the login function from context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Local
      const response = await fetch('http://localhost:4471/login', { 
      // Cloud
      // const response = await fetch('https://service-registry-cs4471.1p2lshm2wxjn.us-east.codeengine.appdomain.cloud/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed: ' + response.statusText);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store the JWT token in local storage
      login(); // Call the login function
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setError(error.message); // Set error message to display
      console.error('There was a problem with the login operation:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-black">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
