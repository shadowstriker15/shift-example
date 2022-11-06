"use strict";
Date.prototype.isMidnight = function () {
    return this.getHours() == 24 && this.getMinutes() == 0;
};
Date.prototype.getMonthNum = function () {
    let monthNum = this.getMonth() + 1;
    return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
};
Date.prototype.getDateNum = function () {
    let dateNum = this.getDate();
    return dateNum < 10 ? `0${dateNum}` : `${dateNum}`;
};
//# sourceMappingURL=date.extensions.js.map