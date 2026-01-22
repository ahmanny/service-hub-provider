export const START_HOUR = 8;  // 8 AM
export const END_HOUR = 23;  // 9 PM


export const getMinTime = () => {
    const date = new Date();
    date.setHours(START_HOUR, 0, 0, 0);
    return date;
};

export const getMaxTime = () => {
    const date = new Date();
    date.setHours(END_HOUR, 0, 0, 0);
    return date;
};
export const isTimeWithinRange = (time: Date) => {
    const hour = time.getHours();
    return hour >= START_HOUR && hour < END_HOUR;
};