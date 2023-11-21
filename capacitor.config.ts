import { CapacitorConfig } from "@capacitor/cli";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const config: CapacitorConfig = {
    appId: "dev.shivank.dhanriti",
    appName: "dhanriti",
    webDir: "dist",
    bundledWebRuntime: false,
    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        StatusBar: {},
        Keyboard: {
            resizeOnFullScreen: true,
        },
    },
    [process.env.CAP_ENV_TYPE !== "DEV" ? "server" : ""]: {
        url: process.env.CAP_SERVER_URL,
        cleartext: true,
    },
};

export default config;
