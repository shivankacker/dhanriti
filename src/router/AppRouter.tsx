import { navigate, usePath, useRoutes } from "raviger";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Error404 from "../pages/404";
import Login, { VishnuLogin } from "../pages/Login";
import RouterFallback from "./RouterFallback";
import { useAtom } from "jotai";
import { routeTreeAtom, storageAtom } from "../store";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { AppContainer } from "@kacker/ui";
import RouteScreen from "../components/routeScreen";
import SettingsPage from "../pages/Settings";
import AccountPage from "../pages/Account";
import HomePage from "../pages/Home";

const FlowRecords = React.lazy(() => import("../pages/FlowRecords"));

const fallback = <RouterFallback />;

function LazyLoad(props: { children: ReactNode }) {
    return (
        <React.Suspense fallback={fallback}>{props.children}</React.Suspense>
    );
}

export type RouteTree = {
    node: ReactNode;
    path: string;
    status?: "ready" | "destroying";
};

export const navBarPaths = ["/", "/profile", "/settings"];

export default function AppRouter() {
    const path = usePath();
    const [storage, setStorage] = useAtom(storageAtom);
    const mainRef = useRef<HTMLDivElement>(null);
    const [routeTree, setRouteTree] = useAtom(routeTreeAtom);
    const [direction, setDirection] = useState<"backward" | "forward" | null>(
        null
    );

    useEffect(() => {
        (async () => {
            await App.addListener(
                "appUrlOpen",
                (event: URLOpenListenerEvent) => {
                    const slug = event.url.split("dhanriti.shivank.dev").pop();
                    if (slug) {
                        navigate(slug);
                    }
                }
            );
        })();
    }, []);

    const routes = {
        "/": () => <HomePage />,
        "/login": () => (
            <LazyLoad>
                <Login />
            </LazyLoad>
        ),
        "/vishnu-login": () => (
            <LazyLoad>
                <VishnuLogin />
            </LazyLoad>
        ),
        "/settings": () => (
            <LazyLoad>
                <SettingsPage />
            </LazyLoad>
        ),
        "/profile": () => (
            <LazyLoad>
                <AccountPage />
            </LazyLoad>
        ),
        "/flows": () => (
            <LazyLoad>
                <FlowRecords />
            </LazyLoad>
        ),
    };
    const routeResult = useRoutes(routes) || <Error404 />;

    const basePaths: (keyof typeof routes)[] = ["/", "/profile", "/settings"];

    const loginPaths: (keyof typeof routes)[] = ["/login", "/vishnu-login"];

    const popstateListener = (e: PopStateEvent) => {
        if (e.state === undefined) {
            setDirection("backward");
        } else if (e.state === null) {
            setDirection("forward");
        }
    };

    useEffect(() => {
        window.addEventListener("popstate", popstateListener);
        if (
            !basePaths.includes(path as any) &&
            !loginPaths.includes(path as any)
        ) {
            setRouteTree([
                ...routeTree,
                {
                    node: routeResult,
                    path: path as string,
                },
            ]);
        }
        return () => {
            window.removeEventListener("popstate", popstateListener);
        };
    }, []);

    useEffect(() => {
        if (!direction) return;
        const newPath = path;
        const lastPath = routeTree[routeTree.length - 1]?.path;
        if (
            direction === "backward" &&
            !basePaths.includes(lastPath as any) &&
            !loginPaths.includes(lastPath as any)
        ) {
            setRouteTree([
                ...routeTree.slice(0, -1),
                {
                    ...routeTree[routeTree.length - 1],
                    status: "destroying",
                },
            ]);
        } else if (
            direction === "forward" &&
            !basePaths.includes(newPath as any) &&
            !loginPaths.includes(newPath as any)
        ) {
            setRouteTree([
                ...routeTree,
                {
                    node: routeResult,
                    path: path as string,
                },
            ]);
        }
        setDirection(null);
    }, [direction]);

    useEffect(() => {
        routeTree.forEach((route, i) => {
            if (route.status === "destroying") {
                const el = document.querySelector(`[data-route-index="${i}"]`);
                if (el) {
                    el.classList.remove(
                        "__kui__screen__handler__screen__ready"
                    );
                }
                setTimeout(() => {
                    setRouteTree((prev) =>
                        prev.filter((_, index) => index !== i)
                    );
                }, 150);
            } else if (route.status === "ready") {
                const el = document.querySelector(`[data-route-index="${i}"]`);
                if (el) {
                    el.classList.add("__kui__screen__handler__screen__ready");
                }
            }
        });
    }, [routeTree]);

    return (
        <AppContainer
            exclusivePaths={loginPaths}
            routeResult={routeResult}
            baseRoutes={[
                {
                    name: "Settings",
                    type: "icon",
                    href: "/settings",
                    icon: "cog",
                    element: <SettingsPage key={0} />,
                },
                {
                    name: "Home",
                    type: "image",
                    href: "/",
                    image: "/logo.svg",
                    element: <HomePage key={1} />,
                    homeRoute: true,
                },
                {
                    name: "Profile",
                    type: "icon",
                    href: "/profile",
                    icon: "user",
                    element: <AccountPage key={2} />,
                },
            ]}
            currentPath={path || ("/" as any)}
        >
            {routeTree.map((route, i) => (
                <RouteScreen key={i} routeIndex={i} />
            ))}
        </AppContainer>
    );
}
