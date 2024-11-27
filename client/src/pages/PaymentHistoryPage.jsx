import { useState, useEffect } from 'react'
import { axiosPrivateIns } from '../libs/axios'
import { useDispatch } from 'react-redux'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import useTitle from '../hooks/useTitle'
import moment from 'moment'
import { Link } from 'react-router-dom'
import useBodyBgColor from '../hooks/useBodyBgColor'

const PaymentHistory = () => {
    const dispatch = useDispatch()

    const [orders, setOrders] = useState()

    // Load page
    useTitle('FlqCine | Payment History')
    useBodyBgColor('#101010')
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
                const { data } = await axiosPrivateIns(`/user/orders`)
                setOrders(data.data)
            } catch (error) {
                console.error(error)
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        fetchData()
    }, [])

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-400'
            case 'PAID':
                return 'text-green-400'
            case 'CANCELED':
                return 'text-red-400'
        }
    }

    return (
        <main className="mx-auto max-w-[1366px] px-4 py-8 text-white">
            {!orders || !orders.length ? (
                <div className="-mt-20 flex h-screen items-center justify-center">
                    <p>
                        No payment to show.
                        <Link
                            to="/plan"
                            className="mx-2 border-b border-primary bg-gradient-main bg-clip-text text-transparent hover:opacity-90"
                        >
                            Click here
                        </Link>
                        to order new one
                    </p>
                </div>
            ) : (
                <div>
                    <h3 className="bg-gradient-main bg-clip-text text-2xl font-bold text-transparent">
                        Payment History
                    </h3>

                    <div className="mt-10 grid grid-cols-3 gap-20">
                        {orders.map(
                            (
                                {
                                    _id,
                                    plan,
                                    createdAt,
                                    finalPrice,
                                    status,
                                    method
                                },
                                index
                            ) => {
                                return (
                                    <Link
                                        to={`/payment-history/${_id}`}
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border border-secondary px-10 py-6 hover:scale-110"
                                    >
                                        <div className="flex flex-col gap-5 items-center">
                                            <span>#{index + 1}</span>
                                            <span>
                                                {moment(createdAt).format(
                                                    'DD-MM-YYYY'
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <span>{plan?.name}</span>
                                            <span>
                                                {finalPrice.toLocaleString()}VND
                                            </span>
                                            <span>{method?.toUpperCase()}</span>
                                        </div>
                                        <span
                                            className={getStatusColor(status)}
                                        >
                                            {status}
                                        </span>
                                    </Link>
                                )
                            }
                        )}
                    </div>
                </div>
            )}
        </main>
    )
}

export default PaymentHistory
