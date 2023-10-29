import type { SvelteComponent } from "svelte";
import type { routes } from "../routes";

export type Route = {
    id: number,
    name?: string,
    path: keyof typeof routes,
    component: any,
    subNavigations?: {
        name: string,
        onBack?: () => void,
    }[],
    onBack?: () => void,
}