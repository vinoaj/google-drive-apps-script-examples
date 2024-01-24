const PRIMARY_USER = "vinny.vijeyakumaar@mycompany.com";
const CALENDAR_IDS = ["vinny.vijeyakumaar@mycompany.com"];
const RE_TLD_PRIMARY = /^.*?mycompany\.com$/;
const EXCLUDED_DOMAINS = new Set(["mycompany.com", "group.calendar.google.com", "calendar.google.com"]);
const EXCLUDED_EMAILS = new Set(["vinny.vijeyakumaar@mycompany.com", "unknownorganizer@calendar.google.com"]);
const SUMMARY_TRAVEL = "Travel (available by phone 📞)";

// Colors: https://developers.google.com/apps-script/reference/calendar/event-color
const COLOR_DEFAULT = "10";
const COLOR_EXTERNAL = "7";
const COLOR_TRAVEL = "8";

var scriptProperties = PropertiesService.getScriptProperties();


function init() {
    CALENDAR_IDS.forEach(calendarId => {
        let keyNameNST = getKeyNameNST(calendarId);
        let nextSyncToken = scriptProperties.getProperty(keyNameNST);

        if (!nextSyncToken) {
            nextSyncToken = initNextSyncToken(calendarId);
        }

        processNewEvents(calendarId, nextSyncToken);
    });
}


function processNewEvents(calendarId, nextSyncToken) {
    let nextPageToken

    do {
        let events = Calendar.Events.list(calendarId, {
            syncToken: nextSyncToken,
            pageToken: nextPageToken,
            singleEvents: true,
        });

        events.items.forEach(event => {
            // console.log(event);
            if (event.status !== "cancelled") {
                // console.log("event.summary: ", event.summary);
                if (event.summary === SUMMARY_TRAVEL) {
                    event.colorId = COLOR_TRAVEL;
                    Calendar.Events.update(event, calendarId, event.id);
                } else {
                    processExternalAttendees(calendarId, event);
                }
            } 
        });

        nextPageToken = events.nextPageToken;

    } while (nextPageToken);

    nextSyncToken = events.nextSyncToken;
    let keyNameNST = getKeyNameNST(calendarId);
    scriptProperties.setProperty(keyNameNST, nextSyncToken);
    // console.log('Next sync token:' + nextSyncToken);
    // scriptProperties.deleteProperty(getKeyNameNPT);
}


function processExternalAttendees(calendarId, event) {
    let hasExternalAttendees = false;
    let attendees = event.attendees || [];
    
    attendees.push({ "email": event.organizer.email });
    attendees = [...new Set(attendees)];

    let emails = attendees.map(attendee => attendee.email);
    emails = setDifference(emails, EXCLUDED_EMAILS);

    let colorOriginal = event.colorId;

    // Reset previous erroneous colouring
    if (event.colorId == "7") {
        if (emails.size == 0 ||
            emails.size == 1 && emails[0] == PRIMARY_USER) {
            event.colorId = COLOR_DEFAULT;
        }
    }

    let attendeeDomains = attendees.map(attendee => attendee.email.split('@').pop());
    let attendeeDomainsSet = new Set(attendeeDomains);
    let extAttendeeDomainsSet = setDifference(attendeeDomainsSet, EXCLUDED_DOMAINS);
    // Logger.log(attendeeDomains);
    // console.log(attendeeDomainsSet.size);

    if (extAttendeeDomainsSet.size > 0) {
        hasExternalAttendees = true;
        event.colorId = COLOR_EXTERNAL;
        // for (let domain of extAttendeeDomainsSet.values()) {
        //     Logger.log('Attendee is external: ' + domain);
        // }
    }

    if (event.colorId != colorOriginal) {
        CalendarApp.getCalendarById(calendarId).getEventById(event.id).setColor(event.colorId);
    }
}


// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function setDifference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }

    return _difference;
}


function initNextSyncToken(calendarId) {
    // Adapted sample from https://developers.google.com/apps-script/advanced/calendar#listing_events
    // ny = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    // nextYear = ny.toISOString();
    // nextYearPlusOne = new Date(ny.getTime() + (7*(24*60*60*1000))).toISOString();
    // Logger.log(nextYear);
    // Logger.log(nextYearPlusOne);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString();
    // console.log('Last month string: ' + lastMonthStr);

    let nextPageToken;
    do {
        let events = Calendar.Events.list(calendarId, {
            timeMin: lastMonthStr,
            //timeMax: nextYearPlusOne,
            //singleEvents: true,
            // orderBy: 'startTime',
            pageToken: nextPageToken,
            maxResults: 2500
        });

        nextPageToken = events.nextPageToken;
    } while (nextPageToken)

    let nextSyncToken = events.nextSyncToken;
    let keyNameNST = getKeyNameNST(calendarId);
    scriptProperties.setProperty(keyNameNST, nextSyncToken);
    return nextSyncToken;
}

function getKeyNameNST(calendarId) {
    return calendarId + "_NST";
}

function getKeyNameNPT(calendarId) {
    return calendarId + "_NPT";
}


function _test() {
    const EVENT_ID = "4bofc6ljhi3n1kflg1mhbdmtff_20221104T040000Z";
    const event = Calendar.Events.get(CALENDAR_IDS[0], EVENT_ID);
    // const event = CalendarApp.getEventById(EVENT_ID);
    Logger.log(event);

    // const calendar = CalendarApp.getCalendarById(CALENDAR_IDS[0]);
    // const eventObj = calendar.getEventById(EVENT_ID);
    // console.log(eventObj.getColor());

    processExternalAttendees(CALENDAR_IDS[0], event)
    // event.colorId = "7";
    // Calendar.Events.update(event, CALENDAR_IDS[0], event.id);
}
