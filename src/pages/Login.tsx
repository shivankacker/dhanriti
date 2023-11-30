import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Link, navigate, useQueryParams } from "raviger";
import { useEffect } from "react";
import { API } from "../utils/api";
import { storageAtom } from "../store";
import { useAtom } from "jotai";
import { Capacitor } from "@capacitor/core";
import { LoginWithKacker, RawPage } from "@kacker/ui";

export default function Login() {
    const [storage, setStorage] = useAtom(storageAtom);

    const serviceTokenMutation = useMutation(
        async () =>
            await API.user.login({
                client_url: Capacitor.isNativePlatform()
                    ? "dhanriti://dhanriti.shivank.dev"
                    : window.location.origin,
            }),
        {
            onSuccess: (data) => {
                //window.open(data.url, "_blank");
                window.location.href = data.url;
            },
        }
    );

    useEffect(() => {
        if (storage?.auth_token) {
            navigate("/", { replace: true });
        }
    }, [storage]);

    const onLogin = async () => {
        serviceTokenMutation.mutate();
    };
    return (
        <RawPage>
            <div className="flex justify-end flex-col h-full p-8 gap-10">
                <div>
                    <img
                        src={`/logo_full_${
                            document.documentElement.style.getPropertyValue(
                                "--kui-theme-type"
                            ) === "dark"
                                ? "white"
                                : "black"
                        }.svg`}
                        className="h-16"
                        alt="Logo"
                    />
                </div>
                <div className="font-extrabold text-5xl leading-[1.1]">
                    {t("login_title")}
                </div>
                <div className="text-gray-500">{t("login_description")}</div>
                <div className="w-full">
                    <LoginWithKacker
                        className="w-full"
                        loading={serviceTokenMutation.isLoading}
                        onClick={onLogin}
                    />
                </div>
            </div>
            <div className="absolute -bottom-10 -inset-x-10 h-[70%] bg-gradient-to-t from-accent-400 to-transparent gradient-pulsate blur-lg hidden" />
        </RawPage>
    );
}

export function VishnuLogin() {
    const [storage, setStorage] = useAtom(storageAtom);
    const [{ success = false, token = null }] = useQueryParams();
    const loginMutation = useMutation(
        async () => await API.user.login({ login_token: token }),
        {
            onSuccess: (data) => {
                setStorage({
                    auth_token: data.token,
                    user: data.user,
                });
                navigate("/login", { replace: true });
            },
        }
    );

    useEffect(() => {
        if (success) {
            getToken();
        }
    }, []);

    const getToken = async () => {
        await loginMutation.mutateAsync();
    };

    return (
        <RawPage>
            {loginMutation.isError || !token ? (
                <div className="text-center">
                    There was an error logging in.
                    <br />
                    <br />
                    <Link href="/login" className="text-purple-500">
                        Try Again
                    </Link>
                </div>
            ) : (
                <div>Logging in...</div>
            )}
        </RawPage>
    );
}
