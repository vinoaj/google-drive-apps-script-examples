/**
 * @fileoverview Utility functions for working with Google Sheets
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */


/**
 * Get the header row for a sheet
 * @param {Sheet} sheet Sheet that the header row will be read from
 * @param {number} rowIx Row index of the header. Defaults to 1 (first row).
 */
function getHeaderRow(sheet, rowIx) {
    rowIx = rowIx || 1;
    var headerRow = sheet.getRange(rowIx, 1, 1, sheet.getLastColumn());
    return headerRow.getValues()[0];
}


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
 * Sets the value for a given cell
 * @param {object} value The value to be inserted into the cell
 * @param {Sheet} sheet The sheet which contains the cell
 * @param {number} rowIx Row position - 1-based numbering
 * @param {number} colIx Column position - 1-based numbering
 */
function setCellValue(value, sheet, rowIx, colIx) {
    sheet.getRange(rowIx, colIx).setValue(value);
}


/**
 * Deletes all data from a sheet except for the header row
 * @param {Sheet} sheet The sheet which contains the cell
 * @param {number} rowIx Header row's position - 1-based numbering
 */
function deleteData(sheet, rowIx) {
    rowIx = rowIx || 1;
    var dataRange = sheet.getDataRange();
    var nRows = dataRange.getNumRows();

    dataRangeToClear = sheet.getRange(rowIx + 1, 1, nRows - rowIx, 
        sheet.getLastColumn());

    // clearContent() maintains the formatting in the data range's cells
    dataRangeToClear.clearContent();
}


/**
 * Deletes a sheet's rows based on whether a mark (e.g. "x") exists in a defined
 *   column in that row
 * @param {Sheet} sheet The sheet from which to delete marked rows
 * @param {number} colIx The column to scan - 1-based numbering
 * @param {number} mark The mark to look for
 */
function deleteMarkedRows(sheet, colIx, mark) {
    var data = sheet.getDataRange().getValues();

    // Iterate through the data in reverse order
    for (var r = data.length - 1; r > -1; r--) {
      var cellData = data[r][colIx-1];
      if (cellData && cellData == mark) {
        sheet.deleteRow(r + 1);
      }
    }
  }


/**
* Unhides all hidden rows in a sheet.
* @param {Sheet} sheet Sheet that row will be appended to
*/
function unhideAllRows(sheet) {
    dataRangeValues = sheet.getDataRange().getValues();
    var nRows = dataRangeValues.length;
    sheet.showRows(1, nRows);
}

/**
 * Remove filter on column X in a given sheet
 * Adapted from http://vnjv.co/2nJgBKt (Author unknown)
 * @param {Spreadsheet} spreadsheet 
 * @param {Sheet} sheet 
 * @param {number} colIx 
 */
function clearFilterOnColumn(spreadsheet, sheet, colIx) {
    var filterSettings = {};

    // Look at the entire sheet's data
    // To restrict data use additional parameters as documented at 
    //    https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#GridRange
    filterSettings.range = {
        sheetId: sheet.getSheetId()
    };

    // Helpful documentation: 
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#SetBasicFilterRequest
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#BasicFilter
    // https://developers.google.com/sheets/api/reference/rest/v4/FilterCriteria  
    filterSettings.criteria = {};

    // Don't hide anything
    filterSettings.criteria[colIx] = {
        'hiddenValues': []
    };

    var request = {
        "setBasicFilter": {
            "filter": filterSettings
        }
    };

    Sheets.Spreadsheets.batchUpdate(
        { 'requests': [request] }, spreadsheet.getId()
    );
}