import React, { useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement
)

const BarChart = () => {
    const [token, setToken] = useState('')
    const [expired, setExpired] = useState('')
    const [expense, setExpense] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        refreshToken()
        getExpense()
    }, [])

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


    const getExpense = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5001/expense', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response.data);
            const data = response.data
            // const uniqueData = data.filter((item) => {
            //     return !transactions.some((transaction) => transaction.id === item.id);
            // });

            setExpense(data);
            // setTransactions((trans) => [...trans, ...uniqueData]);
        } catch (error) {
            console.log(error);
        }
    }


    const data = {
        labels: expense.map((transaction) => transaction.category),
        datasets: [
            {
                label: 'Expense Amount',
                data: expense.map((transaction) => transaction.amount),
                backgroundColor: 'red',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
            labels: {
                fontSize: 26
            }
        }
    }

    console.log(data);
    return (
        <div>
            <Bar
                data={data}
                height={400}
                options={options}
            />
        </div>
    )
}

export default BarChart
