import './home.css'
// import AddClaimComponent from './claims/add-claim-component';
// import EditClaimComponent from './claims/edit-claim.component';
import logo from "./images/Logo_Company.png"
import revlogo from "./images/revaturelogo.png"

export default function HomeComponent() {
    return (
        <div>
            <img id = "revlogo1" src = {revlogo}/>
            <img id = "revlogo2" src = {revlogo}/>
            <img id = "revlogo3" src = {revlogo}/>
            <img id = "revlogo4" src = {revlogo}/>
            <img id = "image" src = {logo}/>
            <div id = "HomePage">
            </div>
            <div id = "intro">*We are an expert, specialized division of Revature, dedicated
            to making sure that you, our loyal employees are getting the reimbursment for any
            courses that we support*. </div>
            <p id = "tag">*We are a subsidiary of Revature</p>
        </div>


    )
}
