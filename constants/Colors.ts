const tintColorLight = "#2F7E79";
const tintColorDark = "#2F7E79";

export default {
  light: {
    background: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#B0BEC5", // Inactive tab icons
    primary: "#2F7E79", // Main brand color
    primaryOpacity: "rgba(47,126,121,0.1)",
    secondary: "#666666", // Light section backgrounds
    error: "#E53935", // Alerts and validation
    gray1Text: "#272526ff", // Primary text
    gray2Text: "#616161ff", // Primary text
    gray3Text: "#757575", // Secondary text
    gray6Bg: "#F4F6F6", // Card/section backgrounds
    gray7Bg: "#F1F1F1", // Card/section backgrounds
    borders: "#E0E0E0", // Borders/dividers
    black: "#000000",
    grayBg: "#F5F7F8", // General container background
    violet: "#7F3DFF", // Accent (e.g., CTA buttons)
    tertiary: "#7ABFE1",
    gray5Bg: "#E0E0E0",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },

  dark: {
    background: "#121212",
    tint: tintColorDark,
    tabIconDefault: "#777777",
    tabIconSelected: tintColorDark,
    primary: "#2F7E79",
    primaryOpacity: "rgba(47,126,121,0.1)",

    secondary: "#1E1E1E", // Card/section backgrounds
    error: "#F46363",
    gray1Text: "#F5F5F5", // Primary text
    gray3Text: "#BDBDBD", // Secondary text
    gray7Bg: "#2A2A2A", // Background sections
    borders: "#333333",
    grayBg: "#1A1A1A",
    violet: "#9B67FF",
  },
};
