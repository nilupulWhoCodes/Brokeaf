import { AppTheme } from "@/themes";
import { StyleSheet } from "react-native";

export const paginatorStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
    flexOne: { flex: 1 },
    fullContainer: {
      justifyContent: "space-between",
      width: "90%",
      margin: 10,
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    dot: {
      height: 8,
      borderRadius: 5,
      backgroundColor: theme.colors.gray5Bg,
      marginHorizontal: 4,
    },
    skipContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "flex-end",
      flex: 1,
    },
    activeDot: {
      backgroundColor: theme.colors.secondary,
    },
  });
