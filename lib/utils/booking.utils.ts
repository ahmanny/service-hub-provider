import { BookingListItem, BookingSection, BookingStatus } from "@/types/booking.types";


export interface BookingStatusConfig {
  color: string;
  label: string;
  slug: string;
}

export const getBookingStatusConfig = (
  status: BookingStatus | string,
  theme: {
    tint: string;
    success: string;
    danger: string;
    border: string;
    warning?: string;
    textSecondary?: string;
  }
): BookingStatusConfig => {
  const s = status.toLowerCase();

  switch (s) {
    case "pending":
      return {
        color: theme.warning || "#F59E0B",
        label: "Pending",
        slug: "pending"
      };
    case "accepted":
      return {
        color: theme.tint,
        label: "Accepted",
        slug: "accepted"
      };
    case "in_progress":
      return {
        color: theme.tint,
        label: "In Progress",
        slug: "in_progress"
      };
    case "completed":
      return {
        color: theme.success,
        label: "Completed",
        slug: "completed"
      };
    case "declined":
      return {
        color: theme.danger,
        label: "Declined",
        slug: "declined"
      };
    case "cancelled":
      return {
        color: theme.danger,
        label: "Cancelled",
        slug: "cancelled"
      };
    case "expired":
      return {
        color: theme.textSecondary || "#6B7280",
        label: "Expired",
        slug: "expired"
      };
    default:
      return {
        color: theme.border,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        slug: s
      };
  }
};
export function groupBookingsByMonth(bookings: BookingListItem[]): BookingSection[] {
  if (!bookings.length) return [];

  // sort DESC (latest first)
  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const map = new Map<string, BookingListItem[]>();

  sorted.forEach((booking) => {
    const date = new Date(booking.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(booking);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => {
      const [aYear, aMonth] = a.split("-").map(Number);
      const [bYear, bMonth] = b.split("-").map(Number);
      return (
        new Date(bYear, bMonth).getTime() - new Date(aYear, aMonth).getTime()
      );
    })
    .map(([_, data]) => {
      const d = new Date(data[0].createdAt);
      return {
        title: d.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        data,
      };
    });
}