interface WaterTrackerProps {
    waterCount: number;
    onAddGlass: () => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ waterCount, onAddGlass }) => (
    <div className="mt-8 pt-4 border-t border-gray-200 text-center flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold mb-1 text-gray-700">Glasses Tracked</h3>
            <p className="text-3xl font-extrabold text-teal-600">{waterCount}</p>
        </div>
        <button
            onClick={onAddGlass}
            className="bg-teal-500 text-white font-medium px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors duration-200 shadow-md text-lg"
        >
            + Add Glass
        </button>
    </div>
);
export default WaterTracker