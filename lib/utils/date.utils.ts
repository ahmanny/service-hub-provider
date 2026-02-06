import { IAvailabilityDay } from "@/types/provider.types";

export const formatBookingDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};



export const DAYS_UI = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAME_TO_INDEX: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};

export const DURATIONS = [
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
    { label: "2h", value: 120 },
    { label: "3h+", value: 180 },
];


export const formatTimeFromDate = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '9:00 AM';
    }

    return date
        .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })
        .toUpperCase();
};


export const getTimeAsDate = (timeStr: string): Date => {
    // Handle invalid input
    if (!timeStr || typeof timeStr !== 'string') {
        console.error('Invalid time string:', timeStr);
        return new Date(2000, 0, 1, 9, 0, 0, 0);
    }

    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);

    if (!match) {
        console.error('Failed to parse time string:', timeStr);
        return new Date(2000, 0, 1, 9, 0, 0, 0);
    }

    const [_, hoursStr, minutesStr, modifier] = match;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Validate parsed values
    if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time components:', timeStr);
        return new Date(2000, 0, 1, 9, 0, 0, 0);
    }

    // Convert to 24-hour format
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return new Date(2000, 0, 1, hours, minutes, 0, 0);
};

export const formatTimeForUI = (timeStr: string = '09:00'): string => {
    if (/\d+:\d+\s*(AM|PM)/i.test(timeStr)) {
        return timeStr;
    }

    // Parse 24-hour format (e.g., "09:00" or "18:00")
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return '9:00 AM'; // Safe default
    }

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12, keep 1-11

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
};


/**
 * Transforms UI state into the IAvailabilityDay array required by the backend.
 */

export const formatAvailabilityData = (
    selectedDays: string[],
    startTime: string,
    endTime: string
): IAvailabilityDay[] => {

    const convertTimeTo24H = (timeStr: string) => {
        // If it's already in HH:mm format (no AM/PM), just return it
        if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
            return timeStr;
        }

        const [time, modifier] = timeStr.split(/\s|(?=[AP]M)/);
        let [hours, minutes] = time.split(":");
        let h = parseInt(hours, 10);

        if (modifier === "PM" && h < 12) h += 12;
        if (modifier === "AM" && h === 12) h = 0;

        return `${h.toString().padStart(2, "0")}:${minutes}`;
    };

    const start24 = convertTimeTo24H(startTime);
    const end24 = convertTimeTo24H(endTime);

    return [0, 1, 2, 3, 4, 5, 6].map((index) => {
        // Map day names correctly
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayName = dayNames[index];
        const isSelected = selectedDays.includes(dayName);

        return {
            dayOfWeek: index,
            isClosed: !isSelected,
            slots: isSelected ? [{ start: start24, end: end24 }] : [],
        };
    });
};