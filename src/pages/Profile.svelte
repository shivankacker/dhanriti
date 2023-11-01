<script lang="ts">
    import Page from "../components/Page.svelte";
    import { storage } from "../store";

    const handleLogout = () => {
        storage.set({
            ...$storage,
            user: undefined,
            auth_token: undefined,
        });
    };
</script>

<Page>
    <div class="flex flex-col items-center justify-center py-10 gap-2">
        <div
            class="bg-gray-900 rounded-full text-4xl flex items-center justify-center w-24 h-24"
        >
            <i class="fad fa-user" />
        </div>
        <div class="text-2xl font-extrabold">
            {$storage?.user?.full_name || "User"}
        </div>
        <div class="text-sm text-gray-500">
            {$storage?.user?.email}
        </div>
        <button class="text-red-500 mt-4" on:click={handleLogout}>
            Logout
        </button>
    </div>
</Page>
