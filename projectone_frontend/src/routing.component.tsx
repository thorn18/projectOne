import {
    Route,
    useHistory,
} from 'react-router-dom';
import LoginComponent from './user/login.component';
import userService from './user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './actions';
import { User } from './user/user';
import HomeComponent from './home.component';
import './index.css'
import { UserState } from './reducer';
import UserDetailComponent from './user/user.details.component';
import ClaimCreationComponent from './claims/claimcreate.component';
import ClaimReviewComponent from './claims/claimreview.component';

export default function RouterComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const history = useHistory();
    const dispatch = useDispatch();
    const homeHandler = () => {
        history.push('/home')
    }
    const loginHandler = () => {
        history.push('/login')
    }
    const userDetHandler = () => {
        history.push('/:user.name')
    }
    function logout() {
        userService.logout().then(() => {
            dispatch(getUser(new User()));
            history.push("/home");
        });
    }
    return (
        <>
            <div id = "outer">
                <header id="container">
                    <button id="home" onClick={homeHandler}>Home</button>
                    {/* <button id="home"><Link to='/home'>Home</Link></button> */}
                    {user.role ? (
                        <button id="profile" onClick={userDetHandler}>Profile</button>
                    ) : (
                            <span></span>
                        )}
                    {user.role ? (
                        <button id="logoutbutton" onClick={logout}>Logout</button>
                    ) : (
                            <button id="loginbutton" onClick={loginHandler}>Login</button>

                        )}
                    {user.role &&
                        <h1 id = "welcome">Welcome back {user.name}</h1>
                    }
                </header>
                <Route exact path='/' component={HomeComponent} />
                <Route path='/home' component={HomeComponent} />
                <Route path='/login' component={LoginComponent} />
                <Route
                    exact
                    path='/:user.name'
                    component={UserDetailComponent}
                />
               <Route
                    path='/claimCreate'
                    component={ClaimCreationComponent}
                />
                 <Route
                    path='/review'
                    component={ClaimReviewComponent}
                />
            </div>
        </>
    );
}