import React, { useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Loginpage = () => {


  const [Username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const [error,setError] = useState('');


  const handleLogin = async(e) =>{
    e.preventDefault();
    setError('');
    try{
      console.log('Attempting login with:', { username: Username });
      const response = await axios.post('http://localhost:8080/login',{
        username: Username,
        password: password
      } );
      
      console.log('Login response:', response);
      if(response.status === 200){
        console.log('Login successful, navigating to /home');
        navigate('/home')
      }
    }catch(e){
      console.error('Login error:', e);
      console.error('Error response:', e.response);
      if(e.response && e.response.data){
        setError(e.response.data);
      } else if(e.response && e.response.status === 401){
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please check if backend is running.');
      }
    }
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} method="POST" className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="text"
              value={Username}
              onChange={(e)=>setUsername(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{' '}
        <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Register
        </a>
      </p>
    </div>
  </div>

  )
}

export default Loginpage