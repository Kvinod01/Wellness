import { useState, useEffect, useCallback, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { DEFAULT_WORK_MINUTES, DEFAULT_BREAK_MINUTES, DEFAULT_SUGGESTIONS } from "../../constants";
import type { TimerMode, SettingsFormInputs } from "../../type";
import BreakSuggestionCard from "../BreakSuggestionCard/BreakSuggestionCard";
import SettingsModal from "../SettingsModal/SettingsModal";
import SuggestionsModal from "../SuggestionsModal/SuggestionsModal";
import TicTacToeGame from "../TicTacToeGame/TicTacToeGame";
import TimerControls from "../TimerControls/TimerControls";
import TimerDisplay from "../TimerDisplay/TimerDisplay";

const Pomodoro = () => {
  // --- STATE ---
  const [mode, setMode] = useState<TimerMode>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  // Settings State
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // NEW STATE for Modal


  // Calculated duration variables
  const workDurationSeconds = workMinutes * 60;
  const breakDurationSeconds = breakMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(workDurationSeconds);
  const totalSeconds = mode === 'work' ? workDurationSeconds : breakDurationSeconds;

  // --- LOCAL STORAGE & INITIAL LOAD EFFECT ---

  useEffect(() => {
    try {
      const savedWork = localStorage.getItem('pomodoroWorkMinutes');
      const savedBreak = localStorage.getItem('pomodoroBreakMinutes');
      if (savedWork) setWorkMinutes(parseInt(savedWork, 10));
      if (savedBreak) setBreakMinutes(parseInt(savedBreak, 10));

      const savedSuggestions = localStorage.getItem('breakSuggestions');
      if (savedSuggestions) {
        setSuggestions(JSON.parse(savedSuggestions));
      }
    } catch (e) {
      console.error("Could not load data from localStorage", e);
    }
  }, []);

  // --- HANDLERS (PASSED TO CHILDREN) ---

  const handleReset = useCallback((newWorkMinutes = workMinutes) => {
    setIsRunning(false);
    setMode('work');
    setSecondsLeft(newWorkMinutes * 60);
  }, [workMinutes]);

  const handleSettingsSubmit: SubmitHandler<SettingsFormInputs> = (data) => {
    const newWork = data.workMinutes;
    const newBreak = data.breakMinutes;

    setWorkMinutes(newWork);
    setBreakMinutes(newBreak);

    localStorage.setItem('pomodoroWorkMinutes', newWork.toString());
    localStorage.setItem('pomodoroBreakMinutes', newBreak.toString());

    handleReset(newWork);
    setIsSettingsOpen(false);
  };

  const handleAddSuggestion = (tip: string) => {
    const newSuggestions = [...suggestions, tip];
    setSuggestions(newSuggestions);
    localStorage.setItem('breakSuggestions', JSON.stringify(newSuggestions));
  };

  const handleDeleteSuggestion = (indexToDelete: number) => {
    const newSuggestions = suggestions.filter((_, index) => index !== indexToDelete);
    setSuggestions(newSuggestions);
    localStorage.setItem('breakSuggestions', JSON.stringify(newSuggestions));
  };

  const handleStartPause = () => setIsRunning(!isRunning);

  // Memoize the suggestion
  const currentSuggestion = useMemo(() => {
    if (suggestions.length === 0) return "Take a 5-minute breather!";
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  }, [mode, suggestions]);

  // Notification function
  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      const title = mode === 'work' ? 'Time for a break! 🧘' : 'Back to work! 💻';
      const body = mode === 'work' ? 'Stand up, stretch, or get some water.' : 'Time to focus!';
      new Notification(title, { body });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // --- TIMER EFFECTS ---

  // 1. Timer Tick Effect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // 2. Timer Completion/Mode Switch Effect
  useEffect(() => {
    if (secondsLeft === 0) {
      sendNotification();

      const nextMode = mode === 'work' ? 'break' : 'work';
      const nextSeconds = (nextMode === 'work' ? workDurationSeconds : breakDurationSeconds);

      setMode(nextMode);
      setSecondsLeft(nextSeconds);
      setIsRunning(false); // Auto-pause on switch
      if (isModalOpen) {
        setIsModalOpen(false)
      }
    }
  }, [secondsLeft, mode, workDurationSeconds, breakDurationSeconds]);

  // 3. Reset timer when work setting changes
  useEffect(() => {
    if (mode === 'work') {
      handleReset(workMinutes);
    }
  }, [workMinutes, handleReset, mode]);


  // --- RENDER ---
  const appBackground = "bg-black/80"
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSubmit={handleSettingsSubmit}
        defaultWork={workMinutes}
        defaultBreak={breakMinutes}
      />
      <SuggestionsModal
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        suggestions={suggestions}
        onAddSuggestion={handleAddSuggestion}
        onDeleteSuggestion={handleDeleteSuggestion}
      />


      <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${appBackground} p-4`}>
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">

          {/* Header & Settings Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-2xl font-bold uppercase tracking-wider bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text`}>
              {mode === 'work' ? 'Focus Time' : 'Wellness Break'}
            </h2>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Change timer settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.545.336 1.144.5 1.765.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <TimerDisplay
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            mode={mode}
          />

          <BreakSuggestionCard
            mode={mode}
            currentSuggestion={currentSuggestion}
            onOpenSuggestions={() => setIsSuggestionsOpen(true)}
          />

          <TimerControls
            isRunning={isRunning}
            onStartPause={handleStartPause}
            onReset={() => handleReset()}
          />

          {mode === "break" && <div className="flex justify-center mt-6">
            <button
              onClick={openModal}
              className="py-2 px-6 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-500 transition duration-150 active:scale-[0.98] shadow-md shadow-yellow-500/50"
            >
              Play Break Game
            </button>
          </div>}

          {/* Notification Button */}
          <div className="text-center mt-6">
            <button onClick={requestNotificationPermission} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Enable Desktop Notifications
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="relative">
              <TicTacToeGame />
              <button
                onClick={closeModal}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center text-xl font-bold hover:bg-red-100 transition duration-150 ring-2 ring-gray-300"
                aria-label="Close game modal"
              >
                &times;
              </button>
            </div>
          </div>
        )}

      </div>


    </>
  );
}
export default Pomodoro