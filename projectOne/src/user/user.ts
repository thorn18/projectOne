/*Group 2: Introduce the ability to register a user.
As a user, I can register as a customer with a starting amount of money.
*/

import { Claim } from '../claims/claim';
import logger from '../log';
import userService from './user.service';

export class User {
    public role: string = 'Customer';
    public remainingClaim:number;
    public myClaims:Claim[];
    public myReviews:Claim[];
    public supervisor:string;
    constructor(public name: string, public password: string, supervisor:string, role:string, remainingClaim:number,myClaims:Claim[], myReviews:Claim[]) {
        this.role = role;
        this.remainingClaim = remainingClaim;
        this.myClaims = myClaims;
        this.supervisor = supervisor;
        this.myReviews = myReviews;
    };
}

export async function login(name: string, password: string): Promise<User|null> {
    //logger.debug(`${name +' '+ password}`);
    return await userService.getUserByName(name).then((user)=> {
        if (user && user.password === password) {
            return user
        } else {
            return null;
        }
    })
}

export async function updateUserRemaining(user: User) {
    return await userService.updateUserRemaining(user).then((success) => {
        logger.info('user updated successfully');
    }).catch((error) => {
        logger.warn('user not updated');
    });
}

export async function updateUserClaims(user: User) {
    return await  userService.updateUserClaims(user).then((success) => {
        logger.info('user updated successfully');
    }).catch((error) => {
        logger.warn('user not updated');
    });
}