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
  const s = status as BookingStatus;

  switch (s) {
    case BookingStatus.PENDING:
      return {
        color: theme.warning || "#F59E0B",
        label: "New Request",
        slug: "pending",
      };
    case BookingStatus.ACCEPTED:
      return {
        color: theme.tint,
        label: "Upcoming",
        slug: "accepted"
      };
    case BookingStatus.IN_PROGRESS:
      return {
        color: "#8B5CF6",
        label: "Active Job",
        slug: "in_progress"
      };
    case BookingStatus.COMPLETION_PENDING:
      return {
        color: theme.warning || "#F59E0B",
        label: "Awaiting Client",
        slug: "completion_pending",
      };
    case BookingStatus.COMPLETED:
      return {
        color: theme.success,
        label: "Earned",
        slug: "completed"
      };
    case BookingStatus.DISPUTED:
      return {
        color: theme.danger,
        label: "Under Dispute",
        slug: "disputed"
      };
    case BookingStatus.CANCELLED:
    case BookingStatus.DECLINED:
      return {
        color: theme.danger,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        slug: s,
      };
    case BookingStatus.CANCELLED_REFUNDED:
      return {
        color: theme.success, 
        label: "Refunded",
        slug: "cancelled_refunded",
      };
    case BookingStatus.EXPIRED:
      return {
        color: theme.textSecondary || "#6B7280",
        label: "Expired",
        slug: "expired",
      };
    default:
      const fallbackLabel = status
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return {
        color: theme.border,
        label: fallbackLabel,
        slug: status.toString(),
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