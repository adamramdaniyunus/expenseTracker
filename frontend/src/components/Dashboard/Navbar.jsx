import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {
    const navigate = useNavigate()

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5001/logout')
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>

            <nav className="bg-gray-50 border-gray-200 dark:bg-gray-900 fixed w-full">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
                    <p className="flex items-center">
                        {/* <img className="h-8 mr-3" alt="Flowbite Logo" /> */}
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Expense Tracker</span>
                    </p>
                    <div className="flex md:order-2">
                        <button type="button" className="text-black bg-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={Logout}>Logout</button>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navbar
