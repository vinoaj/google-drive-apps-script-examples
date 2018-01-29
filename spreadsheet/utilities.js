/**
 * @fileoverview Utility functions for working with Google Sheets
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 */


 /**
 * Append a new row of data to the spreadsheet
 * @param {Sheet} sheetRef Sheet that row will be appended to
 * @param {string[]} dataArray 1-dimensional array of data
 */
function appendRow(sheetRef, dataArray) {
    var lastRow = sheetRef.getLastRow();
    var range = sheetRef.getRange(lastRow + 1, 1, 1, dataArray.length);
    range.setValues([dataArray]);
}
