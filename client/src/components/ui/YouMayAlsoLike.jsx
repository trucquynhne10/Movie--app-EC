import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsGlobalLoading } from '../../redux/slices/appSlice'
import { axiosPrivateIns } from '../../libs/axios'
import MediaSlider from './MediaSlider'

const YouMayAlsoLike = () => {
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()
    const [recommendedFilms, setRecommendedFilms] = useState([])

    useEffect(() => {
        const getRecommendedFilms = async () => {
            dispatch(setIsGlobalLoading(true))
            try {
                const { data } = await axiosPrivateIns.get(
                    `/user/recommended-films?language=vi-VN`
                )
                setRecommendedFilms(data?.data ?? [])
            } catch (err) {
                return toast.error(
                    'Oops! There was an error loading movies and TV series',
                    getToastOptions()
                )
            } finally {
                dispatch(setIsGlobalLoading(false))
            }
        }

        getRecommendedFilms()
    }, [])

    if (!user || recommendedFilms.length == 0) return null

    return (
        <MediaSlider
            heading="You May Also Like"
            mediaType="movie"
            mediaData={recommendedFilms}
        />
    )
}

export default YouMayAlsoLike
