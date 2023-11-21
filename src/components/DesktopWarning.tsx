import { t } from "i18next";

export default function DesktopWarning() {
    return (
        <div className="h-screen flex  items-center justify-center p-4 bg-primary text-primaryFont text-xl">
            <div className="text-center w-80">
                <div className="text-8xl">⚠️</div>
                <br />
                {t("desktop_warning")}
            </div>
        </div>
    );
}
