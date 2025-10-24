interface TimerControlsProps {
    isRunning: boolean;
    onStartPause: () => void;
    onReset: () => void;
}

const TimerControls = (props: TimerControlsProps) => {
    const { isRunning, onStartPause, onReset } = props
    return (<div className="flex justify-center space-x-4 my-6">
        <button
            onClick={onStartPause}
            className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 shadow-lg transform hover:scale-[1.03]
                 bg-orange-400 hover:bg-orange-600 active:bg-orange-700"
        >
            {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
            onClick={onReset}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors duration-200 shadow-md"
        >
            Reset
        </button>
    </div>
    );
}

export default TimerControls