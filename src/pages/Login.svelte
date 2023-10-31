<script>
    import Page from "../components/Page.svelte";
    import Link from "../components/routing/Link.svelte";
    import { createMutation } from "@tanstack/svelte-query";
    import { API } from "../utils/api";
    import { Capacitor } from "@capacitor/core";

    const serviceTokenMutation = createMutation({
        mutationFn: async () =>
            await API.user.login({
                client_url: Capacitor.isNativePlatform()
                    ? "dhanriti://dhanriti.shivank.dev"
                    : window.location.origin,
            }),
        onSuccess: (data) => {
            //window.open(data.url, "_blank");
            window.location.href = data.url;
        },
    });
</script>

<Page>
    <div class="flex items-center justify-center h-full">
        <div>
            <h1 class="font-extrabold text-5xl">Welcome to Dhanriti</h1>
            <br />
            <p>Login with your Kacker account to get started.</p>
            <br />
            <button
                class="flex items-center justify-between gap-4 bg-purple-600/20 rounded-lg p-4 text-purple-500 ripple"
                on:click={() => $serviceTokenMutation.mutate()}
            >
                <div class="flex items-center gap-4">
                    <img
                        src="https://auth.writeroo.net/kacker_w.svg"
                        class="w-6"
                        alt="Kacker"
                    />
                    Login with Kacker
                </div>
                <div>
                    {#if $serviceTokenMutation.isPending}
                        <i class="fas fa-spinner fa-spin" />
                    {:else}
                        <i class="far fa-arrow-right-long" />
                    {/if}
                </div>
            </button>
        </div>
    </div>
</Page>
