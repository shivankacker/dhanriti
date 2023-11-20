import { PushNotifications } from "@capacitor/push-notifications";

export const addNotificationListeners = async () => {
    await PushNotifications.addListener("registration", async (token) => {
        // do something with the token
    });

    await PushNotifications.addListener("registrationError", (err) => {
        console.log("Push notification token registration error: ", err.error);
        // do something with the error
    });

    await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
            console.log("Push notification received: ", notification);
        }
    );

    await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
            console.log(
                "Push notification action performed",
                notification.actionId,
                notification.inputValue
            );
        }
    );
};

export const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!");
    }
    await PushNotifications.register();
};
