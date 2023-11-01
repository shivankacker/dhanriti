<script lang="ts">
  import TailwindCss from "./tailwind.svelte";
  import { routerStore, storage } from "./store";
  import { onMount } from "svelte";
  import { mainRoutes, navigate, routes } from "./routes";
  import type { Route } from "./types/router";
  import BottomBar from "./components/BottomBar.svelte";
  import "./global.css";
  import { Ripple } from "./utils/ripple";
  import url from "./utils/url";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";

  const queryClient = new QueryClient();

  $: thisRoute = $routerStore[$routerStore.length - 1] as Route | undefined;

  const handlePopstate = (e: Event) => {
    //check if went back
    const event = e as PopStateEvent;
    const positionLastShown =
      Number(sessionStorage.getItem("positionLastShown")) || 0;

    let position = Number(history.state) || null;

    if (position === null) {
      position = positionLastShown + 1;
      history.replaceState(position, "");
    }

    sessionStorage.setItem("positionLastShown", String(position));

    const direction = Math.sign(position - positionLastShown);

    if (direction === -1) {
      routerStore.update((store) => store.slice(0, store.length - 1));
    } else if (
      direction === 1 ||
      (direction === 0 && window.location.pathname in ["/", ""])
    ) {
      routerStore.update((store) => [
        ...store,
        {
          id: Date.now(),
          component: routes[window.location.pathname as keyof typeof routes],
          path: window.location.pathname as any,
        },
      ]);
    } else if (direction === 0) {
      routerStore.update((store) => [
        {
          id: Date.now(),
          component: routes["/"],
          path: "/",
        },
        {
          id: Date.now() + 1,
          component: routes[window.location.pathname as keyof typeof routes],
          path: window.location.pathname as any,
        },
      ]);
    }
  };

  const handleRipple = (e: any) => {
    Ripple(e);
  };

  onMount(() => {
    window.addEventListener("popstate", handlePopstate);
    window.addEventListener("pageshow", handlePopstate);
    document.body.addEventListener("click", handleRipple);
    //navigate($url.pathname as any);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
      window.removeEventListener("pageshow", handlePopstate);
      document.body.removeEventListener("click", handleRipple);
    };
  });

  $: !["/login", "/vishnu-login"].includes($url.pathname) &&
    !$storage?.auth_token &&
    navigate("/login");
</script>

<TailwindCss />
<QueryClientProvider client={queryClient}>
  <main
    class="flex flex-col items-center justify-between h-screen bg-black text-white"
  >
    <div class="flex-1 w-full">
      <svelte:component this={thisRoute?.component} />
    </div>
    <BottomBar />
    {#each $routerStore.filter((route) => !mainRoutes.includes(route.path)) as route, i}
      <div class="fixed inset-0 bg-black" style={`z-index:${100 * (i + 1)}`}>
        <svelte:component this={route.component} />
      </div>
    {/each}
  </main>
</QueryClientProvider>
