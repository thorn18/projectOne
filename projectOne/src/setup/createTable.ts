import * as AWS from 'aws-sdk';
import userService from '../user/user.service';
//import restaurantService from '../restaurant/restaurant.service';

// Set the region
AWS.config.update({ region: 'us-west-2' });

// Create a DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const removeUsers = {
    TableName: 'users'
}

const userSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'name',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'name',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'users',
    StreamSpecification: {
        StreamEnabled: false
    }
};

ddb.deleteTable(removeUsers, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(userSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateUserTable();
                }, 10000);
            }
        });
    }, 5000);
});

function populateUserTable() {
    userService.addUser({name: 'Tyler', password: '1234', supervisor: 'Peter', role: 'benco', remainingClaim: 1000, myClaims: [], myReviews: []}).then(()=>{});
    userService.addUser({name: 'Peter', password: '1234', supervisor: 'Tyler', role: 'benco', remainingClaim: 1000, myClaims: [], myReviews: []}).then(()=>{});
    userService.addUser({name: 'Batman', password: '1234', supervisor: 'Tyler', role: 'dephead', remainingClaim: 1000, myClaims: [], myReviews: []}).then(()=>{});
    userService.addUser({name: 'Ahri', password: '1234', supervisor: 'Batman', role: 'sechead', remainingClaim: 1000, myClaims: [], myReviews: []}).then(()=>{});
    userService.addUser({name: 'SteveJobs', password: '1234', supervisor: 'Ahri', role: 'basic', remainingClaim: 1000, myClaims: [], myReviews: []}).then(()=>{});
}