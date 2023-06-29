import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const jwtToken = Cookies.get('jwtToken');
        if (jwtToken) {
            setLoggedIn(true);
            // console.log('Login');
        }
    }, [Cookies]);

    if (loggedIn) {
        navigate('/');
        return null;
    }


    const Login = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:5001/login', {
                email: email,
                password: password
            });
            const jwtToken = response.data.accessToken;

            // Simpan token JWT di cookie
            Cookies.set('jwtToken', jwtToken, { expires: 1 })

            setLoggedIn(true);
            // console.log('User is logged in')
            navigate('/')
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
                    <form className='w-96' onSubmit={Login}>
                        <p className="text-center bg-red-500 text-white">{msg}</p>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='*********' required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="flex items-center justify-center mb-6 w-96 bg-blue-700 hover:bg-blue-800">
                            <div className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm flex sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{isLoading ? 'Loading..' : 'Submit'}</div>
                        </button>

                        <div className='flex justify-end'>
                            <Link to={'/signup'} className='underline text-blue-600 text-sm'>Didn't have account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
