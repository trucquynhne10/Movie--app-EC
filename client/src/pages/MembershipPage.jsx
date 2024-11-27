import { useEffect, useState } from 'react'
import { axiosPrivateIns } from '../libs/axios'
import { useDispatch } from 'react-redux'
import { setIsGlobalLoading } from '../redux/slices/appSlice'
import useTitle from '../hooks/useTitle'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'react-toastify'
import getToastOptions from '../configs/toastConfig'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useBodyBgColor from '../hooks/useBodyBgColor'

const MembershipPage = () => {
    const dispatch = useDispatch()
    const [membership, setMembership] = useState()
    const [promoCode, setPromoCode] = useState()

    // Load page
    useTitle('FlqCine | Membership')
    useBodyBgColor('#101010')
    useEffect(() => {
        const fetchData = async () => {
            dispatch(setIsGlobalLoading(true))

            const { data } = await axiosPrivateIns.get('/user/membership')

            setMembership(data.data.membership)
            setPromoCode(data.data.promoCode)

            dispatch(setIsGlobalLoading(false))
        }
        fetchData()
    }, [])

    const handlePromoCodeClick = () => {
        navigator.clipboard.writeText(promoCode?.code)
        toast.success('Copy promo code to clipboard', getToastOptions())
    }

    return (
        <main className="-mt-20 flex h-screen items-center justify-center text-white">
            {!membership ? (
                <p className="text-center">
                    Your membership has been exprired.
                    <Link
                        to="/plan"
                        className="mx-2 border-b border-primary bg-gradient-main bg-clip-text text-transparent hover:opacity-90"
                    >
                        Click here
                    </Link>
                    to register new plan
                </p>
            ) : (
                <div>
                    <h3 className="bg-gradient-main bg-clip-text text-center text-2xl font-bold uppercase text-transparent">
                        Membership
                    </h3>

                    <div className="mt-12 flex flex-col gap-4 rounded border border-secondary p-6">
                        <div className="flex gap-12">
                            <div className="w-32">Start Date</div>
                            <div>
                                {moment(membership?.startDate).format(
                                    'DD-MM-YYYY'
                                )}
                            </div>
                        </div>
                        <div className="flex gap-12">
                            <div className="w-32">Finish Date</div>
                            <div>
                                {moment(membership?.finishDate).format(
                                    'DD-MM-YYYY'
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col items-center justify-center gap-4">
                        <span>Promo code</span>
                        <button
                            className="relative rounded border border-secondary px-16 py-2 hover:opacity-80"
                            onClick={handlePromoCodeClick}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {promoCode?.code}
                            <FontAwesomeIcon
                                icon={faCopy}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            />
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default MembershipPage
