/**
 * @fileOverview Utility functions for dealing with Gmail
 * @author vinoaj@vinoaj.com
 */


function forwardFirstMessage(thread, forwardingAddress) {
    thread.getMessages()[0].forward(forwardingAddress);
}


/**
 * Marks a thread as read and moves it to the archive
 */
function hideThread(thread) {
    thread.markRead();
    thread.moveToArchive();
}