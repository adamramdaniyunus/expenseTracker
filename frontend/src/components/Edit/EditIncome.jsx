import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const EditIncome = () => {
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [token, setToken] = useState('')
    const [msg, setMsg] = useState('')
    const [expired, setExpired] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()


    useEffect(() => {
        getExpenseId()
    }, [])

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

    const editIncome = async (e) => {
        e.preventDefault()
        try {
            await axiosJWT.patch(`http://localhost:5001/income/${id}`, {
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
            navigate('/income')
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }

    const getExpenseId = async () => {
        const response = await axiosJWT.get(`http://localhost:5001/income/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setTitle(response.data.title)
        setAmount(response.data.amount)
        setType(response.data.type)
        setCategory(response.data.category)
        setDate(response.data.date)
        setDescription(response.data.description)
    }



    return (
        <div className='mt-14 flex justify-center'>
            <form className='w-full mx-4' onSubmit={editIncome}>
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
                    <input type="date" id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="mb-6">
                    <select name="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Freelance">Freelance</option>
                        <option value="Adsense">Adsense</option>
                        <option value="Bitcoin">Bitcoin</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <textarea type="text" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Income..</button>
            </form>
        </div>
    )
}

export default EditIncome
