import {snackbar, snackbarColor, snackbarText} from "../globals.ts";

export const callSnackbar = (text: string, color: string) => {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbar.value = true;
}