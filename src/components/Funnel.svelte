<script lang="ts">
    import type { Funnel } from "../types/canvas";
    import { twMerge } from "tailwind-merge";

    let className: string;
    export let funnel: Funnel;

    export { className as class };
</script>

<div class={twMerge("bg-gray-600", className)}>
    {funnel.name}
</div>
