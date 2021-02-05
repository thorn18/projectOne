import { Claim } from "../claims/claim";

export class User {
    name = '';
    password = '';
    supervisor = '';
    role?: string;
    remainingClaim:number = 1000;
    myClaims:Claim[] = [];
    myReviews:Claim[] = [];

}