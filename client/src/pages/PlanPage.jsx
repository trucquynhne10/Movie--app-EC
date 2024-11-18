import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCreditCard, faCircleDot, faCircle } from '@fortawesome/free-solid-svg-icons'
import useTitle from '../hooks/useTitle'
import useBodyBgColor from '../hooks/useBodyBgColor'
import userService from '../services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import { axiosPublicIns } from '../libs/axios'


const PlanPage = () => {
    useTitle('FlqCine | Search')
    useBodyBgColor('#101010')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const dispatch = useDispatch()
    const [selectedMonth, setSelectedMonth] = useState('');
    const [plans, setPlans] = useState([Object]);        // State lưu danh sách plans


    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setIsGlobalLoading(true))
              const plans = await axiosPublicIns.get("/plans");
              setPlans(plans.data.data);
            } catch (error) {
              console.error(error); // Kiểm tra lỗi xảy ra
            }
            finally {
                dispatch(setIsGlobalLoading(false))
            }
          };
        fetchData();
    }, []);
    const userInfo = useSelector((state) => state.user.user)
    console.log('userser',userInfo)
    console.log('plans',plans)


    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString('vi-VN'); 

    // Tính toán ngày next payment
    const selectedPlan = plans.find((option) => option._id === selectedMonth);
    console.log( 'month',selectedPlan)
    const nextPaymentDate = selectedPlan
        ? new Date(currentDate.setMonth(currentDate.getMonth() + selectedPlan.month))
        : null;
    const formattedNextPaymentDate = nextPaymentDate?.toLocaleDateString('vi-VN') || 'Not selected';

    const paymentOptions = [
        { id: 'creditCard', label: 'Credit Card', price: 'Credit Card' },
        { id: 'atmCard', label: 'ATM Card', price: 'ATM Card' },
        { id: 'momo', label: 'Ví MoMo', price: 'MoMo' },
    ]

    const [selectedPayment, setSelectedPayment] = useState('');
    const handlePaymentSelect = (payment) => {
        setSelectedPayment(payment);
    }

    const [totalAmount, setTotalAmount] = useState(0); 
    
    const handleMonthSelect = (id) => {
        setSelectedMonth(id);
        const selectedOption = plans.find((option) => option._id === id);
        if (selectedOption) {
          setTotalAmount(selectedOption.price);
        }
    }

    // // all plans
    // const plans = await axiosPublicIns.get("/plans");

    return (
        <div>
            <main className='mx-auto max-w-[1366px] px-4 py-8'>
                <div className='mb-10 flex flex-start items-center justify-center gap-48'>
                    <div className='justify-items-center radio-center relative z-10'>
                        <div className='place-content-center'>
                            <FontAwesomeIcon icon={faCartShopping} size='xl' className='rounded-full bg-gradient-main px-5 py-5 radio-[14px] uppercase tracking-wider text-white hover:opacity-90'/>
                        </div>
                        <div className='place-content-center'>
                            <div className='text-white py-2'>Choose package and Payment method</div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <div className='absolute mt-8 w-[400px] pr-5 z-0'>
                            <div className='bg-slate-200 block h-[2px]'></div>
                        </div>
                        <div className='flex-row justify-items-center radio-center z-10'>
                            <div className='place-content-center'>
                                <FontAwesomeIcon icon={faCreditCard} size='xl' className='rounded-full bg-zinc-700 px-5 py-5 radio-[14px] font-medium uppercase tracking-wider text-white hover:opacity-90'/>
                            </div>
                            <div>
                                <div className='text-white py-2'>Confirm</div>
                            </div>
                        </div>
                    </div>
                </div>
                <form action="">
                    <div className='flex justify-center mx-5'>
                        <div className='flex-col w-full px-5 mx-3'>
                            <div className="mt-2">
                                <div className="flex-col">
                                    <div>
                                        <p className="text-white p-4 text-xl font-bold">Film package:</p>
                                    </div>
                                    <div className="flex-col gap-1">
                                        {plans.map((option) => (
                                            <div
                                            key={option._id}
                                            className={`flex justify-between p-4 rounded-md mt-3 cursor-pointer 
                                                ${selectedMonth === option._id ? 'bg-gradient-main text-white' : 'bg-zinc-800 text-slate-50'}
                                                hover:bg-gradient-main hover:text-white`}
                                            onClick={() => handleMonthSelect(option._id)}
                                            >
                                            <div className="flex items-center">
                                                <input
                                                type="radio"
                                                name="month"
                                                className="hidden"
                                                checked={selectedMonth === option._id}
                                                onChange={() => handleMonthSelect(option._id)}
                                                />
                                                <FontAwesomeIcon
                                                icon={selectedMonth === option._id ? faCircleDot : faCircle}
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
                                        <p className="text-white p-4 text-xl font-bold">Payment method:</p>
                                    </div>
                                    <div className="flex-col gap-1">
                                        {paymentOptions.map((option) => (
                                            <div
                                            key={option.id}
                                            className={`flex justify-between p-4 rounded-md mt-3 cursor-pointer 
                                                ${selectedPayment === option.id ? 'bg-gradient-main text-white' : 'bg-zinc-800 text-slate-50'}
                                                hover:bg-gradient-main hover:text-white`}
                                            onClick={() => handlePaymentSelect(option.id)}
                                            >
                                            <div className="flex items-center">
                                                <input
                                                type="radio"
                                                name="payment"
                                                className="hidden"
                                                checked={selectedPayment === option.id}
                                                onChange={() => handlePaymentSelect(option.id)}
                                                />
                                                <FontAwesomeIcon
                                                icon={selectedPayment === option.id ? faCircleDot : faCircle}
                                                className="mr-2"
                                                />
                                                <p>{option.label}</p>
                                            </div>
                                                <div>
                                                    <p>{option.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-zinc-800 w-full md:w-1/2 p-5 mx-3 text-slate-50">
                            <div className="text-center text-3xl font-semibold pb-3">Payment Information</div>
                            <div className="flex justify-between py-2">
                                <p>FLQ account</p>
                                <p>{userInfo.username}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Service</p>
                                <p>{plans.find((option) => option._id === selectedMonth)?.name || 'Not selected'}</p>
                            </div>
                            <div className='flex justify-between py-2'>
                                <p></p>
                                <p>No auto-renewal</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <p>Value</p>
                                <p>{totalAmount.toLocaleString()}đ</p>
                            </div>
                            <div className='flex justify-between py-2'>
                                <p>Effective Date</p>
                                <p>{formattedCurrentDate}</p>
                            </div>
                            <div className='flex justify-between py-2'>
                                <p>Next payment</p>
                                <p>{formattedNextPaymentDate}</p>
                            </div>
                            <hr className="py-2 mt-2" />
                            <div className="flex justify-between py-2">
                                <p>Total payment</p>
                                <p className="text-xl font-semibold text-orange-600">{totalAmount.toLocaleString()}VND</p>
                            </div>
                            <div className="text-center py-3">
                                <button
                                    type="submit"
                                    disabled={!selectedMonth || !selectedPayment}
                                    className={`p-3 w-full rounded-md ${(selectedMonth && selectedPayment) ? 'bg-gradient-main' : 'bg-gray-600 cursor-not-allowed'}`}
                                >
                                    Pay
                                </button>
                                <p className="py-3">By making payment, you agree to the terms of use and policies of FLQ CINE</p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default PlanPage
