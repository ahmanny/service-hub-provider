import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

dayjs.extend(duration);

export function useCountdown(deadlineAt: string | Date) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = dayjs();
      const deadline = dayjs(deadlineAt);
      const diff = deadline.diff(now);

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const dur = dayjs.duration(diff);
      const days = Math.floor(dur.asDays());
      const hours = dur.hours();
      const minutes = dur.minutes();
      const seconds = dur.seconds();

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [deadlineAt]);

  return { timeLeft, isExpired };
}
