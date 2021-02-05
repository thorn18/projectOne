export class Claim {
    id: string;
    amount:number;
    event:string;
    eventDateBool:boolean;
    reviewer:string;
    status:string;
    originator: string;
    notes: string;
    type:string;
    rfc:string;
    eventDate:Date;
    creationDate:Date;
    description:string;
    priority:string;
    grade:string;
    constructor(amount:number = 0, event:string = '', eventDateBool:boolean, reviewer:string,status:string) {
        this.id = generateSerial();
        this.amount = amount;
        this.event = event;
        this.eventDateBool = eventDateBool;
        this.reviewer = reviewer;
        this.status = status;
        this.originator  = "";
        this.notes = "";
        this.type = "";
        this.rfc = "";
        this.eventDate = new Date();
        this.description = "";
        this.creationDate = new Date();
        this.priority = ""
        this.grade = "";
    }
}

function generateSerial() {

    'use strict';

    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

        serialLength = 10,

        randomSerial = "",

        i,

        randomNumber;

    for (i = 0; i < serialLength; i = i + 1) {

        randomNumber = Math.floor(Math.random() * chars.length);

        randomSerial += chars.substring(randomNumber, randomNumber + 1);

    }
    return randomSerial
}

export function isDateOneWeek(dateRecieved: Date, dateOfEvent: Date){
    var Difference_In_Time = dateOfEvent.getTime() - dateRecieved.getTime(); 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
    if (Difference_In_Days > 7) {
        return false;
    } else {
        return true;
    }
}