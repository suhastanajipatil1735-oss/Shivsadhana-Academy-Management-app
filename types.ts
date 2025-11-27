export interface Student {
  id: string;
  name: string;
  standard: string; // "5th", "6th", etc.
  totalFees: number;
  paidFees: number;
  whatsappNumber?: string;
  lastReminderSent?: number; // Timestamp of last reminder
  createdAt: number;
}

export type ClassOption = "5th" | "6th" | "7th" | "8th" | "9th" | "10th";

export const CLASS_OPTIONS: ClassOption[] = ["5th", "6th", "7th", "8th", "9th", "10th"];

export interface DashboardMetrics {
  totalCollected: number;
  totalStudents: number;
  totalDue: number;
}