<script lang="ts">
    import { createMutation } from "@tanstack/svelte-query";
    import Page from "../components/Page.svelte";
    import { API } from "../utils/api";
    import { storage } from "../store";
    import { navigate } from "../routes";
    import { onMount } from "svelte";

    const urlParams = new URLSearchParams(window.location.search);
    const serviceToken = urlParams.get("token");
    const success = urlParams.get("success");

    const loginMutation = createMutation({
        mutationFn: async () =>
            await API.user.login({ login_token: serviceToken || "" }),
        onSuccess: (data) => {
            storage.set({
                ...$storage,
                user: data.user,
                auth_token: data.token,
            });
            navigate("/");
        },
    });

    onMount(() => {
        $loginMutation.mutate();
    });
</script>

<Page>
    {#if $loginMutation.isError || !serviceToken}
        <div>An error occurred</div>
        <br />
        <button
            class="bg-yellow-500 rounded-xl p-2 px-4 text-black font-extrabold"
        >
            Try Again
        </button>
    {/if}
    {#if $loginMutation.isPending}
        <div class="items-center justify-center flex h-full">
            Please Wait...
        </div>
    {/if}
</Page>
