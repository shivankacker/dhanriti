<script lang="ts">
    import { createMutation, createQuery } from "@tanstack/svelte-query";
    import Page from "../components/Page.svelte";
    import Link from "../components/routing/Link.svelte";
    import { API } from "../utils/api";
    import type { Canvas } from "../types/canvas";
    import Tank from "../components/Tank.svelte";
    import { storage } from "../store";
    import { onMount } from "svelte";
    import Drawer from "../components/Drawer.svelte";

    const canvasQuery = createQuery({
        queryKey: ["canvas"],
        queryFn: () => API.canvases.list(),
    });

    const createCanvasMutation = createMutation({
        mutationFn: async () => await API.canvases.create(newCanvas),
        onSuccess: (data) => {
            $canvasQuery.refetch();
        },
    });

    let canvases: Canvas[] | undefined;
    let newCanvas: Partial<Canvas> = {
        name: "",
        inflow: 0,
        inflow_rate: "0 0 1 * *",
    };

    let drawerOpen: boolean = false;

    $: canvases = $canvasQuery.data?.results;
    $: console.log(canvases);

    let currentCanvasId: string | undefined;

    $: storage.set({
        ...$storage,
        currentCanvasId,
    });

    let currentCanvas: Canvas | undefined;

    $: currentCanvas = canvases?.find((c) => c.external_id === currentCanvasId);

    $: !$storage?.currentCanvasId &&
        storage.set({
            ...$storage,
            currentCanvasId: canvases?.[0]?.external_id,
        });

    const handleFormSubmit = (e: Event) => {
        e.preventDefault();
        $createCanvasMutation.mutate();
    };

    const baseCronOptions = [
        {
            value: "0 0 * * *",
            label: "Every day",
        },
        {
            value: "0 0 * * 0",
            label: "Every week",
        },
        {
            value: "0 0 1 * *",
            label: "Every month",
        },
        {
            value: "0 0 1 1 *",
            label: "Every year",
        },
    ];

    onMount(() => {
        currentCanvasId =
            $storage?.currentCanvasId || canvases?.[0]?.external_id;
    });
</script>

<div class="h-full flex flex-col">
    <div class="p-4">
        {#if canvases && canvases.length > 0}
            <select
                class="p-3 rounded-lg border bg-gray-900 border-gray-800 text-white w-full block"
                bind:value={currentCanvasId}
            >
                {#each canvases as canvas}
                    <option value={canvas.external_id}>{canvas.name}</option>
                {/each}
            </select>
        {/if}
    </div>
    <div class="flex-1">
        {#if canvases && canvases.length === 0}
            <div class="p-4">
                <h1 class="text-4xl font-extrabold">
                    Hey! Welcome to Dhanriti. Let's get started by creating a
                    canvas
                </h1>
                <br />
                <form on:submit={handleFormSubmit}>
                    <input
                        bind:value={newCanvas.name}
                        type="text"
                        placeholder="Canvas Name"
                        class="p-3 rounded-lg border bg-gray-900 border-gray-800 text-white w-full block mb-4"
                    />
                    Inflow:
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <input
                                bind:value={newCanvas.inflow}
                                type="number"
                                placeholder="Inflow Amount"
                                class="p-3 rounded-lg border bg-gray-900 border-gray-800 text-white w-full mt-4 block"
                            />
                            <div>Rs.</div>
                        </div>
                        <select
                            bind:value={newCanvas.inflow_rate}
                            class="p-3 rounded-lg border bg-gray-900 border-gray-800 text-white w-full mt-4 block"
                        >
                            {#each baseCronOptions as op}
                                <option value={op.value}>
                                    {op.label}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <button
                        class="bg-yellow-500 text-black p-3 rounded-lg mt-4 w-full font-extrabold ripple"
                        disabled={$createCanvasMutation.isPending}
                    >
                        Create
                    </button>
                </form>
            </div>
        {/if}
        {#if canvases && canvases.length > 0}
            <div class="w-screen h-full overflow-auto">
                <div
                    class="bg-gray-900 relative flex flex-col items-center dhanriti-canvas min-w-full min-h-full"
                >
                    <div
                        class="bg-gray-800 w-[130px] h-[30px] flex items-center justify-center text-gray-500 font-extrabold"
                    >
                        <i class="far fa-arrow-down" />
                        &nbsp; Inflow &nbsp;
                        <i class="far fa-arrow-down" />
                    </div>
                    <Tank
                        tank={{
                            name: "Main Tank",
                            filled: 200,
                        }}
                        class=" w-[200px] h-[100px] mt-5"
                    />
                    <button
                        class="fixed bottom-20 right-10 w-14 h-14 bg-yellow-500 flex items-center justify-center rounded-full shadow-xl text-2xl text-black"
                        on:click={() => {
                            drawerOpen = true;
                        }}
                    >
                        <i class="fas fa-plus" />
                    </button>
                </div>
                <Drawer
                    open={drawerOpen}
                    onClose={() => {
                        drawerOpen = false;
                    }}
                    menu={[
                        {
                            name: "New Tank",
                            icon: "tank-water",
                            onClick: () => {
                                drawerOpen = false;
                            },
                        },
                        {
                            name: "New Funnel",
                            icon: "funnel-dollar",
                            onClick: () => {
                                drawerOpen = false;
                            },
                        },
                    ]}
                />
            </div>
        {/if}
    </div>
</div>
