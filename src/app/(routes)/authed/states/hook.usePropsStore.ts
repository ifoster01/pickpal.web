import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Prop = {
    leagueName: string;
    leagueID: string;
    leaguePic: string;
    eventName: string;
    eventID: string;
    label: string;
    eventDate: Date;
    playerName: string;
    playerGoal: string;
}