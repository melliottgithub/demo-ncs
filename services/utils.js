function parseDate (datePart, timePart) {
    const date = datePart.substr(0, 10);
    return new Date(`${date}T${timePart}.000Z`);
}

function getElapsedMinutes (date1, date2) {
    const ms = date1.getTime() - date2.getTime();
    return ms / 1000 / 60;
}

module.exports = { parseDate, getElapsedMinutes };
