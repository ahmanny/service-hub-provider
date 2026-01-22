export const generateTimeSlots = (selectedDate: Date) => {
    const slots = [];
    const startHour = 8; // 9 AM
    const endHour = 23;  // 9 PM

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute of [0, 30]) {
            const slot = new Date(selectedDate);
            slot.setHours(hour, minute, 0, 0);

            // If it's today, only add slots that are at least 30-60 mins in the future
            if (isToday && slot <= new Date(now.getTime() + 30 * 60000)) {
                continue;
            }

            if (hour === endHour && minute > 0) break; // Don't go past 9:00 PM
            slots.push(slot);
        }
    }
    return slots;
};


export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};