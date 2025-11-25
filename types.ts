import { Type } from "@google/genai";

export enum Suit {
  MAJOR = "Major Arcana",
  WANDS = "Wands",
  CUPS = "Cups",
  SWORDS = "Swords",
  PENTACLES = "Pentacles"
}

export interface CardData {
  id: string;
  name: string;
  suit: Suit;
  number: number; // 0-21 for Major, 1-14 for Minor
  keywords: string[];
}

export interface DrawnCard extends CardData {
  isReversed: boolean;
  positionName: string;
  positionIndex: number;
}

export interface SpreadPosition {
  name: string;
  description: string;
  x: number; // Relative grid X (1-12)
  y: number; // Relative grid Y (1-12)
}

export interface SpreadDefinition {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
  difficulty: 'Beginner' | 'Advanced' | 'Master';
}

// API Response Types
export interface ReadingResponse {
  overallTheme: string;
  cardInsights: {
    cardName: string;
    position: string;
    interpretation: string;
  }[];
}