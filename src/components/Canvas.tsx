import React, { useEffect, useRef } from "react";
import { Canvas, Tank } from "../types/canvas";
import TankBlock from "./Tank";
import FunnelBlock from "./Funnel";
import { FlowRateType } from "../types/enums";
import { storageAtom } from "../store";
import { useAtom } from "jotai";

export default function CanvasBlock(props: {
    canvas: Canvas;
    handleRefresh?: () => void;
}) {
    const { canvas, handleRefresh } = props;
    const canvasRef = useRef<HTMLDivElement>(null);
    const [storage, setStorage] = useAtom(storageAtom);

    useEffect(() => {
        //scroll to center
        if (canvasRef.current) {
            canvasRef.current.scrollLeft =
                canvasRef.current.scrollWidth / 2 -
                canvasRef.current.clientWidth / 2;
        }
    }, [storage?.selectedCanvasId]);

    return (
        <div
            className="w-screen overflow-auto flex-1 flex h-full"
            ref={canvasRef}
        >
            <div
                className="bg-secondary flex flex-col items-center dhanriti-canvas relative px-10 pb-10"
                id={`canvas-${canvas.external_id}`}
            >
                <div className="w-screen" />
                <div className="bg-secondaryActive w-[130px] h-[30px] flex items-center justify-center text-gray-500 font-extrabold">
                    <i className="far fa-arrow-down" />
                    &nbsp; Inflow &nbsp;
                    <i className="far fa-arrow-down" />
                </div>
                <TankBlock
                    canvas={canvas}
                    funnel={{
                        flow_rate_type: FlowRateType.TIMELY,
                        flow_rate: canvas.inflow_rate,
                        out_tank: {
                            name: "Main Tank",
                            filled: canvas.filled,
                        } as Tank,
                    }}
                    className=" w-[200px] h-[100px] mt-5"
                    handleRefresh={handleRefresh}
                />
                <div className="flex gap-4 shrink-0">
                    {canvas.funnels?.map((funnel, index) =>
                        funnel.out_tank ? (
                            <React.Fragment key={index}>
                                <FunnelBlock
                                    canvas={canvas}
                                    tank={{
                                        external_id: "main-tank",
                                    }}
                                    funnel={funnel}
                                    handleRefresh={handleRefresh}
                                />
                                <TankBlock
                                    canvas={canvas}
                                    funnel={funnel}
                                    handleRefresh={handleRefresh}
                                />
                            </React.Fragment>
                        ) : null
                    )}
                </div>
            </div>
        </div>
    );
}
