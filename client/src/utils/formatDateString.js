import dayjs from 'dayjs'
import 'dayjs/locale/en'

const formatDateString = (dateString) => {
    const formattedDate = dayjs(dateString).locale('en').format('D MMMM, YYYY')

    return formattedDate
}

const formatDateTimeString = (dateString) => {
    const formattedDate = dayjs(dateString)
        .locale('en')
        .format('D MMMM, YYYY - HH:mm:ss')

    return formattedDate
}

export { formatDateString, formatDateTimeString }
