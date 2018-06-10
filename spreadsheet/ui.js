/**
 * @fileoverview User interface (UI) functions for working with Google Sheets
 * @author vinoaj@gmail.com (Vinoaj Vijeyakumaar)
 * @copyright Vinoaj Vijeyakumaar 2018
 */


/**
 * Add menu elements to the Sheet interface
 */
function onOpen() {
    /**
     * The onOpen() trigger runs automatically when a user opens a spreadsheet, 
     * document, or form that he or she has permission to edit. 
     * https://developers.google.com/apps-script/guides/triggers/#onopen
     */
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Pricing Utilities')
        .addItem('Delete Marked Rows (x)', 'triggerDeleteMarkedRows')
        .addToUi();
  }