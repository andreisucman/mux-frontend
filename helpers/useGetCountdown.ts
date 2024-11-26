import { useEffect, useRef, useState } from "react";

type Props = {
  recordingTime: number;
};

export default function useGetCountdown({ recordingTime }: Props) {
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const timeRef = useRef<number>(0);

  useEffect(() => {
    timeRef.current = new Date().getTime() + recordingTime;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(timeRef.current).getTime();
      const diff = targetDate - now;

      if (diff < 0) {
        clearInterval(interval);
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Add leading zero if number is single digit
      days = Number(days < 10 ? "0" + days : days);
      hours = Number(hours < 10 ? "0" + hours : hours);
      minutes = Number(minutes < 10 ? "0" + minutes : minutes);
      seconds = Number(seconds < 10 ? "0" + seconds : seconds);

      setCountdown({
        days: String(days),
        hours: String(hours),
        minutes: String(minutes),
        seconds: String(seconds),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return countdown;
}
