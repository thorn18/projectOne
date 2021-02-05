"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateOneWeek = exports.Claim = void 0;
var Claim = /** @class */ (function () {
    function Claim(id, amount, event, eventDate) {
        if (amount === void 0) { amount = 0; }
        if (event === void 0) { event = ''; }
        this.id = new Date().toLocaleString();
        this.amount = amount;
        this.event = event;
        this.eventDate = eventDate;
    }
    return Claim;
}());
exports.Claim = Claim;
function isDateOneWeek(dateRecieved, dateOfEvent) {
    var Difference_In_Time = dateOfEvent.getTime() - dateRecieved.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 7) {
        return false;
    }
    else {
        return true;
    }
}
exports.isDateOneWeek = isDateOneWeek;
