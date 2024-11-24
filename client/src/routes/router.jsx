import HomePage from '../pages/HomePage'
import SearchPage from '../pages/SearchPage'
import MediaListPage from '../pages/MediaListPage'
import MediaDetailPage from '../pages/MediaDetailPage'
import PersonDetailPage from '../pages/PersonDetailPage'
import AuthProtector from '../components/layout/AuthProtector'
import MyReviewsPage from '../pages/MyReviewsPage'
import MyFavoritesPage from '../pages/MyFavoritesPage'
import UpdatePasswordPage from '../pages/UpdatePasswordPage'
import NotFoundPage from '../pages/NotFoundPage'
import PlanPage from '../pages/PlanPage'
import PaymentHistoryPage from '../pages/PaymentHistoryPage'
import PaymentDetailPage from '../pages/PaymentDetailPage'

const routes = [
    {
        indexPage: true,
        element: <HomePage />
    },
    {
        path: '/update-password',
        element: (
            <AuthProtector>
                <UpdatePasswordPage />
            </AuthProtector>
        )
    },
    {
        path: '/favorites',
        element: (
            <AuthProtector>
                <MyFavoritesPage />
            </AuthProtector>
        )
    },
    {
        path: '/reviews',
        element: (
            <AuthProtector>
                <MyReviewsPage />
            </AuthProtector>
        )
    },
    {
        path: '/search',
        element: <SearchPage />
    },
    {
        path: '/person/:personId',
        element: <PersonDetailPage />
    },
    {
        path: '/:mediaType',
        element: <MediaListPage />
    },
    {
        path: '/:mediaType/:mediaId',
        element: <MediaDetailPage />
    },
    {
        path: '*',
        element: <NotFoundPage />
    },
    {
        path: '/plan',
        element: (
            <AuthProtector>
                <PlanPage />
            </AuthProtector>
        )
    },
    {
        path: '/payment-history',
        element: (
            <AuthProtector>
                <PaymentHistoryPage />
            </AuthProtector>
        )
    },
    {
        path: '/payment-history/:orderId',
        element: (
            <AuthProtector>
                <PaymentDetailPage />
            </AuthProtector>
        )
    }
]

export default routes
