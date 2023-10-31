<script lang="ts">
    import type { routes } from "../routes";
    import Link from "./routing/Link.svelte";
    import url from "../utils/url";

    type NavButton = {
        name: string;
        href: keyof typeof routes;
        icon?: string;
        image?: string;
    };

    const navItems: NavButton[] = [
        {
            name: "Settings",
            href: "/settings",
            icon: "cog",
        },
        {
            name: "Home",
            href: "/",
            image: "/dhanriti.svg",
        },
        {
            name: "Profile",
            href: "/profile",
            icon: "user",
        },
    ];
</script>

<nav class="flex items-center w-full">
    {#each navItems as navItem}
        <Link
            href={navItem.href}
            class="flex-1 flex items-center justify-center h-full py-3 ripple"
        >
            {#if navItem.image}
                <img
                    src={navItem.image}
                    alt={navItem.name}
                    class={`w-10 h-10 ${
                        $url.pathname === navItem.href ? "" : "grayscale"
                    }`}
                />
            {:else}
                <i
                    class={`fa${
                        $url.pathname === navItem.href
                            ? "s text-yellow-500"
                            : "r"
                    } fa-${navItem.icon} text-xl`}
                />
                <i
                    class={`fas fa-${navItem.icon} opacity-0 w-0 h-0 overflow-hidden`}
                />
            {/if}
        </Link>
    {/each}
</nav>
