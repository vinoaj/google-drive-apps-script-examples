/**
 * @fileoverview Transform data in a Range
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */

/**@const */ var RE_CLEANUP = /undefined|NOT_FOUND/g
/**@const */ var SOURCE_SHEET_NAME = 'Sheet1';


var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = spreadsheet.getSheetByName(SOURCE_SHEET_NAME);
var dataRange = spreadsheet.getDataRange();
var dataValues = dataRange.getValues();


//Replace instances of "undefined" and "NOT_FOUND" with an empty string
var cleanedValues = substituteValues(dataValues, RE_CLEANUP, "");
dataRange.setValues(cleanedValues);

/**
 * Trim text in a given column
 * @param {sheetName} sheet name
 * @param {column} column letter
 */

function trimValues(sheetName, column) {
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
 var columnRange = column + ':' + column;
 var values = sheet.getRange(columnRange);

 var numRows = values.getNumRows();
 for (var i = 1; i <= numRows; i++) {
   var currentValue = values.getCell(i,1).getValue();
   var withString = currentValue.trim();
   values.getCell(i,1).setValue(withString);
 }

}

/**
* Replace values in an 2D array
* @param {array} 2D array to be transformed
* @param {re} regular expression to evaluate in the existing data
* @param {string} replacement string
*/
function substituteValues(arr, re, replacement) {
  for (var row in arr) {
   var replacedVals = arr[row].map(function(origVal) {
     return origVal.replace(re, replacement);
   });

   arr[row] = replacedVals;
 }

 return arr;
}
