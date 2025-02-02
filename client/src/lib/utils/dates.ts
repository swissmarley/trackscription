import { addMonths, addYears, format, isBefore, parseISO } from "date-fns";

export function calculateRenewalDate(startDate: Date | string, cycleType: "monthly" | "annually"): Date {
  const date = typeof startDate === "string" ? parseISO(startDate) : startDate;
  return cycleType === "monthly" ? addMonths(date, 1) : addYears(date, 1);
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "PP");
}

export function isUpcomingRenewal(renewalDate: Date | string): boolean {
  const date = typeof renewalDate === "string" ? parseISO(renewalDate) : renewalDate;
  const sevenDaysFromNow = addMonths(new Date(), 7);
  return isBefore(date, sevenDaysFromNow);
}

export function formatDateWithTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return format(parsedDate, "PPp");
}
