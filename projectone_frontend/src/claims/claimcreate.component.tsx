import React, { useEffect, useState, useContext, SyntheticEvent } from 'react';
import { useHistory, Link, Route } from 'react-router-dom';
import claimService from './claims.service';
import { ClaimState, UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { EditClaim, getUser } from '../actions';
import { Claim } from './claim';
import UserDetailComponent from '../user/user.details.component';
import './claimcreate.css'
import userService from '../user/user.service';
import { User } from '../user/user';
import { waitFor } from '@testing-library/react';
import { time } from 'console';

interface ClaimCreationProps {
    match: any;
}

export default function ClaimCreationComponent(
) {
    const claimSelector = (state: ClaimState) => state.Claim;
    let cl = useSelector(claimSelector);
    const user = useSelector((state: UserState) => state.user);

    const dispatch = useDispatch();
    const history = useHistory();

    function updateReviewer(supervisor: User) {
        userService.updateSupervisor(supervisor);
    }
    function updateCurrentUser(user: User) {
        userService.updateUser(user);
    }

    function computerFinalCost() {
        let final = -1;
        switch (cl.type) {
            case ("University Course"):
                final = Math.ceil(cl.amount * .8);
                break;
            case ("Certification"):
                final = Math.ceil(cl.amount * 1);
                break;
            case ("Seminar"):
                final = Math.ceil(cl.amount * .6);
                break;
            case ("Certification Prep Course"):
                final = Math.ceil(cl.amount * .75);
                break;
            case ("Technical Training"):
                final = Math.ceil(cl.amount * .9);
                break;
            case ("Other"):
                final = Math.ceil(cl.amount * .3);
                break;
            default:
                alert("WRONG");
                break;
        }
        cl.amount = final;
        dispatch(EditClaim(cl));
    }

    function handleClaimSubmit() {
        if (cl.amount > user.remainingClaim || cl.amount <= 0) {
            alert("Amount is too large!");
        } else if (cl.eventDateBool == false) {
            alert("Your event must be more than a week away");
        }
        else {
            computerFinalCost();
            user.myClaims.push(cl);
            user.remainingClaim = user.remainingClaim - cl.amount;
            userService.submitClaim(user).then(() => {
                userService.getUserById(user.supervisor).then((sup) => {
                    sup.myReviews.push(cl);
                    updateReviewer(sup);
                    updateCurrentUser(user);
                    dispatch(getUser(user));
                    history.push("/:user.name");
                    switch (cl.type) {
                        case ("University Course"):
                            alert("University courses are allowed 80% refund, your total refunded is $" + cl.amount);
                            break;
                        case ("Certification"):
                            alert("Certifications are allowed 100% refund, your total refunded is $" + cl.amount);
                            break;
                        case ("Seminar"):
                            alert("Seminars are allowed 60% refund, your total refunded is $" + cl.amount);
                            break;
                        case ("Certification Prep Course"):
                            alert("Cert Prep Courses are allowed 75% refund, your total refunded is $" + cl.amount);
                            break;
                        case ("Technical Training"):
                            alert("Technical Training is allowed 90% refund, your total refunded is $" + cl.amount);
                            break;
                        case ("Other"):
                            alert("Other Activities are limited to 30% refund, your total refunded is $" + cl.amount);
                            break;
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
                cl = new Claim(0, "na", false, "na", "na");
                history.push("/:user.name")
                alert("Claim Failed");
            });

        }
    }

    function handleFormInput(e: SyntheticEvent) {
        let c: Claim = { ...cl }
        c.creationDate = new Date(Date.now());
        if ((e.target as HTMLInputElement).name === 'eventName') {
            c.event = (e.target as HTMLInputElement).value;
        } else if ((e.target as HTMLInputElement).name === 'amountRequested') {
            c.amount = parseInt((e.target as HTMLInputElement).value);
        } else if ((e.target as HTMLInputElement).name === 'dateInput') {
            c.eventDate = new Date((e.target as HTMLInputElement).value);
            const diffTime = Math.abs(c.creationDate.getTime() - c.eventDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log("Difference in days:");
            console.log(diffDays);
            if (diffDays < 7) {
                c.eventDateBool = false;
            } else if (diffDays >= 7 && diffDays < 14) {
                c.eventDateBool = true;
                c.priority = "Urgent";
            } else {
                c.eventDateBool = true;
                c.priority = "Routine";
            }

        } else if ((e.target as HTMLInputElement).name === 'descriptionInput') {
            c.description = (e.target as HTMLInputElement).value;
        }
        c.reviewer = user.supervisor;
        c.status = `With ${user.supervisor}`;
        c.originator = user.name;
        c.notes = "None";
        console.log(c);
        dispatch(EditClaim(c));
    }

    function handleOptionInput(e: SyntheticEvent) {
        let c: Claim = { ...cl }
        if ((e.target as HTMLInputElement).name === 'eventtype') {
            c.type = (e.target as HTMLInputElement).value;
        }
        cl.type = c.type
        dispatch(EditClaim(cl));
        console.log(cl.type);

    }

    return (
        <div className='Claim_Card'>
            <select name="eventtype" onChange={handleOptionInput}>
                <option></option>
                <option value="University Course">University Course</option>
                <option value="Seminar">Seminar</option>
                <option value="Certification">Certification</option>
                <option value="Certification Prep Course">Certification Prep Course</option>
                <option value="Technical Training">Technical Training</option>
                <option value="Other">Other</option>
            </select>
            <div id='eventName'>Event Name: <input type='text' className='form-control' onChange={handleFormInput} name='eventName' /></div>
            <br />
            <p>Event Date:</p>
            <input name="dateInput" type="date" onChange={handleFormInput}></input>
            <br />
            <br />
            <div>Course Cost: <input type='number' className='form-control' onChange={handleFormInput} name='amountRequested' /></div>
            <div>Description of Event: <input type='text' className='form-control' onChange={handleFormInput} name='descriptionInput' /></div>
            <button className='btn btn-danger' id="subBut" onClick={handleClaimSubmit} >Submit Form</button>
            <Route
                exact
                path='/:user.name'
                component={UserDetailComponent}
            />
        </div>

    );
}
