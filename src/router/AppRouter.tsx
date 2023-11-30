import { raviger } from "@kacker/ui";
import React, { ReactNode, useEffect } from "react";
import Error404 from "../pages/404";
import Login, { VishnuLogin } from "../pages/Login";
import RouterFallback from "./RouterFallback";
import { useAtom } from "jotai";
import { routeTreeAtom } from "../store";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { Router } from "@kacker/ui";
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
    const [routeTree, setRouteTree] = useAtom(routeTreeAtom);

    useEffect(() => {
        (async () => {
            await App.addListener(
                "appUrlOpen",
                (event: URLOpenListenerEvent) => {
                    const slug = event.url.split("dhanriti.shivank.dev").pop();
                    if (slug) {
                        raviger.navigate(slug);
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

    const loginPaths: (keyof typeof routes)[] = ["/login", "/vishnu-login"];

    return (
        <Router
            routes={routes}
            exclusivePaths={loginPaths}
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
            notFound={<Error404 />}
            setRouteTree={setRouteTree}
            routeTree={routeTree}
        />
    );
}
