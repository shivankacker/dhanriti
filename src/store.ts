import { writable, type Writable } from 'svelte/store';
import type { Route } from './types/router';

const routerValue: Route[] = []

export const routerStore: Writable<Route[]> = writable(routerValue);

routerStore.subscribe(value => {
    // add to history
    if (value.length > 0) {
        //window.history.pushState(Number(history.state) + 1, '', value[value.length - 1].path);
        //sessionStorage.setItem("positionLastShown", String(Number(history.state) + 1));
    }
    console.log(value);
});