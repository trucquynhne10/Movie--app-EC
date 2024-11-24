import { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCartShopping,
    faCreditCard,
    faCircleDot,
    faCircle
} from '@fortawesome/free-solid-svg-icons'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import { useDispatch, useSelector } from 'react-redux'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import { axiosPublicIns, axiosPrivateIns } from '../libs/axios'
import { paymentOptions } from '../utils/const'
import Modal from '../components/common/Modal'

const PlanPage = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.user.user)

    const [plans, setPlans] = useState([Object])
    const [totalAmount, setTotalAmount] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedPayment, setSelectedPayment] = useState('momo')
    const [isOpen, setIsOpen] = useState(false)
    const [pendingPayment, setPendingPayment] = useState({})

    // Today
    const formattedCurrentDate = useMemo(() => {
        const currentDate = new Date()
        return currentDate.toLocaleDateString('vi-VN')
    }, [])

    // Calculate next payment date
    const formattedNextPaymentDate = useMemo(() => {
        const currentDate = new Date()

        const selectedPlan = plans.find(
            (option) => option._id === selectedMonth
        )

        const nextPaymentDate = selectedPlan
            ? new Date(
                  currentDate.setMonth(
                      currentDate.getMonth() + selectedPlan.month
                  )
              )
            : null

        return nextPaymentDate?.toLocaleDateString('vi-VN') || 'Not selected'
    }, [selectedMonth])

    // Handle option changed
    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment)
    }

    const handleMonthSelect = (id) => {
        setSelectedMonth(id)
        const selectedOption = plans.find((option) => option._id === id)
        if (selectedOption) {
            setTotalAmount(selectedOption.price)
        }
    }

    // Handle payment submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Return if there is a pending payment
        if (pendingPayment) return setIsOpen(true)

        dispatch(setIsGlobalLoading(true))

        const paymentUri = paymentOptions.find(
            ({ id }) => id === selectedPayment
        ).uri
        const bodyRequest = {
            finalPrice: totalAmount,
            planId: selectedMonth
        }

        try {
            const data = await axiosPrivateIns.post(paymentUri, bodyRequest)

            window.location.href = data.data.data.payUrl
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setIsGlobalLoading(false))
        }
    }

    // Load page
    useTitle('FlqCine | Payment')
    useBodyBgColor('#101010')
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setIsGlobalLoading(true))

                const plans = await axiosPublicIns.get('/plans')

                setPlans(plans.data.data)
                setSelectedMonth(plans.data.data[0]._id)
                setTotalAmount(plans.data.data[0].price)
            } catch (error) {
                console.error(error)
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        const pendingPayment = async () => {
            try {
                dispatch(setIsGlobalLoading(true))

                const { data } = await axiosPrivateIns.get('/payment/pending')

                if (data) setPendingPayment(data.data)

                console.log(data.data)
            } catch (error) {
                console.error(error)
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }
        fetchData()
        pendingPayment()
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <main className="mx-auto max-w-[1366px] px-4 py-8">
                {/* <div className="flex-start mb-10 flex items-center justify-center gap-48">
                    <div className="radio-center relative z-10 justify-items-center">
                        <div className="place-content-center">
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                size="xl"
                                className="radio-[14px] rounded-full bg-gradient-main px-5 py-5 uppercase tracking-wider text-white hover:opacity-90"
                            />
                        </div>
                        <div className="place-content-center">
                            <div className="py-2 text-white">
                                Choose package and Payment method
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="absolute z-0 mt-8 w-[400px] pr-5">
                            <div className="block h-[2px] bg-slate-200"></div>
                        </div>
                        <div className="radio-center z-10 flex-row justify-items-center">
                            <div className="place-content-center">
                                <FontAwesomeIcon
                                    icon={faCreditCard}
                                    size="xl"
                                    className="radio-[14px] rounded-full bg-zinc-700 px-5 py-5 font-medium uppercase tracking-wider text-white hover:opacity-90"
                                />
                            </div>
                            <div>
                                <div className="py-2 text-white">Confirm</div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mx-5 flex justify-center">
                        <div className="mx-3 w-full flex-col px-5">
                            <div className="mt-2">
                                <div className="flex-col">
                                    <div>
                                        <p className="p-4 text-xl font-bold text-white">
                                            Film package:
                                        </p>
                                    </div>
                                    <div className="flex-col gap-1">
                                        {plans.map((option, index) => (
                                            <div
                                                key={index}
                                                className={`mt-3 flex cursor-pointer justify-between rounded-md p-4 
                                                ${
                                                    selectedMonth === option._id
                                                        ? 'bg-gradient-main text-white'
                                                        : 'bg-zinc-800 text-slate-50'
                                                }
                                                hover:bg-gradient-main hover:text-white`}
                                                onClick={() =>
                                                    handleMonthSelect(
                                                        option._id
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="month"
                                                        className="hidden"
                                                        checked={
                                                            selectedMonth ===
                                                            option._id
                                                        }
                                                        onChange={() =>
                                                            handleMonthSelect(
                                                                option._id
                                                            )
                                                        }
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={
                                                            selectedMonth ===
                                                            option._id
                                                                ? faCircleDot
                                                                : faCircle
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <p>{option.name}</p>
                                                </div>
                                                <div>
                                                    <p>{option.price}VND</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="flex-col">
                                    <div>
                                        <p className="p-4 text-xl font-bold text-white">
                                            Payment method:
                                        </p>
                                    </div>
                                    <div className="flex-col gap-1">
                                        {paymentOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`mt-3 flex cursor-pointer justify-between rounded-md p-4 
                                                ${
                                                    selectedPayment ===
                                                    option.id
                                                        ? 'bg-gradient-main text-white'
                                                        : 'bg-zinc-800 text-slate-50'
                                                }
                                                hover:bg-gradient-main hover:text-white`}
                                                onClick={() =>
                                                    handlePaymentSelect(
                                                        option.id
                                                    )
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        className="hidden"
                                                        checked={
                                                            selectedPayment ===
                                                            option.id
                                                        }
                                                        onChange={() =>
                                                            handlePaymentSelect(
                                                                option.id
                                                            )
                                                        }
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={
                                                            selectedPayment ===
                                                            option.id
                                                                ? faCircleDot
                                                                : faCircle
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <p>{option.label}</p>
                                                </div>
                                                <div>
                                                    <img
                                                        src={option.imgSrc}
                                                        alt={option.label}
                                                        className="w-12 rounded"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3 w-full bg-zinc-800 p-5 text-slate-50 md:w-1/2">
                            <div className="pb-3 text-center text-3xl font-semibold">
                                Payment Information
                            </div>
                            <div className="flex justify-between py-2">
                                <p>FLQ account</p>
                                <p>{userInfo.username}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Service</p>
                                <p>
                                    {plans.find(
                                        (option) => option._id === selectedMonth
                                    )?.name || 'Not selected'}
                                </p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p></p>
                                <p>No auto-renewal</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Value</p>
                                <p>{totalAmount.toLocaleString()}đ</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Effective Date</p>
                                <p>{formattedCurrentDate}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Next payment</p>
                                <p>{formattedNextPaymentDate}</p>
                            </div>
                            <hr className="mt-2 py-2" />
                            <div className="flex justify-between py-2">
                                <p>Total payment</p>
                                <p className="text-xl font-semibold text-orange-600">
                                    {totalAmount.toLocaleString()}VND
                                </p>
                            </div>
                            <div className="py-3 text-center">
                                <button
                                    disabled={
                                        !selectedMonth || !selectedPayment
                                    }
                                    className={`w-full rounded-md p-3 ${
                                        selectedMonth && selectedPayment
                                            ? 'bg-gradient-main'
                                            : 'cursor-not-allowed bg-gray-600'
                                    }`}
                                >
                                    Pay
                                </button>
                                <p className="py-3">
                                    By making payment, you agree to the terms of
                                    use and policies of FLQ CINE
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <Modal isOpen={isOpen}>
                <div className="m-3">
                    <strong className="text-white">
                        You have incomplete payment
                    </strong>
                    <div className="mt-5 flex items-center justify-center gap-14">
                        <button
                            className="h-8 w-full rounded bg-gray-700 text-white hover:opacity-80"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="h-8 w-full rounded bg-gradient-main text-white hover:opacity-80"
                            onClick={() =>
                                (window.location.href = pendingPayment?.payUrl)
                            }
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default PlanPage
