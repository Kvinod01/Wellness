import type { TimerMode } from "../../type";

interface BreakSuggestionCardProps {
    mode: TimerMode;
    currentSuggestion: string;
    onOpenSuggestions: () => void;
}

const BreakSuggestionCard= (props : BreakSuggestionCardProps) => {
    const { mode, currentSuggestion, onOpenSuggestions } =props
    if (mode !== 'break') return null;

    return (
        <div className="bg-green-100 p-4 rounded-xl my-4 min-h-[4rem] flex flex-col items-center justify-center border-l-4 border-green-500 shadow-inner">
            <p className="text-lg italic text-green-700 font-medium text-center">
                {currentSuggestion}
            </p>
            <button
                onClick={onOpenSuggestions}
                className="text-sm text-green-500/80 hover:text-green-700 underline mt-2"
            >
                Edit Suggestions
            </button>
        </div>
    );
};

export default BreakSuggestionCard