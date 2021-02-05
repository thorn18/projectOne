import React, { SyntheticEvent } from 'react';
import userService from './user.service';
import { UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../actions';
import './login.css';
import { User } from './user';
import { Route, useHistory } from 'react-router-dom';

// Function Component
function    LoginComponent() {
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    // const logSelector = (state: UserState) => state.logged;
    // let logged = useSelector(logSelector);
    const dispatch = useDispatch();
    const history = useHistory();

    function handleFormInput(e: SyntheticEvent) {
        let u: User = { ...user };
        if((e.target as HTMLInputElement).name === 'username'){
            u.name = (e.target as HTMLInputElement).value;
        } else {
            u.password = (e.target as HTMLInputElement).value;
        }
        console.log(u);
        dispatch(getUser(u));
    }
    function submitForm() {
        console.log(user)
        userService.login(user).then((user) => {
            dispatch(getUser(user));
            history.push('/:user.name');
        }).catch((err) => console.log(err)); 
    }
    return (
        <div className='loginCard'>
           <div id = 'userF'>Username <input type='text' className='form-control' onChange={handleFormInput} name='username'/></div>
           <br/>
           <div id='passF'>Password <input type='password' className='form-control' onChange={handleFormInput}/> </div>
           <br/>
           <button className='btn btn-danger' id = "subBut" onClick={submitForm}>Login</button>
        </div>
    );
}

export default LoginComponent;
