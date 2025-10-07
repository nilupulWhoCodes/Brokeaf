import { AppTheme } from "@/themes";
import { StyleSheet } from "react-native";

export const bottomDrawerStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalBody: {
      paddingHorizontal: 16,
      paddingBottom: 14,
      backgroundColor: theme.colors.background,
    },
    footerComponent: {
      paddingHorizontal: 16,
      marginBottom: 34,
      paddingTop: 14,
    },
    modalStyles: {
      borderTopStartRadius: 14,
      borderTopEndRadius: 14,
      overflow: "hidden",
    },
  });
