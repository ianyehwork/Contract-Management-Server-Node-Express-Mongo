/**
 * Convert date and time to milisecond since January 01 1970
 * @param {*} date MM/DD/YYYY
 * @param {*} time hh:mmAM or hh:mmPM
 * @returns number in milisecond since January 01 1970
 */
const convertDateTimeToNumber = (date, time) => {
    var date_component = date.split("/");
    // JavaScript counts months from 0 to 11. January is 0. December is 11
    var month = parseInt(date_component[0]) - 1;
    var day = parseInt(date_component[1]);
    var year = parseInt(date_component[2]);

    var time_indicator = time.substr(time.length - 2);
    var time_component = time.substr(0, time.length - 2).split(":");
    var hour = parseInt(time_component[0]);
    if (time_indicator === 'PM' && hour !== 12) {
        hour += 12;
    }
    var minute = parseInt(time_component[1])

    var d = new Date(year, month, day, hour, minute, 0, 0);
    return d.getTime();t
}

/**
 * Generate the random alpha numeric token with the specified length
 * @param {*} length the lenght of the token
 */
const generateRandomToken = (length) => {
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

module.exports = {
    convertDateTimeToNumber,
    generateRandomToken
};