import { useAtom } from "jotai";
import { routeTreeAtom } from "../store";
import { useEffect } from "react";
import { Activity } from "@kacker/ui";

export default function RouteScreen(props: { routeIndex: number }) {
    const { routeIndex } = props;

    const [routeTree, setRouteTree] = useAtom(routeTreeAtom);

    useEffect(() => {
        setRouteTree((prev) => [
            ...prev.slice(0, routeIndex),
            {
                ...prev[routeIndex],
                status: "ready",
            },
            ...prev.slice(routeIndex + 1),
        ]);
    }, []);

    return (
        <Activity activityIndex={routeIndex} data-route-index={routeIndex}>
            {routeTree[routeIndex].node}
        </Activity>
    );
}
