import './App.css';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import userService from './user/user.service';
import { getUser } from './actions';
import RouterComponent from './routing.component';
import { BrowserRouter } from 'react-router-dom';

function App() {
  
  const dispatch = useDispatch();
  useEffect(() => {
      userService.getLogin().then((user) => {
        if(user) {
          dispatch(getUser(user));
        } else {
        }
      });
  }, [dispatch]);

  return (
    <div className='container'>
      
      <BrowserRouter>
      <RouterComponent></RouterComponent>
      </BrowserRouter>
    </div >
  );
}

export default App;
