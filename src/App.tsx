import { useEffect, useState } from "react";
import { StatusBar } from "@capacitor/status-bar";
import AppRouter from "./router/AppRouter";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import {
    addNotificationListeners,
    registerNotifications,
} from "./utils/notifications";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { API } from "./utils/api";
import { navigate, usePath } from "raviger";
import { App as CapacitorApp } from "@capacitor/app";
import translation from "./i18n/en/translation.json";
import hindi from "./i18n/hi/translation.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Device } from "@capacitor/device";
import { backListenerAtom, storageAtom } from "./store";
import { useAtom } from "jotai";
import { TextZoom } from "@capacitor/text-zoom";
import { goBack } from "./utils/device";
import { Capacitor } from "@capacitor/core";
import { ThemeProvider, Theme, RippleProvider } from "@kacker/ui";
import DesktopWarning from "./components/DesktopWarning";
function App() {
    const [storage, setStorage] = useAtom(storageAtom);
    const [backListener, setBackListener] = useAtom(backListenerAtom);
    const queryClient = new QueryClient();
    const path = usePath();
    const [localLanguage, setLocalLanguage] = useState<string>("en");
    const [isDesktop, setIsDesktop] = useState<boolean>(false);

    i18n.use(initReactI18next).init({
        resources: {
            en: {
                translation,
            },
            hi: {
                translation: hindi,
            },
        },
        lng: storage?.language || localLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

    const getStorage = async () => {
        const storage = localStorage.getItem("dhanriti-storage");
        if (storage) {
            setStorage(JSON.parse(storage));
        } else {
            setStorage({ auth_token: "" });
        }
    };

    useEffect(() => {
        if (!storage) return;
        localStorage.setItem("dhanriti-storage", JSON.stringify(storage));
    }, [storage]);

    const getUserDetails = async () => {
        if (storage?.auth_token) {
            try {
                const user = await API.user.me();
                setStorage({
                    ...storage,
                    user: {
                        ...storage.user,
                        ...user,
                    },
                });
            } catch (error) {
                setStorage({
                    ...storage,
                    //user: undefined,
                    //auth_token: undefined,
                });
            }
        }
    };

    useEffect(() => {
        if (storage === null) return;
        if (!storage?.auth_token) {
            if (!path || ["/login"].includes(path)) return;
            navigate("/login", { replace: true });
        }
    }, [storage]);

    useEffect(() => {
        if (storage === null) return;
        if (storage?.auth_token) {
            getUserDetails();
            if (Capacitor.isNativePlatform()) {
                addNotificationListeners();
                registerNotifications();
            }
        }
    }, [storage?.auth_token]);

    const setDeviceInfo = async () => {
        setLocalLanguage((await Device.getLanguageCode()).value);
    };

    useEffect(() => {
        getStorage();
        setDeviceInfo();
        if (window.innerWidth > 768) {
            setIsDesktop(true);
        }
        if (Capacitor.isNativePlatform()) {
            (window.screen.orientation as any).lock("portrait");
            StatusBar.setOverlaysWebView({ overlay: true });
            NavigationBar.setTransparency({ isTransparent: true });
            TextZoom.set({ value: 1 });
        }
    }, []);

    useEffect(() => {
        const listener = CapacitorApp.addListener(
            "backButton",
            backListener || goBack
        );
        return () => {
            listener?.remove();
        };
    }, [backListener]);

    return (
        <ThemeProvider
            accent={{
                50: "#FCE4BB",
                100: "#FBDCA8",
                200: "#FACD81",
                300: "#F8BD59",
                400: "#F7AE32",
                500: "#F59E0B",
                600: "#C07C08",
                700: "#8A5906",
                800: "#543603",
                900: "#1E1401",
            }}
            theme={storage?.theme}
            onInitialThemeChange={(theme: Theme) => {
                setStorage({
                    ...storage,
                    theme,
                });
            }}
        >
            <RippleProvider>
                <QueryClientProvider client={queryClient}>
                    {isDesktop ? <DesktopWarning /> : <AppRouter />}
                </QueryClientProvider>
            </RippleProvider>
        </ThemeProvider>
    );
}

export default App;
