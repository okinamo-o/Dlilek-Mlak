export interface Chest {
  id: number;
  chestNumber: number;
  label: string;
  numericValue: number | null;
  isOpen: boolean;
  isContestantBox: boolean;
  governorate?: string;
}

export type GamePhase = 
  | 'setup' 
  | 'pick_contestant_box' 
  | 'elimination' 
  | 'opening_chest' 
  | 'banker_offer' 
  | 'final_swap' 
  | 'result';

export interface BankerOfferRecord {
  round: number;
  amount: number;
  accepted: boolean;
  unopenedCount: number;
}

export interface FinalOutcome {
  type: 'deal' | 'box_kept' | 'box_swapped';
  winLabel: string;
  winNumericValue: number | null;
  contestantOriginalBoxNumber: number;
  contestantOriginalBoxLabel: string;
  otherBoxNumber?: number;
  otherBoxLabel?: number | string;
  finalBoxNumber?: number;
}

export type Language = 'ar' | 'fr';

export interface PresetData {
  name: string;
  count: number;
  prizes: string[];
}
