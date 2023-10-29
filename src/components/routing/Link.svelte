<script lang="ts">
    import { navigate, routes } from "../../routes";

    export let href: keyof typeof routes;
    let className: string = "";

    const handleClick = (e: Event) => {
        e.preventDefault();
        if (window.location.pathname === href) return;
        navigate(href);
    };

    export { className as class };
</script>

<a {href} on:click={handleClick} class={className}>
    <slot />
</a>
