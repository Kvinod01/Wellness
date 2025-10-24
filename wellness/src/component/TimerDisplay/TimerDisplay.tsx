import { useMemo } from "react";
import type { TimerMode } from "../../type";
import { formatTime } from "../../helper/helper";

interface TimerDisplayProps {
    secondsLeft: number;
    totalSeconds: number;
    mode: TimerMode;
}

const radius = 100;
const circumference = 2 * Math.PI * radius;

const TimerDisplay = (props:TimerDisplayProps) => {
    const {
    secondsLeft,
    totalSeconds,
} =props
    const percentage = (secondsLeft / totalSeconds) * 100;

    const strokeDashoffset = useMemo(() => {
        return circumference - (percentage / 100) * circumference;
    }, [percentage]);

    const circleColor = 'text-orange-400';

    return (
        <div className="relative flex items-center justify-center w-[250px] h-[250px] mx-auto my-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220" aria-hidden="true">
                <circle cx="110" cy="110" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-100 ease-linear ${circleColor}`}
                />
            </svg>
            <div className="absolute text-center">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    {formatTime(secondsLeft)}
                </h1>
            </div>
        </div>
    );
};

export default TimerDisplay;