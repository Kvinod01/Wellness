import { useForm, type SubmitHandler } from "react-hook-form";
import type { SuggestionFormInputs } from "../../type";

interface SuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: string[];
    onAddSuggestion: (tip: string) => void;
    onDeleteSuggestion: (index: number) => void;
}

const SuggestionsModal = (props: SuggestionsModalProps) => {

    const { isOpen, onClose, suggestions, onAddSuggestion, onDeleteSuggestion } = props
    if (!isOpen) return null;

    const { register, handleSubmit, reset } = useForm<SuggestionFormInputs>();

    const onSubmit: SubmitHandler<SuggestionFormInputs> = (data) => {
        const newTip = data.newSuggestion.trim();
        if (newTip) {
            onAddSuggestion(newTip);
            reset();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-green-500">Break Suggestions ({suggestions.length})</h3>

                {/* Add New Suggestion Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2 mb-4">
                    <input
                        type="text"
                        placeholder="Add a new break tip..."
                        {...register('newSuggestion', { required: true })}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Add Tip
                    </button>
                </form>

                {/* List of Suggestions */}
                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <ul className="space-y-2">
                        {suggestions.map((tip, index) => (
                            <li key={index} className="text-gray-700 text-sm p-2 bg-white rounded-md shadow-sm flex justify-between items-center">
                                <span>{tip}</span>
                                <button
                                    onClick={() => onDeleteSuggestion(index)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                    title="Remove suggestion"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestionsModal