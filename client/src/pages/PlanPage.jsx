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
import { toast } from 'react-toastify'
import getToastOptions from '../configs/toastConfig'

const PlanPage = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.user.user)

    const [plans, setPlans] = useState([Object])
    const [totalAmount, setTotalAmount] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedPayment, setSelectedPayment] = useState('momo')
    const [pendingModal, setPendingModal] = useState(false)
    const [membershipModal, setMembershipModal] = useState(false)
    const [pendingPayment, setPendingPayment] = useState()
    const [membership, setMembership] = useState()
    const [voucherCode, setVoucherCode] = useState('')
    const [voucher, setVoucher] = useState()

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
    const handleSubmit = (e) => {
        e.preventDefault()

        // Return if there is a pending payment
        if (pendingPayment) return setPendingModal(true)

        // Return if user already have membership
        if (membership) return setMembershipModal(true)

        processPayment()
    }

    const processPayment = async () => {
        try {
            dispatch(setIsGlobalLoading(true))

            const bodyRequest = {
                finalPrice: plans.find(({ _id }) => _id === selectedMonth)
                    ?.price,
                planId: selectedMonth,
                method: selectedPayment,
                voucherCode
            }

            const data = await axiosPrivateIns.post('/payment', bodyRequest)

            window.location.href = data.data.data.payUrl
        } catch (error) {
            const { message } = error.response.data

            toast.error(message, getToastOptions())
            setVoucherCode('')
        } finally {
            dispatch(setIsGlobalLoading(false))
        }
    }

    // Apply voucher
    const applyVoucher = async () => {
        try {
            dispatch(setIsGlobalLoading(true))
            const { data } = await axiosPrivateIns.post(
                '/payment/apply-voucher',
                {
                    price: totalAmount,
                    voucherCode
                }
            )
            setVoucher(data.data)
            setTotalAmount(data.data.finalPrice)
        } catch (error) {
            const { message } = error.response.data

            toast.error(message, getToastOptions())
            setVoucherCode('')
        } finally {
            dispatch(setIsGlobalLoading(false))
        }
    }

    // Load page
    useTitle('FlqCine | Payment')
    useBodyBgColor('#101010')
    useEffect(() => {
        const fetchData = async () => {
            dispatch(setIsGlobalLoading(true))

            const plans = await axiosPublicIns.get('/plans')
            const pendingPayment = await axiosPrivateIns.get('/payment/pending')
            const membership = await axiosPrivateIns.get('/user/membership')

            setPlans(plans.data.data)
            setSelectedMonth(plans.data.data[0]._id)
            setTotalAmount(plans.data.data[0].price)
            setPendingPayment(pendingPayment.data.data)
            setMembership(membership.data.data.membership)

            dispatch(setIsGlobalLoading(false))
        }
        fetchData()
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>
            <main className="mx-auto mt-5 max-w-[1366px] px-4 py-8">
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
                                                    <p>
                                                        {option?.price?.toLocaleString()}
                                                        VND
                                                    </p>
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
                                <p>
                                    {plans
                                        .find(
                                            (option) =>
                                                option._id === selectedMonth
                                        )
                                        ?.price?.toLocaleString() || 0}
                                    đ
                                </p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Effective Date</p>
                                <p>{formattedCurrentDate}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Next payment</p>
                                <p>{formattedNextPaymentDate}</p>
                            </div>
                            <div className="relative mb-8 mt-4">
                                <input
                                    type="text"
                                    className="peer block min-h-[auto] w-full rounded border-2 border-neutral-500 bg-transparent py-2 pl-4 pr-28 font-medium leading-[2.15] text-white caret-primary outline-none transition-all duration-200 ease-linear focus:border-primary motion-reduce:transition-none"
                                    id="voucher"
                                    placeholder=" "
                                    spellCheck={false}
                                    value={voucherCode}
                                    onChange={(e) =>
                                        setVoucherCode(e.target.value)
                                    }
                                />
                                <label
                                    htmlFor="voucher"
                                    className="pointer-events-none absolute left-3 top-1/2 mb-0 max-w-[90%] origin-[0_0] -translate-y-1/2 truncate px-1 font-medium text-neutral-500 transition-all duration-200 ease-out peer-focus:top-0.5 peer-focus:scale-[0.8] peer-focus:bg-black peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:scale-[0.8] peer-[:not(:placeholder-shown)]:text-primary motion-reduce:transition-none"
                                >
                                    Voucher
                                </label>
                                <button
                                    type="button"
                                    className={`absolute right-6 top-1/2 -translate-y-1/2 rounded px-4 py-1 text-xs ${
                                        voucherCode
                                            ? 'bg-gradient-main hover:opacity-70'
                                            : 'cursor-not-allowed bg-gray-600'
                                    }`}
                                    disabled={!voucherCode}
                                    onClick={applyVoucher}
                                >
                                    Apply
                                </button>
                            </div>
                            {voucher?.description && (
                                <p className="-mt-5 mb-4 text-sm text-gray-400">
                                    {voucher?.description}
                                </p>
                            )}
                            <hr className="mt-2 py-2" />
                            {voucher && (
                                <div className="flex justify-between py-2">
                                    <p>Discount amount</p>
                                    <p className="relative text-xl font-semibold">
                                        -
                                        {voucher?.discountAmount?.toLocaleString() ||
                                            0}
                                        VND
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-between py-2">
                                <p>Total payment</p>
                                <p className="text-xl font-semibold text-orange-600">
                                    {totalAmount.toLocaleString()}VND
                                </p>
                            </div>
                            <div className="py-3 text-center">
                                <button
                                    type="submit"
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

            <Modal isOpen={pendingModal}>
                <div className="m-3">
                    <strong className="text-white">
                        You have incomplete payment
                    </strong>
                    <div className="mt-5 flex items-center justify-center gap-14">
                        <button
                            className="h-8 w-full rounded bg-gray-700 text-white hover:opacity-80"
                            onClick={() => setPendingModal(false)}
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

            <Modal isOpen={membershipModal}>
                <div className="m-3 text-white">
                    <p>
                        Your membership is still valid, we will extend your
                        current one.
                    </p>
                    <p className="text-center">Are you sure to continue?</p>
                    <div className="mt-5 flex items-center justify-center gap-14">
                        <button
                            className="h-8 w-full rounded bg-gray-700 text-white hover:opacity-80"
                            onClick={() => setMembershipModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="h-8 w-full rounded bg-gradient-main text-white hover:opacity-80"
                            onClick={processPayment}
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
