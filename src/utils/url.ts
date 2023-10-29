import { derived, writable, type Readable, type Subscriber, type Invalidator, type Unsubscriber } from 'svelte/store';

interface UrlStore { subscribe: (this: void, run: Subscriber<URL>, invalidate?: Invalidator<URL> | undefined) => Unsubscriber; }

export function createUrlStore(): UrlStore {
    // Ideally a bundler constant so that it's tree-shakable

    const href = writable(window.location.href);

    const originalPushState: typeof history.pushState = history.pushState;
    const originalReplaceState: typeof history.replaceState = history.replaceState;

    const updateHref = (): void => href.set(window.location.href);

    history.pushState = function () {
        originalPushState.apply(this, arguments as any);
        updateHref();
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments as any);
        updateHref();
    };

    window.addEventListener('popstate', updateHref);
    window.addEventListener('hashchange', updateHref);

    return {
        subscribe: derived(href, ($href: string) => new URL($href)).subscribe
    };
}

// If you're using in a pure SPA, you can return a store directly and share it everywhere
const defaultUrlStore = createUrlStore();
export default defaultUrlStore;
