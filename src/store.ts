import { atom } from "jotai";
import { Storage } from "./types/storage";
import { RouteTree } from "./router/AppRouter";

export const storageAtom = atom<Storage | null>(null);
export const routeTreeAtom = atom<RouteTree[]>([]);
export const backListenerAtom = atom<(() => void) | null>(null);
