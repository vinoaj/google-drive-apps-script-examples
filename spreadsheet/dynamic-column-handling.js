
/**
 * @fileoverview Pattern for handling columns based on names rather than 
 *     indices. Allows users to re-arrange columns in their sheets without 
 *     affecting the functionality of the apps script.
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */

/**
 * @constant METADATA Stores information about our columns
 * headerName refers to the label given to the column in the sheet
 * columnIx refers to the column index (will be determined 
 *     by generateColumnIndices())
 */
var METADATA = {
  URL_SOURCE: {
    headerName: 'Plain URL',
    columnIx: 0
  },
  URL_ADVERTISING: {
    headerName: 'Advertising URL',
    columnIx: 0
  },
  UTM_SOURCE: {
    headerName: 'source',
    columnIx: 0
  },
  UTM_MEDIUM: {
    headerName: 'medium',
    columnIx: 0
  },
  UTM_CAMPAIGN: {
    headerName: 'campaign',
    columnIx: 0
  },
  UTM_TERM: {
    headerName: 'term',
    columnIx: 0
  },
  UTM_CONTENT: {
    headerName: 'content',
    columnIx: 0
  }
};


var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheet = spreadsheet.getActiveSheet();

/**
 * Entry point
 */
function init() {
  generateColumnIndices();
  generateURLs();
}


/**
 * Determines the column indices for all of the data dimensions in METADATA
 */
function generateColumnIndices() {
  var headerRow = getHeaderRow(sheet);
  
  for (var key in METADATA) {
    var metadata = METADATA[key];
    var headerName = metadata.headerName;
    METADATA[key].columnIx = headerRow.indexOf(headerName) + 1;
  }
}


/**
 * Example function that fetches values by referencing a column ID rather than
 *     a column's index
 */
function generateURLs() {
  var dataRange = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataRange.length; i++) {
    var dataRow = dataRange[i];

    var url = dataRow[METADATA.URL_SOURCE.columnIx-1];
    var source = dataRow[METADATA.UTM_SOURCE.columnIx-1];
    var medium = dataRow[METADATA.UTM_MEDIUM.columnIx-1];
    var campaign = dataRow[METADATA.UTM_CAMPAIGN.columnIx-1];
    var term = dataRow[METADATA.UTM_TERM.columnIx-1];
    var content = dataRow[METADATA.UTM_CONTENT.columnIx-1];
    
    Logger.log(url, source, medium, campaign, term, content);
  }
}


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
 * Append a row to the spreadsheet based on an object of key-value pairs
 * @param {Sheet} sheet Sheet to append data to
 * @param {Object} dataObj JSON object of key-value pairs to append to the sheet
 */
function appendRowObject(sheet, dataObj) {
  var rowData = new Array(dataObj.length);

  for (var key in dataObj) {
    rowData[METADATA[key].columnIx-1] = dataObj[key];
  }
  
  appendRow(sheet, rowData);
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