import { writable, type Writable } from 'svelte/store';
import type { Route } from './types/router';
import type { User } from './types/user';

const routerValue: Route[] = []

export type Storage = {
    auth_token?: string;
    user?: User;
    currentCanvasId?: string;
}

export const routerStore: Writable<Route[]> = writable(routerValue);
export const storage: Writable<Storage | null> = writable(null);

routerStore.subscribe(value => {
    // add to history
    if (value.length > 0) {
        //window.history.pushState(Number(history.state) + 1, '', value[value.length - 1].path);
        //sessionStorage.setItem("positionLastShown", String(Number(history.state) + 1));
    }
    console.log(value);
});

storage.subscribe(value => {
    if (value !== null) {
        localStorage.setItem("storage", JSON.stringify(value));
    } else {
        storage.set(JSON.parse(localStorage.getItem("storage") || "{}"));
    }
});

