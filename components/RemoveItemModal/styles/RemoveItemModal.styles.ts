import { AppTheme } from "@/themes";
import { StyleSheet } from "react-native";

export const removeItemModal = (theme: AppTheme) =>
  StyleSheet.create({
    modal: {
      marginHorizontal: 27,
      marginBottom: 60,
      borderRadius: 15,
      backgroundColor: theme.colors.background,
    },
    modalHeader: {
      textAlign: "center",
      ...theme.fonts.headerLarge,
      color: theme.colors.black,
    },
    content: {
      backgroundColor: theme.colors.background,
    },
    overlay: {
      backgroundColor: theme.colors.background,
    },
    successDescription: {
      fontFamily: "poppins-regular",
      fontSize: 14,
      textAlign: "center",
      color: theme.colors.gray3Text,
    },
    modalFooter: {
      gap: 10,
      backgroundColor: theme.colors.background,
    },
    buttonContainer: {
      borderRadius: 52,
      overflow: "hidden",
    },
    button: {
      height: 50,
      borderRadius: 52,
      justifyContent: "center",
      alignItems: "center",
    },
    submitButtonText: {
      color: theme.colors.background,
      ...theme.fonts.button,
    },
    cancelButton: {
      borderWidth: 1,
      borderRadius: 52,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderColor: theme.colors.gray3Text,
    },
    cancelButtonText: {
      ...theme.fonts.button,
      color: theme.colors.black,
    },
  });
