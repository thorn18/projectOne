import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { ClaimState, UserState } from '../reducer';
import { useDispatch, useSelector } from 'react-redux';
import { EditClaim, getUser } from '../actions';
import { Claim } from './claim';
import './claimreview.css'
import userService from '../user/user.service';
import { User } from '../user/user';
import { send } from 'process';
import { notStrictEqual } from 'assert';

interface ClaimCreationProps {
    match: any;
}

export default function ClaimReviewComponent(
) {
    const claimSelector = (state: ClaimState) => state.Claim;
    let cl = useSelector(claimSelector);
    const user = useSelector((state: UserState) => state.user);
    let approved = false;
    const dispatch = useDispatch();
    const history = useHistory();
    dispatch(getUser(user));
    populateReviewTable(user);
    function updateOtherUser(supervisor: User) {
        userService.updateSupervisor(supervisor);
    }

    function updateCurrentUser(user: User) {
        userService.updateUser(user);
    }

    function handleClaimApproval(claim: Claim) {
        //If on final stage of approval.
        if (user.role == "benco") {
            console.log("Final Stage of Approval");
            userService.getUserById(claim.originator).then((original) => {
                let index2 = -1;
                for (let t of original.myClaims) {
                    if (t.id === claim.id) {
                        index2 = original.myClaims.indexOf(t);
                    }
                }
                if (original.myClaims[index2]) {
                    console.log("Index FOund");
                    original.myClaims[index2].status = "Awaiting Grade";
                    updateOtherUser(original);
                    let index = (user.myReviews).indexOf(claim);
                    user.myReviews.splice(index, 1);
                    updateCurrentUser(user);
                    dispatch(getUser(user));
                } else {
                    alert("DID NOT PROPERLY FINALIZE CLAIM");
                }
                history.push("/:user.name");
            }).catch((err) => {
                console.log(err);
            })
        } else {
            userService.getUserById(user.supervisor).then((sup) => {
                userService.getUserById(claim.originator).then((original) => {
                    let index2 = -1;
                    for (let v of original.myClaims) {
                        if (v.id === claim.id) {
                            index2 = original.myClaims.indexOf(v);
                        }
                    }
                    let index = (user.myReviews).indexOf(claim);
                    original.myClaims[index2].reviewer = sup.name;
                    original.myClaims[index2].status = "With " + sup.name;
                    user.myReviews[index].reviewer = sup.name;
                    user.myReviews[index].status = "With " + sup.name;
                    sup.myReviews.push(user.myReviews[index]);
                    user.myReviews.splice(index, 1);
                    updateOtherUser(original);
                    updateOtherUser(sup);
                    updateCurrentUser(user);
                    dispatch(getUser(user));
                    history.push("/:user.name");
                })
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    function handleClaimRejection(claim: Claim) {
        userService.getUserById(claim.originator).then((original) => {
            let index2 = -1;
            for (let t of original.myClaims) {
                if (t.id === claim.id) {
                    index2 = original.myClaims.indexOf(t);
                }
            }
            if (original.myClaims[index2]) {
                original.myClaims[index2].notes = cl.notes;
                original.myClaims[index2].status = "Rejected";
                original.remainingClaim += original.myClaims[index2].amount;
                updateOtherUser(original);
                let index = (user.myReviews).indexOf(claim);
                user.myReviews.splice(index, 1);
                updateCurrentUser(user);
            } else {
                alert("DID NOT PROPERLY FINALIZE CLAIM");
            }
            history.push("/:user.name");
        }).catch((err) => {
            console.log(err);
        });
    }
    function handleClaimSendBack(claim: Claim) {
        userService.getUserById(claim.originator).then((original) => {
            let index2 = -1;
            for (let t of original.myClaims) {
                if (t.id === claim.id) {
                    index2 = original.myClaims.indexOf(t);
                }
            }
            if (original.myClaims[index2]) {
                original.myClaims[index2].status = "RFC";
                original.myClaims[index2].notes = cl.notes;
                original.myClaims[index2].rfc = user.name;
                original.remainingClaim += original.myClaims[index2].amount;
                updateOtherUser(original);
                let index = (user.myReviews).indexOf(claim);
                user.myReviews.splice(index, 1);
                updateCurrentUser(user);
            } else {
                alert("DID NOT PROPERLY FINALIZE CLAIM");
            }
            history.push("/:user.name");
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleNotes(notes: HTMLInputElement, reject: any, sendback: any) {
        console.log("Handled");
        if (notes.value === "") {
            sendback.disabled = true;
            console.log("True");
            reject.disabled = true;
        } else {
            sendback.disabled = false;
            console.log("false");
            reject.disabled = false;
        }
        cl.notes = notes.value;
        console.log("Value of notes: " + cl.notes);
        dispatch(EditClaim(cl));

    }

    function triggerSuccess(cl: Claim) {
        userService.getUserById(cl.originator).then((original) => {
            let index2 = -1;
            for (let t of original.myClaims) {
                if (t.id === cl.id) {
                    index2 = original.myClaims.indexOf(t);
                }
            }
            if (original.myClaims[index2]) {
                console.log("Index Found");
                original.myClaims[index2].status = "Finalized";
                updateOtherUser(original);
                let index = (user.myReviews).indexOf(cl);
                user.myReviews.splice(index, 1);
                updateCurrentUser(user);
                dispatch(getUser(user));
            } else {
                alert("DID NOT PROPERLY FINALIZE CLAIM");
            }
            history.push("/:user.name");
        }).catch((err) => {
            console.log(err);
        })

    }
    function triggerFail(cl: Claim) {
        userService.getUserById(cl.originator).then((original) => {
            let index2 = -1;
            for (let t of original.myClaims) {
                if (t.id === cl.id) {
                    index2 = original.myClaims.indexOf(t);
                }
            }
            if (original.myClaims[index2]) {
                original.myClaims[index2].notes = cl.notes;
                original.myClaims[index2].status = "Rejected";
                original.remainingClaim += original.myClaims[index2].amount;
                updateOtherUser(original);
                let index = (user.myReviews).indexOf(cl);
                user.myReviews.splice(index, 1);
                updateCurrentUser(user);
            } else {
                alert("DID NOT PROPERLY FINALIZE CLAIM");
            }
            history.push("/:user.name");
        }).catch((err) => {
            console.log(err);
        });
    }

    function populateReviewTable(usertemp: User) {
        console.log("review temp user:");
        console.log(usertemp);
        let reviewCont = document.getElementById("ReviewContainer");
        if (reviewCont) {
            reviewCont.innerHTML = "";
        }
        let myReviews = usertemp.myReviews;
        if (myReviews && reviewCont) {
            for (let review of myReviews) {
                if (review.grade === "") {
                    let cont = document.createElement('div');
                    let claim = document.createElement('p');
                    let event = document.createElement('p');
                    let eventDate = document.createElement('p');
                    let creationDate = document.createElement('p');
                    let eventD = document.createElement('p');
                    let amount = document.createElement('p');
                    let status = document.createElement('p');
                    let origin = document.createElement('p');
                    let noteofnotes = document.createElement('p');
                    let noteDescription = document.createElement('p');
                    let notes = document.createElement('input');
                    let approve = document.createElement('button');
                    let deny = document.createElement('button');
                    let sendBack = document.createElement('button');
                    let urgent = document.createElement('p');

                    urgent.style.borderStyle = "inset";
                    urgent.style.border = "inset";
                    urgent.style.borderWidth = "3px"
                    urgent.innerText = "URGENT"
                    urgent.style.fontSize = "20px"
                    urgent.style.position = "relative";
                    urgent.style.width = "100px";
                    urgent.style.height = "40px";
                    urgent.style.backgroundColor = "Orange";



                    notes.type = "text";
                    noteDescription.style.textAlign = "left";
                    noteDescription.style.position = "relative";
                    noteDescription.style.color = "orange";
                    noteDescription.style.left = "50px";
                    sendBack.disabled = true;

                    notes.className = "notesfield"
                    cont.className = "reviewCard";
                    approve.className = "rButtonClass"
                    deny.className = "rButtonClass"
                    sendBack.className = "rButtonClass"

                    if (approve && review) {
                        approve.onclick = () => {
                            handleClaimApproval(review);
                        }
                    }

                    if (deny && review) {
                        deny.onclick = () => {
                            handleClaimRejection(review);
                        }
                    }

                    if (sendBack && review) {
                        sendBack.onclick = () => {
                            handleClaimSendBack(review);
                        }
                    }


                    noteDescription.innerHTML = "Comments to User:";
                    approve.innerHTML = "Approve";
                    deny.innerHTML = "Deny";
                    deny.id = 'denybutton';
                    sendBack.innerHTML = "Send Back for Edits";
                    claim.innerHTML = "Claim ID: " + review.id;
                    event.innerHTML = "Event: " + review.event;
                    eventD.innerHTML = "Event Description: " + review.description;
                    amount.innerHTML = "Reimburse Requested:  $" + review.amount.toString();
                    origin.innerHTML = "Originator: " + review.originator;
                    status.innerHTML = "Status of Claim: " + review.status;
                    notes.innerHTML = review.notes;
                    noteofnotes.innerText = "User notes: " + review.notes;
                    event.style.color = "Lime";
                    eventD.style.color = "Lime";
                    amount.style.color = "Lime";
                    origin.style.fontSize = "20px";
                    origin.style.color = "Maroon";

                    eventDate.innerText = "Event Date:" + (new Date(review.eventDate).toDateString());
                    creationDate.innerText = "Creation Date:" + (new Date(review.creationDate).toDateString());

                    notes.oninput = () => {
                        handleNotes(notes, deny, sendBack);
                    }
                    deny.disabled = true;

                    {
                        if (review.priority === "Urgent") {
                            cont.appendChild(urgent);
                        }
                    }
                    cont.appendChild(origin);
                    cont.appendChild(claim);
                    cont.appendChild(event);
                    cont.appendChild(eventDate);
                    cont.appendChild(creationDate);
                    cont.appendChild(eventD);
                    cont.appendChild(amount);
                    cont.appendChild(status);
                    cont.appendChild(noteofnotes);
                    cont.appendChild(noteDescription);
                    cont.appendChild(notes);
                    cont.appendChild(approve);
                    cont.appendChild(deny);
                    cont.appendChild(sendBack);
                    reviewCont.appendChild(cont);
                    dispatch(getUser(user));
                } else if (review.grade === "yes" || review.grade === "no") {
                let container = document.createElement('div');
                let text = document.createElement('p');
                let approve = document.createElement('button');
                let deny = document.createElement('button');

                

                
                text.innerHTML = "Did student pass the class? : " + review.grade;
                approve.innerHTML = "Approve";
                deny.innerHTML = "Disprove";
                approve.onclick = () => {triggerSuccess(review)};
                deny.onclick = () => {triggerFail(review)};

                container.appendChild(text);
                container.appendChild(approve);
                container.appendChild(deny);
                container.appendChild(document.createElement("p"));
                reviewCont.appendChild(container);
                }
                
            }
        }
    }

    
    return (
        <div id='ReviewContainer'>
        </div>
    
    );
}