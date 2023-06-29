import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


const Registers = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [msg, setMsg] = useState('')
    const navigate = useNavigate()

    const Register = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5001/register', {
                name: name,
                email: email,
                password: password,
                confpassword: confPassword
            })
            navigate('/login')
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }






    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex justify-center items-center flex-col bg-slate-300 p-4 px-4 rounded-lg shadow-sm'>
                <div>
                    <svg
                        className="svg-icon bg-blue-300 rounded-full"
                        style={{
                            width: '5em',
                            height: '5em',
                            verticalAlign: 'middle',
                            fill: 'currentColor',
                            overflow: 'hidden',
                        }}
                        viewBox="0 0 1024 1024"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M512 597.994667q108.010667 0 225.002667 46.997333t116.992 123.008l0 85.994667-684.010667 0 0-85.994667q0-76.010667 116.992-123.008t225.002667-46.997333zM512 512q-69.994667 0-120-50.005333t-50.005333-120 50.005333-121.002667 120-51.008 120 51.008 50.005333 121.002667-50.005333 120-120 50.005333z" />
                    </svg>
                </div>
                <div>
                    <form className='w-96' onSubmit={Register}>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='*********' required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='*********' required value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="flex items-center justify-center mb-2 w-96 bg-blue-700 hover:bg-blue-800">
                            <div className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm flex sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</div>
                        </button>
                        <p className="text-center bg-red-500 text-white">{msg}</p>

                        <div className='flex justify-end'>
                            <Link to={'/login'} className='underline text-blue-600 text-sm'>Already have account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Registers
