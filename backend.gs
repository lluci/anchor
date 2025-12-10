// Google Apps Script Code for Anchor App
// 1. Create a new Google Sheet.
// 2. Extensions > Apps Script.
// 3. Paste this code.
// 4. Deploy > New Deployment > Web App > Who has access: "Anyone".
// 5. Copy the URL.

const SHEET_ID = ""; // <-- PASTE YOUR GOOGLE SHEET ID HERE
// (The long string in the URL: docs.google.com/spreadsheets/d/[THIS_PART]/edit)

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // PARSE ACTION
  // GET requests usually for fetching config
  // POST requests for saving data
  
  let action = e.parameter.action;
  let data = null;
  
  if (e.postData && e.postData.contents) {
    try {
      const json = JSON.parse(e.postData.contents);
      action = json.action || action;
      data = json;
    } catch (err) {
      // ignore
    }
  }

  const result = {};
  
  try {
    if (action === "getPact") {
      result.pact = getPact(ss);
    } 
    else if (action === "savePact") {
      savePact(ss, data.date, data.type);
      result.status = "success";
    }
    else if (action === "logHabit") {
      logHabit(ss, data);
      result.status = "success";
    }
    else if (action === "getTodayState") {
      result.todayState = getTodayState(ss, data.date);
    }
    else {
      // Default: just return pact for easy loading
      result.pact = getPact(ss);
    }
  } catch (error) {
    result.status = "error";
    result.message = error.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- HELPERS ---

function getPact(ss) {
  const sheet = getOrCreateSheet(ss, "Config");
  const data = sheet.getDataRange().getValues();
  // Assume Row 1 is Header: Date | Type
  // Data starts Row 2
  
  const pact = {};
  for (let i = 1; i < data.length; i++) {
    const [date, type] = data[i];
    if (date && type) {
      // Ensure date string format YYYY-MM-DD
      // Google Sheets might return Date object
      let dateStr = date;
      if (typeof date === 'object') {
        dateStr = date.toISOString().split("T")[0]; 
      }
      pact[dateStr] = type;
    }
  }
  return pact;
}

function savePact(ss, date, type) {
  const sheet = getOrCreateSheet(ss, "Config");
  const data = sheet.getDataRange().getValues();
  
  // Check if date exists to update
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    let d = data[i][0];
    if (typeof d === 'object') d = d.toISOString().split("T")[0];
    
    if (d === date) {
      foundRow = i + 1; // 1-based index
      break;
    }
  }
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 2).setValue(type);
  } else {
    sheet.appendRow([date, type]);
  }
}

function logHabit(ss, payload) {
  const sheet = getOrCreateSheet(ss, "Logs");
  // Columns: Timestamp | Date | HabitID | State | Detail
  const timestamp = new Date();
  sheet.appendRow([
    timestamp,
    payload.date,
    payload.habitId,
    payload.state,
    payload.detail || ""
  ]);
}

function getTodayState(ss, dateStr) {
  const sheet = getOrCreateSheet(ss, "Logs");
  const data = sheet.getDataRange().getValues();
  
  // Columns: Timestamp | Date | HabitID | State | Detail
  // Find all logs for the given date and get the most recent state for each habit
  
  const habitStates = {};
  
  for (let i = data.length - 1; i >= 1; i--) { // Start from bottom (most recent)
    const [timestamp, logDate, habitId, state, detail] = data[i];
    
    // Normalize date
    let logDateStr = logDate;
    if (typeof logDate === 'object') {
      logDateStr = logDate.toISOString().split("T")[0];
    }
    
    // If this log is for the requested date and we haven't seen this habit yet
    if (logDateStr === dateStr && !habitStates[habitId]) {
      habitStates[habitId] = {
        state: state,
        detail: detail || "",
        window: extractWindow(detail) // Extract window from detail if available
      };
    }
  }
  
  return habitStates;
}

// Helper to extract window info from detail string
function extractWindow(detail) {
  if (!detail) return null;
  // Detail might be like "green" or "orange" or "red" or other text
  if (detail === "green" || detail === "orange" || detail === "red") {
    return detail;
  }
  return null;
}


function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === "Config") sheet.appendRow(["Date", "Type"]);
    if (name === "Logs") sheet.appendRow(["Timestamp", "Date", "HabitID", "State", "Detail"]);
  }
  return sheet;
}
