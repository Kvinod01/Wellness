import { useForm } from "react-hook-form";
import type { SettingsFormInputs } from "../../type";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SettingsFormInputs) => void;
    defaultWork: number;
    defaultBreak: number;
}

const SettingsModal = (props: SettingsModalProps) => {
    const { isOpen, onClose, onSubmit, defaultWork, defaultBreak } = props;

    if (!isOpen) return null;

    const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormInputs>({
        defaultValues: { workMinutes: defaultWork, breakMinutes: defaultBreak }
    });

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
                <h3 className="text-xl font-bold mb-4">Timer Settings</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Duration (Minutes)</label>
                        <input
                            type="number"
                            {...register('workMinutes', { required: true, min: 1, max: 1440 })}
                            // min={1}
                            // max={1440}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.workMinutes && <p className="text-red-500 text-xs mt-1">Work minutes required (min 1 / max up to 1440).</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (Minutes)</label>
                        <input
                            type="number"
                            // min={1}
                            // max={1440}
                            {...register('breakMinutes', { required: true, min: 1, max: 1440 })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.breakMinutes && <p className="text-red-500 text-xs mt-1">Break minutes required (min 1 / max up to 1440).</p>}
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-orange-400 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Save & Apply
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;