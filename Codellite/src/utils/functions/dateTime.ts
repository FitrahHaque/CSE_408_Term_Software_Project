export default function getCurrentDateAndTime() {
    const currentDateAndTime = new Date();
    const createdAt = {
        year: currentDateAndTime.getFullYear(),
        month: currentDateAndTime.getMonth(),
        hours: currentDateAndTime.getHours(),
        minute: currentDateAndTime.getMinutes(),
        second: currentDateAndTime.getSeconds(),
    }
    return createdAt
}