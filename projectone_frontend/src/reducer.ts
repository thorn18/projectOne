import * as Actions from './actions';
import { User } from './user/user';
import { Claim } from './claims/claim'

// Define the items that are in our state
export interface ClaimState {
    // The list of all restaurants, loaded from the db.
    myClaims: Claim[];
    // The specific restaurant we have selected for view, edit, or add
    Claim: Claim;
    myReviewClaims: Claim[];
}
export interface UserState {
    tempclaim: any;
    user: User;
    loginUser: User;
}
export interface AppState extends UserState, ClaimState { }

// We need to define the initial state of the application and that
// state should include everything that the application might keep track of.

const initialState: AppState = {
    user: new User(),
    loginUser: new User(),
    myClaims: [],
    Claim: new Claim(0, "na", false, "na", "na"),
    myReviewClaims: [],
    tempclaim: undefined
}

// Make sure that the reducer has a default argument of the inital state or it will not work.
const reducer = (state: AppState = initialState, action: Actions.AppAction): AppState => {
    // We want to call setState. (redux will do that when we return a new state object from the reducer)
    const newState = { ...state }; // If we return this, it will re render the application. (call setState)
    switch (action.type) {
        case Actions.UserActions.GetMyClaims:
            newState.user = action.payload as User;
            return newState;
        case Actions.UserActions.getTempClaim:
            newState.tempclaim = action.payload as User;
            return newState;
        case Actions.UserActions.GetReviewClaims:
            newState.user = action.payload as User;
            return newState;
        case Actions.ClaimActions.EditClaim:
            newState.Claim = action.payload as Claim;
            return newState;
        case Actions.UserActions.GetUser:
            newState.user = action.payload as User;
            return newState;
        case Actions.UserActions.LoginChange:
            newState.loginUser = action.payload as User;
            return newState;
        default:
            return state;
    }
}

export default reducer;