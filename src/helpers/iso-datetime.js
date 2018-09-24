export const getNow = () => new Date().toISOString();
export const getDatetimeWithDayOffset = (offset) => {
    let _date = new Date();
    _date.setDate(_date.getDate() + offset);
    return _date.toISOString();
};
export const getTodayWithZeroTime = ()=> {
    let _date = new Date();
    _date.setHours(0,0,0);
    return _date.toISOString();
};