/**
 * @fileoverview Utility functions for working with Google Apps Scripts
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 */

 /**
 * Convert a Date object to a string of format "YYYY-MM-DD"
 * @param {Date} dateObj Date object
 * @returns {string} of format "YYYY-MM-DD"
 */
function generateYYYYMMDDDateStr(dateObj) {
    return [dateObj.getFullYear(), dateObj.getMonth()+1, dateObj.getDate()].join('-');
}