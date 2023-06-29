import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './style.css'
import BarChart from '../components/Chart/BarChart'
import BarChart2 from '../components/Chart/BarChart2'



const Dashboard = () => {
    const [token, setToken] = useState('')
    const [expired, setExpired] = useState('')
    const [income, setIncome] = useState([])
    const [totalAmount, setTotal] = useState(0)
    const [expense, setExpense] = useState([])
    const navigate = useNavigate()

    const formattedDate = (datestring) => {
        const data = new Date(datestring)
        return data.toLocaleDateString('en-US', {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    useEffect(() => {
        refreshToken()
        getExpense()
        getIncome()
        calculateBalance()
    }, [expense, income])

    const calculateBalance = () => {
        const totalExpenses = expense.reduce((total, currentExpense) => total + currentExpense.amount, 0);
        const totalIncomes = income.reduce((total, currentIncome) => total + currentIncome.amount, 0);
        const balance = totalIncomes - totalExpenses;
        setTotal(balance);
    }


    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5001/token');
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpired(decoded.exp)
        } catch (error) {
            if (error.response) {
                navigate('/login')
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


    const getIncome = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5001/income', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = response.data
            setIncome(data)
            // setTransactions((trans) => [...trans, ...data])
        } catch (error) {
            console.log(error);
        }
    }

    const getExpense = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5001/expense', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response.data);
            const data = response.data
            setExpense(data)
            // setTransactions((trans) => [...trans, ...data])
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout>
            <div className="mt-14">
                <div className='flex justify-center items-center'>
                    <div className='flex flex-col'>
                        <div className='flex jusrify-between'>
                            <div>
                                <BarChart />
                            </div>
                            <div>
                                <BarChart2 />
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='overflow-auto h-56 m-4 mb-10'>
                                <h1 className='text-xl font-bold bg-yellow-200 p-2'>History Income :</h1>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {income.map((tran, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {tran.title}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {tran.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tran.type}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formattedDate(tran.date)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tran.category}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <h1 className='text-xl font-bold bg-yellow-200 p-2'>History Expense :</h1>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expense.map((ep, index) => (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {ep.title}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {ep.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {ep.type}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formattedDate(ep.date)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {ep.category}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center items-center'>
                        <div className='bg-gray-200 p-4 rounded-lg w-96 text-center'>
                            <h1 className='text-3xl font-bold underline'>Total Balance : <span style={{ color: totalAmount > 10000 ? 'green' : 'red' }}>{totalAmount}</span></h1>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
