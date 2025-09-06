import { useEffect, useState } from "react"

export const useCoolDown = () => {
  const [coolDown, setCoolDown] = useState(0)

  // Timer
  useEffect(() => {
    if (coolDown === 0) return
    const interval = setInterval(
      () => {
        setCoolDown(
          prev => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
      }, 1000)
    return () => clearInterval(interval)
  }, [coolDown])

  return { coolDown, setCoolDown }
}


export const useTimer = (initialTimeInSeconds: number) => {
  const [seconds, setSeconds] = useState(initialTimeInSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      if (interval) clearInterval(interval);
      setIsActive(false);
    }

    // This cleanup function is crucial to prevent memory leaks.
    // It runs when the component unmounts or before a new effect runs.
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [isActive, seconds]);

  const start = () => {
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setSeconds(initialTimeInSeconds);
    setIsActive(false);
  };

  return {
    seconds,
    isActive,
    start,
    pause,
    reset
  };
};

