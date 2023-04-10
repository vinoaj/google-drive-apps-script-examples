const EMAIL_EXPENSIFY = 'receipts@expensify.com';
const EMAIL_TRIPIT = 'plans@tripit.com';
const EXCLUDED_DOMAINS = new Set(["workdomain.com", "group.calendar.google.com", "calendar.google.com", "calendar-server.bounces.google.com", "google.com"]);
const LABEL_EXTERNAL = GmailApp.getUserLabelByName("external");
const RE_EMAIL = /(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"=]{2,})/ig
const RE_TLD_PRIMARY = /^.*?workdomain\.com$/;

function init() {
  processCalendar();
  processNavan();
}


// Add labels to Google Calendar notification emails based on content
function processCalendar() {
  let searchTerm = "from:calendar-notification@google.com subject:Notification in:inbox";
  let threads = getThreadsBySearch(searchTerm);

  for (let thread of threads) {
    let firstMessage = thread.getMessages()[0];
    let rawContent = firstMessage.getRawContent();
    let emails = rawContent.match(RE_EMAIL);
    
    attendees = [...new Set(emails)];
    
    let attendeeDomains = attendees.map(attendee => attendee.split('@').pop());
    let attendeeDomainsSet = new Set(attendeeDomains);
    let extAttendeeDomainsSet = setDifference(attendeeDomainsSet, EXCLUDED_DOMAINS);
    
    if (extAttendeeDomainsSet.size > 0) {
      LABEL_EXTERNAL.addToThread(thread);
    }
  }
}


// Process notifications from Navan
function processNavan() {
  let searchTerm = "from:navan subject:confirmed in:inbox";
  let threads = GmailApp.search(searchTerm);

  for (let thread of threads) {
    let firstMessage = thread.getMessages()[0];
    let subject = firstMessage.getSubject();

    if (subject.includes('stay at')) {
      firstMessage.forward(EMAIL_EXPENSIFY);
    }
    
    firstMessage.forward(EMAIL_TRIPIT);
    hideThread(thread);
  }
}


function getThreadsBySearch(searchTerm) {
  let threads = GmailApp.search(searchTerm);
  return threads;
}


function hideThread(thread) {
  thread.markRead();
  thread.moveToArchive();
}


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function setDifference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }

  return _difference;
}
