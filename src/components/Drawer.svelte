<script lang="ts">
    type DrawerMenu = {
        name: string;
        icon: string;
        onClick: () => void;
    };

    export let open: boolean = false;
    export let onClose: () => void;
    export let menu: DrawerMenu[] | null = null;
</script>

<div
    class={`fixed inset-0 bg-black/20 flex flex-col z-40 transition-all ${
        open ? "visible opacity-100" : "invisible opacity-0"
    }`}
>
    <button
        class="flex-1 bg-transparent border-0 block w-full h-full"
        on:click={onClose}
    />
    <div
        class={`bg-gray-900 rounded-t-lg pt-4 z-40 absolute inset-x-0 transition-all ${
            open ? "bottom-0" : "-bottom-full"
        }`}
    >
        <div
            class="w-[100px] bg-gray-700 rounded-full h-[5px] absolute top-4 left-[calc(50vw-50px)]"
        />
        {#if menu}
            {#each menu as { name, icon, onClick }}
                <button
                    class="flex items-center gap-3 w-full p-4 ripple text-xl"
                    on:click={onClick}
                >
                    <i class={`fad fa-${icon}`} />
                    {name}
                </button>
            {/each}
        {:else}
            <slot />
        {/if}
    </div>
</div>
