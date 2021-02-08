# ProjectOne
This project is a tuition reimbursment system in which employees can request to have different applicable events (like University Courses) refunded to a certain amount. These requests will be routed to different supervisors within the organization, ending up with a Benifits Coordinator for final approval.

## Technologies Used
* AWS SDK - version 2.818.0
* AWS DynamoDB
* TypeScript - version 4.0.0
* Express.js - version 4.16.1
* React
* Redux
* Axios - version 0.21.1

## Features
Current Features:
* User login and registration
* Employees can request reimbursement for an event (claim)
* Supervisors can request for comment on a claim, as can their supervisors(Department Heads) and the BenCo.
* Employees can cancel requests made to the BenCo, and All supervisors can deny a request.
*Employees can upload a grade for the BenCo to see for final approval.

Future Development:
* Allow the upload of documents like a grade sheet.
* Allow for multiple grading systems to be implemented.
* Allow BenCo to change the amount on the claim manually.

## Getting Started
Cloning the repository:
https://github.com/thorn18/projectOne.git

Back-end (p2-express):
* Directory -> cd projectOne
* Installation -> npm install
* AWS Configuration -> aws configure
* Setup DynamoDB tables -> npm run setup
* Run program -> npm run start

Front-end (reactit-native):
* Directory -> cd projectone_frontend
* Installation -> npm install
* Run program -> npm run start

Contributors
* Tyler Horn