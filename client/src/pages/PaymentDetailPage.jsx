import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { axiosPrivateIns } from '../libs/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import useTitle from '../hooks/useTitle'
import moment from 'moment'

const PaymentDetailPage = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.user.user)

    const [order, setOrder] = useState()

    // Load page
    useTitle('FlqCine | Payment Detail')
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
                const { data } = await axiosPrivateIns(
                    `/user/orders/${orderId}`
                )
                setOrder(data.data)
            } catch (error) {
                console.error(error)
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        fetchData()
    }, [])

    const getStatusColor = () => {
        switch (order?.status) {
            case 'PENDING':
                return 'text-yellow-400'
            case 'PAID':
                return 'text-green-400'
            case 'CANCELED':
                return 'text-red-400'
        }
    }

    return (
        <main className="-mt-20 flex h-screen items-center justify-center text-white">
            {!order ? (
                <h3>Invalid Payment</h3>
            ) : (
                <div>
                    <h3 className="bg-gradient-main bg-clip-text text-center text-2xl font-bold uppercase text-transparent">
                        Payment Detail
                    </h3>

                    <div className="mt-12 flex flex-col gap-4 rounded border border-secondary p-6">
                        <div className="flex gap-12">
                            <div className="w-32">Customer</div>
                            <div>{userInfo?.fullName}</div>
                        </div>
                        <div className="flex gap-12">
                            <div className="w-32">Plan</div>
                            <div>{order?.plan?.name}</div>
                        </div>
                        <div className="flex gap-12">
                            <div className="w-32">Status</div>
                            <div className={getStatusColor()}>
                                {order?.status}
                            </div>
                        </div>
                        <div className="flex gap-12">
                            <div className="w-32">Final Price</div>
                            <div>{order?.finalPrice.toLocaleString()}VND</div>
                        </div>
                        <div className="flex gap-12">
                            <div className="w-32">Created Date</div>
                            <div>
                                {moment(order?.createdAt).format('DD-MM-YYYY')}
                            </div>
                        </div>
                    </div>

                    {/* Show pay url only if status is pending */}
                    {order?.status === 'PENDING' && (
                        <p className="mt-10 text-center text-sm">
                            <a
                                href={order?.payUrl}
                                className="mr-2 border-b border-primary bg-gradient-main bg-clip-text text-transparent hover:opacity-90"
                            >
                                Click here
                            </a>
                            to continue your payment
                        </p>
                    )}
                </div>
            )}
        </main>
    )
}

export default PaymentDetailPage
