import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Claim } from '../claims/claim';
import { User } from './user';

class UserService {

    private URI: string;
    constructor() {
        // URL of the express server
        this.URI = 'http://localhost:3000/users';
    }


    updateUser(user: User) {
        return axios.put(this.URI,user,{withCredentials:true}).then(result=>{
            return result.data
        }).catch((err) => {
            console.log(err); 
        });
    }
    updateSupervisor(supervisor: User) {
        return axios.put(this.URI + "/"+supervisor.name,supervisor,{withCredentials:true}).then(result=>{
            return result.data
        }).catch((err) => {
            console.log(err); 
        });
    }

    getUserById(name:string): Promise<User> {
        return axios.get(this.URI+"/"+name,{withCredentials:true}).then(result=>{
            return result.data
        }).catch((err) => {
            console.log(err); 
        });
    }


    submitClaim(user: User): Promise<User> {
        return axios.put(this.URI,user,{withCredentials:true}).then(result=>{
            return result.data
        }).catch((err) => {
            console.log(err); 
        });
    }

    getLogin(): Promise<User> {
        // withCredentials sends our cookies with the request.
        return axios.get(this.URI, {withCredentials: true}).then(result=>{
            return result.data
        }).catch((err) => {
            console.log(err);
        });
    }

    login(user: User): Promise<User> {
        return axios.post(this.URI, user, {withCredentials: true}).then(result => result.data);
    }
    logout(): Promise<null> {
        return axios.delete(this.URI, {withCredentials: true}).then(result => null);
    }
}

export default new UserService();