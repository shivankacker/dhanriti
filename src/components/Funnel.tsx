import { useEffect, useState } from "react";
import { Canvas, Funnel, Tank } from "../types/canvas";

export default function FunnelBlock(props: {
    canvas: Canvas;
    tank: Partial<Tank>;
    funnel: Partial<Funnel>;
    handleRefresh?: () => void;
}) {
    const { canvas, tank, funnel: initial, handleRefresh } = props;

    const [funnel, setFunnel] = useState<Partial<Funnel>>(initial);

    const [color, setColor] = useState<"gray" | "var(--kui-accent500)">("gray");

    const [coordinates, setCoordinates] = useState<{
        x: number;
        y: number;
        h: number;
        w: number;
        direction: "s" | "sw" | "se";
    }>({ x: 0, y: 0, h: 0, w: 0, direction: "s" });

    const calculateCoordinates = () => {
        const inTankElement = document.getElementById(
            `tank-${tank.external_id}`
        );
        const outTankElement = document.getElementById(
            `tank-${funnel.out_tank?.external_id}`
        );
        const canvasElement = document.getElementById(
            `canvas-${canvas.external_id}`
        );
        if (!inTankElement || !outTankElement || !canvasElement) return;
        //calculate coordinates relative to canvas
        const inTankRect = inTankElement.getBoundingClientRect();
        const outTankRect = outTankElement.getBoundingClientRect();
        const canvasRect = canvasElement.getBoundingClientRect();

        const inTankRelativeRect = {
            x: inTankRect.x - canvasRect.x,
            y: inTankRect.y - canvasRect.y,
            width: inTankRect.width,
            height: inTankRect.height,
        };

        const outTankRelativeRect = {
            x: outTankRect.x - canvasRect.x,
            y: outTankRect.y - canvasRect.y,
            width: outTankRect.width,
            height: outTankRect.height,
        };

        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        let direction: "s" | "sw" | "se" = "s";

        // if intank is directly above outtank such that their middle bottom and middle top come within 50 pixels of each other
        const inTankMiddleBottom = {
            y: inTankRelativeRect.y + inTankRelativeRect.width / 2,
            x: inTankRelativeRect.x + inTankRelativeRect.height,
        };

        const outTankMiddleTop = {
            y: outTankRelativeRect.y,
            x: outTankRelativeRect.x + outTankRelativeRect.width / 2,
        };

        if (Math.abs(inTankMiddleBottom.x - outTankMiddleTop.x) < 50) {
            direction = "s";
            w = 10;
            h =
                outTankRelativeRect.y -
                (inTankRelativeRect.y + inTankRelativeRect.height);
            x = inTankRelativeRect.x + inTankRelativeRect.width / 2;
            y = inTankRelativeRect.y + inTankRelativeRect.height;
        } else if (inTankMiddleBottom.x > outTankMiddleTop.x) {
            const leftOffset = inTankRelativeRect.x - outTankRelativeRect.x;
            x = outTankRelativeRect.x + leftOffset / 2;
            y = inTankRelativeRect.y + inTankRelativeRect.height / 2;
            w = leftOffset / 2;
            h = outTankRelativeRect.y - y;
            direction = "sw";
        } else {
            x = inTankRelativeRect.x + inTankRelativeRect.width;
            y = inTankRelativeRect.y + inTankRelativeRect.height / 2;
            w = (outTankRelativeRect.x + outTankRelativeRect.width - x) / 2;
            h = outTankRelativeRect.y - y;
            direction = "se";
        }

        //console.table({
        //    name: `${tank.name || "Main Tank"} -- ${funnel.out_tank?.name}`,
        //    x,
        //    y,
        //    w,
        //    h,
        //    direction
        //})

        setCoordinates({ x, y, w, h, direction });
    };

    useEffect(() => {
        calculateCoordinates();
        if (
            initial.last_flows?.[0].external_id !==
            funnel.last_flows?.[0].external_id
        ) {
            setColor("var(--kui-accent500)");
            setTimeout(() => {
                setColor("gray");
            }, 1000);
        }
        setFunnel(initial);
    }, [initial, tank, canvas]);

    useEffect(() => {
        calculateCoordinates();
    }, []);

    return (
        <div
            id={`funnel-${funnel.external_id}`}
            className={`absolute text-xs z-10 opacity-50  `}
            style={{
                left: coordinates.x,
                top: coordinates.y,
                width: coordinates.w,
                height: coordinates.h,
                borderLeft: ["s", "sw"].includes(coordinates.direction)
                    ? `10px solid ${color}`
                    : "none",
                borderRight:
                    coordinates.direction === "se"
                        ? `10px solid ${color}`
                        : "none",
                borderTop:
                    coordinates.direction === "s"
                        ? "none"
                        : `10px solid ${color}`,
                transition: "border-color 1s",
            }}
        />
    );
}
