import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from "react-toastify";

const Register = () => {
    const [formData,setFormData] = useState({name:'',email:'',gender:"",password:''
    })

    const [error,setError] = useState('')
    const navigate = useNavigate()



    const handleChange =(e)=>{
         setFormData({...formData,[e.target.name]:e.target.value})
    }


    const handleSubmit = async(e)=>{
        e.preventDefault();
        setError('')

        try {
            const res = await axios.post('http://localhost:5000/api/register', formData)
            toast.success(res?.data.message|| "Register successfull",{ autoClose: 1000})
            navigate('/login')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Registration failed",{ autoClose: 1000})
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
  
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your name"
                  required
                />
              </div>
  
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
  
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your password"
                  required
                />
              </div>
  
              <div>
                <label className="block mb-1 font-medium">Gender (optional)</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
  
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </form>
  
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };
    

export default Register;