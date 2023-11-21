import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Link, navigate, useQueryParams } from "raviger";
import { useEffect } from "react";
import { API } from "../utils/api";
import { storageAtom } from "../store";
import { useAtom } from "jotai";
import { Capacitor } from "@capacitor/core";
import { LoginWithKacker } from "@kacker/ui";

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
        <div className="bg-primary text-primaryFont h-screen pt-[var(--status-bar-height)] pb-[var(--safe-area-inset-bottom)] relative overflow-hidden">
            <div className="flex items-center justify-center flex-col h-full p-10 gap-10">
                <div className="font-extrabold text-2xl text-center px-10">
                    {t("welcome")}
                </div>
                <div className="w-full">
                    <LoginWithKacker
                        className="w-full"
                        loading={serviceTokenMutation.isLoading}
                        onClick={onLogin}
                    />
                </div>
            </div>
            <div className="absolute -bottom-10 -inset-x-10 h-[70%] bg-gradient-to-t from-accent-400 to-transparent gradient-pulsate blur-lg hidden" />
        </div>
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
        <div className="flex items-center justify-center h-full">
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
        </div>
    );
}
