export type TimerMode = 'work' | 'break';

export interface SettingsFormInputs {
    workMinutes: number;
    breakMinutes: number;
}

export interface SuggestionFormInputs {
    newSuggestion: string;
}

export type PlayerValue = 'X' | 'O' | null;

export interface WinnerInfo {
  winner: PlayerValue;
  line: number[];
}