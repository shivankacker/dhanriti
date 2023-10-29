
import Home from "./pages/Home.svelte";
import Test from "./pages/Test.svelte";
import { routerStore } from "./store";
import type { Route } from "./types/router";

export const routes = {
    "/": Home,
    "/settings": Test,
    "/profile": Test,
    "/test": Test,
    "/test/2": Test,
    "/test/3": Test,
};

export const navigate = (path: keyof typeof routes) => {
    const newRoute = routes[path];
    routerStore.update((router) => [
        ...router,
        {
            id: Date.now(),
            path: path,
            component: newRoute,
        },
    ]);
    window.history.pushState(Number(history.state) + 1, '', path);
    sessionStorage.setItem("positionLastShown", String(Number(history.state) + 1));
};
