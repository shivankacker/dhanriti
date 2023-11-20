import { useAtom } from "jotai";
import { storageAtom } from "../store";
import { BaseThemes, Switch } from "@kacker/ui";

export default function SettingsPage() {
    const [storage, setStorage] = useAtom(storageAtom);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-extrabold">Settings</h1>
            <br />
            <b>Theme</b>
            <br />
            <Switch
                value={storage?.theme?.name || "device"}
                onChange={(value) => {
                    const theme = BaseThemes.find(
                        (theme) => theme.name === value
                    );
                    if (theme) {
                        setStorage({
                            ...storage,
                            theme,
                        });
                    } else {
                        setStorage({
                            ...storage,
                            theme: null,
                        });
                    }
                }}
                options={[
                    ...BaseThemes.map((theme) => ({
                        value: theme.name,
                        label: theme.displayName,
                    })),
                    /*{
                        value: "device",
                        label: "Device Theme"
                    }*/
                ]}
            />
        </div>
    );
}
