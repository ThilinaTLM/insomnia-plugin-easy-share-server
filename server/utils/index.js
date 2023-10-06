/**
 * Utils
 * @param messages
 */
const log = (...messages) => console.log(new Date(), ...messages)
const date_diff_in_minute = (date1, date2) => Math.abs(Math.floor((date1 - date2)/60_000));


//export the utility functions for use in utils
module.exports = {log, date_diff_in_minute};