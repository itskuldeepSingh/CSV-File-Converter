function doGet() {
    return HtmlService
        .createTemplateFromFile('index')
        .evaluate()
        .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
}

// In case if you want to add same functionality to sidebar instead of webapp uncomment below function.
// function onOpen() {
//     SpreadsheetApp.getUi().createMenu('Sidebar')
//         .addItem('Import CSV', 'showSidebar')
//         .addToUi();
// }

function showSidebar() {
    let widget = HtmlService.createHtmlOutputFromFile('index')
    SpreadsheetApp.getUi().showSidebar(widget)
}

function getSheet() {
    let sheets = []
    SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(ele => {
        sheets.push(ele.getName())
    });
    return sheets;
}

function saveFile(obj) {
    let name = `CSVImport - ${new Date().toLocaleString()}`
    let folder = DriveApp.createFolder(name);
    let blob = Utilities.newBlob(Utilities.base64Decode(obj.data), obj.mimeType, obj.fileName);
    return folder.createFile(blob).getId();
}

function mergeFiles(data, location) {
    let array = [];
    let headers = [];
    data.forEach(ele => {
        let spreadsheets = DriveApp.getFileById(ele)
        let csvData = Utilities.parseCsv(spreadsheets.getBlob().getDataAsString(), ",")
        headers.push(csvData[0])
        for (let i = 1; i < csvData.length; i++) {
            array.push(csvData[i]);
        }
    });
    array.unshift(headers[0])
    console.log(array)
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(location)
        .getRange(1, 1, array.length, array[0].length)
        .setValues(array)
}


