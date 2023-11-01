<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import type { Tank } from "../types/canvas";
    import Drawer from "./Drawer.svelte";

    let className: string = "";
    export let tank: Partial<Tank>;

    let drawerOpen: boolean = false;

    export { className as class };
</script>

<button
    class={twMerge(
        `flex items-center flex-col gap-2 justify-center bg-gray-500/20 z-10 rounded-lg relative overflow-hidden ring-2 ring-transparent transition-all ${
            drawerOpen ? "ring-yellow-500" : ""
        }`,
        className
    )}
    on:click={() => {
        drawerOpen = true;
    }}
>
    {#if tank.filled && tank.capacity}
        <div
            class="bg-yellow-500/40 absolute inset-x-0 bottom-0 -z-10"
            style={`height:${(tank.filled / tank.capacity) * 100}%;`}
        />
    {/if}
    <div>
        {tank.name}
    </div>
    <div class="font-extrabold">
        Rs. {tank.filled}
        /
        {#if tank.capacity}
            {tank.capacity}
        {:else}
            <i class="far fa-infinity" />
        {/if}
    </div>
</button>
<Drawer
    open={drawerOpen}
    onClose={() => {
        drawerOpen = false;
    }}
>
    <div class="p-4">
        <h1 class="font-extrabold text-3xl text-center">
            {tank.name}
        </h1>
    </div>
</Drawer>
