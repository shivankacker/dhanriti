import { t } from "i18next";

export default function Error404() {
    return (
        <div className="flex items-center justify-center h-full bg-primary">
            <div className="m-20 text-center">
                <h1 className="text-5xl">
                    <i className="fad fa-bug" />
                </h1>
                <br />
                <h2 className="text-2xl font-extrabold">{t("404.title")}</h2>
                <p className="mt-2 text-gray-500">{t("404.description")}</p>
                <br />
                <button
                    onClick={() => window.history.back()}
                    className="ripple"
                >
                    <i className="far fa-arrow-left" />
                    &nbsp; {t("go_back")}
                </button>
            </div>
        </div>
    );
}
