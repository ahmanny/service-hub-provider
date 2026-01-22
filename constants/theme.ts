// PROVIDER APP COLORS

const primaryBlue = "#2563EB";
const primaryBlueTint = "#3B82F6";
const secondaryBlue = "#1D4ED8";

const successGreen = "#10B981";
const dangerRed = "#EF4444";
const dangerRedDark = "#F87171";


const warningAmber = "#F59E0B";      // Rich Amber for Light mode
const warningAmberLight = "#FBBF24"; // Brighter Amber for Dark mode readability

export const Colors = {
  light: {
    headerBackground: "#FFFFFF",

    text: "#111827",
    textSecondary: "#6B7280",
    background: "#FFFFFF",
    card: "#F9FAFB",
    border: "#E5E7EB",

    // Primary Brand
    tint: primaryBlue,
    tintLight: primaryBlueTint,
    buttonPrimary: primaryBlue,
    tabIconSelected: primaryBlue,

    // Secondary
    buttonSecondary: "#E5E7EB",

    // Icons
    icon: "#6B7280",
    iconBg: "#EFF4FF",
    tabIconDefault: "#9CA3AF",

    // Status colors
    success: successGreen,
    danger: dangerRed,

    warning: warningAmber,
    warningLight: "#FFF7ED",

    inactive: "#D1D5DB",

    placeholder: "#9CA3AF",
    shadow: "rgba(0,0,0,0.08)",
  },

  dark: {
    headerBackground: "#0F172A",

    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    background: "#0F172A",
    card: "#1E293B",
    border: "#334155",

    // Primary Brand
    tint: primaryBlueTint,
    tintLight: primaryBlue,
    buttonPrimary: primaryBlueTint,
    tabIconSelected: primaryBlueTint,

    // Secondary
    buttonSecondary: "#374151",

    // Icons
    icon: "#9CA3AF",
    iconBg: "#1E293B",
    tabIconDefault: "#6B7280",

    // Status colors
    success: successGreen,
    danger: dangerRedDark,

    warning: warningAmberLight,
    warningLight: "#451a03",
    
    inactive: "#4B5563",

    placeholder: "#6B7280",
    shadow: "rgba(0,0,0,0.4)",
  },
};