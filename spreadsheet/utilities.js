/**
 * @fileoverview Utility functions for working with Google Sheets
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */


 /**
 * Append a new row of data to the spreadsheet
 * @param {Sheet} sheet Sheet that row will be appended to
 * @param {string[]} dataArray 1-dimensional array of data
 */
function appendRow(sheet, dataArray) {
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow + 1, 1, 1, dataArray.length);
    range.setValues([dataArray]);
}

 /**
 * Unhides all hidden rows in a sheet.
 * @param {Sheet} sheet Sheet that row will be appended to
 */
function showAllRows(sheet) {
    dataRangeValues = sheet.getDataRange().getValues();
    var nRows = dataRangeValues.length;
    sheet.showRows(1, nRows);
}