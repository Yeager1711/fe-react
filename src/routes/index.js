import Login from '~/components/Layouts/Authen/Login'
import Register from '~/components/Layouts/Authen/Register'
import Home from '~/pages/Home'
import MovieShowing from '~/pages/MovieShowing'
import Profile from '~/pages/Profile'
import SetChair from '~/pages/SetChair'

const publicRoutes = [
    {path: "/", component: Home},
    {path: "/movieshowing", component: MovieShowing},
    {path: "/profile", component: Profile},

    //authen
    {path: "/authen/login", component: Login},
    {path: "/authen/register", component: Register},

    //setchair
    {path: "/setchair", component: SetChair},
]

const privateRoutes = [

]

export { publicRoutes, privateRoutes}