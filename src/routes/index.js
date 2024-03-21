import Login from '~/components/Layouts/Authen/Login'
import Register from '~/components/Layouts/Authen/Register'
import Home from '~/pages/Home'
// import MovieShowing from '~/pages/MovieShowing'
import Profile from '~/pages/Profile'
import SetChair from '~/pages/SetChair'
import CheckTicket from '~/pages/CheckTicket'
import DetailMovie from '~/pages/DetailMovie'
import BookingHistory from '~/pages/BookingHistory'

// Admin
import HomeAdmin from '~/admin/Home'
import AddFilm from '~/admin/Film/AddFilm'
import ComboMeal from '~/admin/Film/ComboMeal'
import AddGenre from '~/admin/Film/Genre'
import Cenimas from '~/admin/Management/Room'
import ScreeningRate from '~/admin/Management/ScreeningRate'


const publicRoutes = [
    {path: "/", component: Home},
    // {path: "/movieshowing", component: MovieShowing},
    {path: "/my-account/profile/:username", component: Profile},
    {path: "/my-account/booking/BookingHistory/:userId", component: BookingHistory},

    //authen
    {path: "/authen/login", component: Login},
    {path: "/authen/register", component: Register},

    //check-ticket
    {path: "/show/check-ticket/:screeningId/:movieId/:roomId", component: CheckTicket},
    //setchair
    // { path: '/setchair/:screeningId', component: SetChair },
    { path: '/setchair/show/:screeningId/:movieId/:roomId', component: SetChair },
    // { path: '/setchair/:movieId', component: SetChair },


    // detial movie
    { path: '/show/:movieId', component: DetailMovie },

    //Admin
]

const privateRoutes = [
    {path:'/admin/home', component: HomeAdmin},
    {path:'/admin/add-film', component: AddFilm},
    {path: '/admin/add-genre', component: AddGenre},
    {path: '/admin/manage-cinemas', component: Cenimas},
    {path: '/admin/manage-screeningRate', component: ScreeningRate},
    {path: "/admin/add-comboMeal", component: ComboMeal},

]

export { publicRoutes, privateRoutes}