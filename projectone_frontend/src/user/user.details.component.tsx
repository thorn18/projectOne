import React, { SyntheticEvent, useEffect, useState } from 'react';
import { UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import userService from './user.service';
import { displayUser, GetTempClaim, getUser } from '../actions';
import revlogo from "../images/revaturelogo.png"
import logo from "../images/Logo_Company.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import './userdetails.css'
import Table from 'react-bootstrap/Table';
import { useHistory } from 'react-router-dom';
import Modal from "../../node_modules/react-bootstrap/esm/Modal";
import Button from "../../node_modules/react-bootstrap/esm/Button";
import { Claim } from '../claims/claim';
import claimsService from '../claims/claims.service';
import { copyFile } from 'fs';
import { User } from './user';
import { EIDRM } from 'constants';



interface UserDetailsProps {
    match: any;
}

export default function UserDetailComponent(
    props: UserDetailsProps
) {
    const tempSelector = (state: UserState) => state.tempclaim;
    let tempclaim = useSelector(tempSelector);
    const userSelector = (state: UserState) => state.user;
    const user = useSelector(userSelector);
    const dispatch = useDispatch();
    let history = useHistory();
    populateClaimTable();

    function handleEditClick() {
        history.push('/edit')
    }

    function findClaim(id: string) {
        for (let cl of user.myClaims) {
            if (cl.id === id) {
                return cl;
            }
        }

    }

    function populateClaimTable() {
        let claimsBody = document.getElementById("claimsBody");
        if (claimsBody) {
            claimsBody.innerHTML = "";
        }
        let claims = user.myClaims;
        if (claims && claimsBody) {
            for (let c of claims) {
                let row = document.createElement('tr');
                let claim = document.createElement('td');
                let event = document.createElement('td');
                let amount = document.createElement('td');
                let reviewer = document.createElement('td');
                let status = document.createElement('td');
                let edit = document.createElement('button');
                let notes = document.createElement('td');
                claim.innerHTML = c.id;
                event.innerHTML = c.event;
                amount.innerHTML = c.amount.toString();
                reviewer.innerHTML = c.reviewer;
                status.innerHTML = c.status;
                notes.innerHTML = c.notes;
                edit.innerHTML = "Respond"
                row.appendChild(claim);
                row.appendChild(event);
                row.appendChild(amount);
                row.appendChild(reviewer);
                row.appendChild(status);
                row.appendChild(edit);
                row.appendChild(notes);
                edit.id = claim.innerHTML;
                edit.onclick = () => {
                    let z: any = findClaim(edit.id)
                    if (z) {
                        dispatch(GetTempClaim(z));
                    }
                    handleShow();
                }
                claimsBody.appendChild(row);
                if (c.status == "Awaiting Grade") {
                    edit.innerHTML = "Submit Grade";
                    edit.onclick = () => {
                        let z: any = findClaim(edit.id)
                        if (z) {
                            dispatch(GetTempClaim(z));
                        }
                        handleGradeShow();
                    }
                }
                else if (c.status != "RFC") {
                    edit.disabled = true;
                }
                dispatch(getUser(user));
            }
        }
    }

    function goToClaimForm() {
        history.push('/claimCreate');
    }
    function goToReviewForm() {
        history.push('/review');
    }

    function updateOtherUser(supervisor: User) {
        userService.updateSupervisor(supervisor);
    }

    function updateCurrentUser(user: User) {
        userService.updateUser(user);
    }

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleGradeClose = () => setShow2(false);
    const handleGradeShow = () => setShow2(true);
    const handleResendRequest = () => {
        for (let temp of user.myClaims) {
            if (temp.id === tempclaim.id) {
                temp.notes = tempclaim.notes;
                temp.status = ("With " + temp.reviewer);
                userService.getUserById(temp.reviewer).then((reviewer) => {
                    reviewer.myReviews.push(temp);
                    updateOtherUser(reviewer);
                    updateCurrentUser(user);
                    handleClose();
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    }

    function handleResponseChange(e: SyntheticEvent) {
        console.log(tempclaim);
        if (tempclaim) {
            tempclaim.notes = (e.target as HTMLInputElement).value;
            console.log(tempclaim);
        } else {
            console.log("no tempclaim");
        }
    }

    function handleRadioSelect(e: SyntheticEvent) {
        if ((e.target as HTMLInputElement).value === 'yes') {
            if ((e.target as HTMLInputElement).checked) {
                tempclaim.grade = "yes";
                console.log(tempclaim.grade)

            } else {
                tempclaim.grade = "no";
                console.log(tempclaim.grade)

            }
        } else if ((e.target as HTMLInputElement).value === 'no') {
            if ((e.target as HTMLInputElement).checked) {
                tempclaim.grade = "no";
                console.log(tempclaim.grade)

            } else {
                tempclaim.grade = "yes";
                console.log(tempclaim.grade)
            }
        }
    }
    function handleRadioSubmit() {
        for (let temp of user.myClaims) {
            if (temp.id === tempclaim.id) {
                temp.notes = tempclaim.notes;
                temp.status = ("With " + temp.reviewer);
                temp.grade = tempclaim.grade;
                userService.getUserById(temp.reviewer).then((reviewer) => {
                    reviewer.myReviews.push(temp);
                    updateOtherUser(reviewer);
                    updateCurrentUser(user);
                    handleGradeClose();
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    }

    return (
        <div id="inclusive">
            <img id="revlogo1" src={revlogo} />
            <img id="revlogo2" src={revlogo} />
            <img id="revlogo3" src={revlogo} />
            <img id="revlogo4" src={revlogo} />
            <img id="image" src={logo} />
            <div id="userdet">
                <button id="sClaim" onClick={goToClaimForm}>Submit a Claim</button>
                {user.role === "sechead" || user.role === "dephead" || user.role === "benco" ? (
                    <button id="rClaim" onClick={goToReviewForm}>Review a Claim</button>
                ) : (
                        <span></span>
                    )}
                <p id="userIntro">Welcome {user.name}</p>

                <p >Your Immediate Supervisor: {user.supervisor}</p>
                <div id="claimsContainer"></div>
                <h3 >Amount available to claim: ${user.remainingClaim}</h3>
                <h3 id="cTitle">My Claims:</h3>
                <Table striped bordered hover variant="dark" id="cTable">
                    <thead>
                        <tr>
                            <th>Claim #</th>
                            <th>Event</th>
                            <th>Amount</th>
                            <th>Reviewer</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody id="claimsBody">
                        <tr>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <div id="leftBanners">
                {user.role === "basic" ? (
                    <div id="basicBannerL">Employee</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "sechead" ? (
                    <div id="secBannerL">SecHead</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "dephead" ? (
                    <div id="depBannerL">DepHead</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "benco" ? (
                    <div id="bencoBannerL">Benco</div>
                ) : (
                        <span></span>
                    )}
            </div>
            <div id="rightBanners">
                {user.role === "basic" ? (
                    <div id="basicBannerR">Employee</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "sechead" ? (
                    <div id="secBannerR">SecHead</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "dephead" ? (
                    <div id="depBannerR">DepHead</div>
                ) : (
                        <span></span>
                    )}
                {user.role === "benco" ? (
                    <div id="bencoBannerR">Benco</div>
                ) : (
                        <span></span>
                    )}
            </div>
            <div id='EditClaimContainer'>
                <div id="modalDevider">
                    <Modal id="editModal" show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Request for Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Please input your response here.</p>
                            <input onChange={handleResponseChange} name="responseVariable" type="text"></input>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
          </Button>
                            <Button variant="primary" onClick={handleResendRequest}>
                                Resend to Requestor
          </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div id="modalGradeDevider">
                    <Modal id="gradeModal" show={show2} onHide={handleGradeClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Did you pass your course?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <p>Yes</p>
                                <input type="radio" value = "yes" name="rad" onChange={handleRadioSelect}></input>
                                <p>no</p>
                                <input type="radio" value = "no" name="rad" onChange={handleRadioSelect}></input>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleGradeClose}>
                                Close
          </Button>
                            <Button variant="primary" onClick={handleRadioSubmit}>
                                Resend to Requestor
          </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>

        </div>


    )
}
