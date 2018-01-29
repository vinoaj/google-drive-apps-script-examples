/**
 * @fileoverview Manage Google Drive files and folders
 * @author vinoaj@vinoaj.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */

/**@const */ var SHEET_NAME_SETTINGS = 'Settings';
/**@const */ var RANGENAME_CLIENT_NAME = 'clientName';
/**@const */ var RANGENAME_CONTINUATION_TOKEN_FILE = 'FileIteratorContinuationToken';
/**@const */ var RANGENAME_CONTINUATION_TOKEN_FOLDER = 'FolderIteratorContinuationToken';
/**@const */ var RANGENAME_FOLDER_SOURCE_ID = 'folderSourceId';
/**@const */ var RANGENAME_FOLDER_TARGET_ID = 'folderTargetId';

var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
var sheetSettings = spreadsheet.getSheetByName(SHEET_NAME_SETTINGS);
var fileIteratorContinuationTokenRange = 
      sheetSettings.getRange(RANGENAME_CONTINUATION_TOKEN_FILE);
var folderIteratorContinuationTokenRange = 
      sheetSettings.getRange(RANGENAME_CONTINUATION_TOKEN_FOLDER);
var folderSourceId = sheetSettings.getRange(RANGENAME_FOLDER_SOURCE_ID).getValue();
var folderTargetId = sheetSettings.getRange(RANGENAME_FOLDER_TARGET_ID).getValue();

/**
* Entry point for cloning one folder to another
*/
function clone() {
  var folderSource = DriveApp.getFolderById(folderSourceId);
  var folderTarget = DriveApp.getFolderById(folderTargetId);
  
  cloneFolderInto(folderSource, folderTarget);  
}

/**
* Recursive function that clones a source folder *into* the target folder
* @param {Folder} folderSource The folder and contents that will be copied
* @param {Folder} folderTarget The folder into which the source folder's contents will be copied into
*/
function cloneFolderInto(folderSource, folderTarget) {
  var folderSourceCopy = folderTarget.createFolder(replaceString(folderSource.getName()));

  var files = folderSource.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    // Use original file name. Omitting this argument creates a file with the prefix "Copy of ".
    file.makeCopy(file.getName(), folderSourceCopy);
  }
  
  var subFolders = folderSource.getFolders();
  while(subFolders.hasNext()) {
    var subFolder = subFolders.next();
    cloneFolderInto(subFolder, folderSourceCopy);
  }
}

function replaceString(str) {
  return str.replace("{{clientName}}", 
                     sheetSettings.getRange(RANGENAME_CLIENT_NAME).getValue());
}


function getFileIteratorContinuationToken(token) {
  return fileIteratorContinuationTokenRange.getValue();
}

function setFileIteratorContinuationToken(token) {
  fileIteratorContinuationTokenRange.setValue(token);
}

function getFolderIteratorContinuationToken(token) {
  return folderIteratorContinuationTokenRange.getValue();
}

function setFolderIteratorContinuationToken(token) {
  folderIteratorContinuationTokenRange.setValue(token);
}
