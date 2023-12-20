import {snackbar, snackbarColor, snackbarText, snackbarTimeout} from "../globals.ts";

export const callSnackbar = (text: string, color: string, persistent?: boolean) => {
    snackbarText.value = text;
    snackbarColor.value = color;
    snackbarTimeout.value = persistent ? -1 : 3000;
    snackbar.value = true;
}