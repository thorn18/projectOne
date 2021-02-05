import {Claim} from './claims/claim';
import {User} from './user/user';

export enum ClaimActions {
    GetClaims = 'GET_CLAIMS',
    EditClaim = 'EDIT_CLAIM',
}


export enum UserActions {
    GetUser = 'GET_USER',
    LoginChange = 'CHANGE_LOGIN',
    DisplayUser = 'DISPLAY_USER',
    GetReviewClaims = "GetReviewClaims",
    GetMyClaims = "GetMyClaims",
    getTempClaim = "getTempClaim"
}

export interface AppAction {
    type: string;
    payload: any;
}

export interface UserAction extends AppAction {
    type: UserActions;
    payload: User;
}

// All of our restaurant actions need to follow this interface.
export interface ClaimAction extends AppAction {
    type: ClaimActions;
    payload: Claim | Claim[];
}

export function getMyClaims(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetMyClaims,
        payload: user
    }
    return action;
}

export function getReviewClaims(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.GetReviewClaims,
        payload: user
    }
    return action;
}

export function EditClaim(cl: Claim): ClaimAction {
    const action: ClaimAction = {
        type: ClaimActions.EditClaim,
        payload: cl
    }
    return action;
}

export function GetTempClaim(claim: any): UserAction {
    const action: UserAction = {
        type: UserActions.getTempClaim,
        payload: claim
    }
    return action;
}


export function getUser(user: User): UserAction {
    console.log("Get User Called:");
    console.log(user);
    const action: UserAction = {
        type: UserActions.GetUser,
        payload: user
    }
    return action;
}



export function loginAction(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.LoginChange,
        payload: user
    }
    return action;
}

export function displayUser(user: User): UserAction {
    const action: UserAction = {
        type: UserActions.DisplayUser,
        payload: user
    }
    return action;
}

