import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { FaTrash } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa'

const Expenses = () => {
    const [expense, setExpense] = useState([])
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [token, setToken] = useState('')
    const [msg, setMsg] = useState('')
    const [expired, setExpired] = useState('')
    const [totalAmount, setTotal] = useState(0)


    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        getExpense()
        const totalAmounts = expense.reduce((total, currentExpense) => total + currentExpense.amount, 0)
        setTotal(totalAmounts)
    }, [expense])


    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5001/token');
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpired(decoded.exp)
        } catch (error) {
            if (error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5001/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpired(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const createExpense = async (e) => {
        e.preventDefault()
        try {
            await axiosJWT.post('http://localhost:5001/expense', {
                title: title,
                amount: amount,
                type: type,
                date: date,
                category: category,
                description: description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setTitle('')
            setAmount('')
            setType('')
            setCategory('')
            setDate('')
            setDescription('')
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }

    const getExpense = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5001/expense', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            setExpense(data)
        } catch (error) {
            console.log(error);
        }
    }

    const deleteExpense = async (id) => {
        // e.preventDefault()
        try {
            await axiosJWT.delete(`http://localhost:5001/expense/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getExpense()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex flex-col justify-center mt-14'>
            <div className='p-4'>
                <h1 className='text-3xl font-bold'>Total Expenses : <span className='text-red-600 underline'>-{totalAmount}</span> </h1>
            </div>
            <div className='flex justify-between'>
                <div>
                    <form className='w-96 mx-4' onSubmit={createExpense}>
                        <p className='text-center text-white bg-red-600 '>{msg}</p>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ttile</label>
                            <input type="text" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="...." required value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                            <input type="number" id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                            <input type="text" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={type} onChange={(e) => setType(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                            <input type="date" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="mb-6">
                            <select name="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="School">School</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea type="text" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Income..</button>
                    </form>
                </div>
                <div className='overflow-auto mt-5'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Amount
                                            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Type
                                            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Date
                                            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Category
                                            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Description
                                            <a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 320 512"><path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" /></svg></a>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <div className="flex items-center">
                                            Action
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {expense.map((expenses, index) => (
                                    <tr key={expenses._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {expenses.title}
                                        </th>
                                        <td className="px-6 py-4">
                                            {expenses.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            {expenses.type}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formattedDate(expenses.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {expenses.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            {expenses.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`edit/${expenses._id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"><FaPen /></Link>
                                            <button onClick={() => deleteExpense(expenses._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expenses
