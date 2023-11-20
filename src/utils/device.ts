import { BackButtonListenerEvent, App as CapacitorApp } from "@capacitor/app";
export const goBack = (gb: BackButtonListenerEvent) => {
    if (!gb.canGoBack) {
        CapacitorApp.exitApp();
    } else {
        window.history.back();
    }
};
