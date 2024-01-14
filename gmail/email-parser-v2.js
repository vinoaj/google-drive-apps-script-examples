const EMAIL_EXPENSIFY = 'receipts@expensify.com';
const EMAIL_TRIPIT = 'plans@tripit.com';
const EXCLUDED_DOMAINS = new Set(["yourorg.com", "yourorg.co", "group.calendar.google.com", "calendar.google.com", "calendar-server.bounces.google.com", "google.com"]);
const LABEL_EXTERNAL = GmailApp.getUserLabelByName("external");
const RE_EMAIL = /(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"=]{2,})/ig;

function init() {
  processThreads("from:calendar-notification@google.com subject:Notification in:inbox", handleCalendarEmail);
  processThreads("in:inbox from:egencia subject:approved", () => EMAIL_TRIPIT);
  processThreads("from:navan subject:confirmed in:inbox", handleNavanEmail);
}

function processThreads(searchTerm, actionCallback) {
  let threads = GmailApp.search(searchTerm);
  threads.forEach(thread => {
    let firstMessage = thread.getMessages()[0];
    actionCallback(firstMessage, thread);
  });
}

function handleCalendarEmail(message, thread) {
  let rawContent = message.getRawContent();
  let emails = rawContent.match(RE_EMAIL);
  let uniqueAttendees = [...new Set(emails)];
  console.log(uniqueAttendees);
  
  let extAttendeeDomains = uniqueAttendees.map(email => email.split('@').pop())
                                          .filter(domain => !EXCLUDED_DOMAINS.has(domain));
  if (extAttendeeDomains.length > 0) {
    LABEL_EXTERNAL.addToThread(thread);
  }
}

function handleNavanEmail(message, thread) {
  let subject = message.getSubject();
  if (subject.includes('stay at')) {
    message.forward(EMAIL_EXPENSIFY);
  }
  message.forward(EMAIL_TRIPIT);
  hideThread(thread);
}

function hideThread(thread) {
  thread.markRead();
  thread.moveToArchive();
}
