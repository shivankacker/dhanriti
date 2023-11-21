import { useQuery } from "@tanstack/react-query";
import { Canvas, Funnel, Tank } from "../../types/canvas";
import { FlowRateType, FlowType } from "../../types/enums";
import { useAtom } from "jotai";
import { storageAtom } from "../../store";
import { API } from "../../utils/api";
import { Button, Input, Select, Switch } from "@kacker/ui";
import { useEffect, useState } from "react";
import cronstrue from "cronstrue";

export default function TankForm(props: {
    tank?: Partial<Tank>;
    funnel?: Partial<Funnel>;
    parentTank?: Tank;
    onSubmit: (tank: Partial<Tank>, funnel: Partial<Funnel>) => void;
    submitLoading?: boolean;
}) {
    const {
        tank: initial,
        funnel: initialFunnel,
        onSubmit,
        submitLoading,
        parentTank,
    } = props;
    const [storage, setStorage] = useAtom(storageAtom);

    const newTank: Partial<Tank> = {
        name: "",
    };
    const newFunnel: Partial<Funnel> = {
        name: "-",
        out_tank_external_id: undefined,
        in_tank_external_id: parentTank?.external_id || null,
        flow_rate: "0 0 1 * *",
        flow_rate_type: FlowRateType.CONSEQUENT,
        flow: 0,
        flow_type: FlowType.ABSOLUTE,
    };

    const [tank, setTank] = useState(initial || newTank);
    const [tanks, setTanks] = useState<Tank[] | undefined>(undefined);
    const [funnel, setFunnel] = useState(initialFunnel || newFunnel);
    const [cronString, setCronString] = useState("");

    const canvasQuery = useQuery(
        ["canvas", storage?.selectedCanvasId],
        () => API.canvases.fetch(storage?.selectedCanvasId || ""),
        {
            enabled: !!storage?.selectedCanvasId,
        }
    );

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(tank, funnel);
        setFunnel(newFunnel);
        setTank(newTank);
    };

    useEffect(() => {
        setTank(initial || newTank);
    }, [initial]);

    useEffect(() => {
        setFunnel(initialFunnel || newFunnel);
    }, []);

    const canvas: Canvas | undefined = canvasQuery.data;

    useEffect(() => {
        const tanks: Tank[] = [];

        const getTanks = (funnel: Funnel) => {
            if (funnel.out_tank) {
                tanks.push(funnel.out_tank);
                funnel.out_tank.funnels?.forEach((funnel) => {
                    getTanks(funnel);
                });
            }
        };

        if (canvas) {
            canvas.funnels?.forEach((funnel) => {
                getTanks(funnel);
            });
        }

        setTanks(tanks);
    }, [canvas]);

    useEffect(() => {
        let cronString = "";
        try {
            cronString = cronstrue.toString(funnel.flow_rate || "");
        } catch (error) {
            cronString = "Invalid Cron";
        }
        setCronString(cronString);
    }, [funnel.flow_rate]);

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Name"
                    value={tank.name}
                    onChange={(e) => setTank({ ...tank, name: e.target.value })}
                />
                {tank.external_id && (
                    <Input
                        label="Tank Filled"
                        value={tank.filled}
                        onChange={(e) =>
                            setTank({
                                ...tank,
                                filled: parseInt(e.target.value),
                            })
                        }
                        left={<i className="fas fa-indian-rupee-sign" />}
                        type={"number"}
                    />
                )}
                <Input
                    label="Tank Capacity"
                    value={tank.capacity}
                    onChange={(e) =>
                        setTank({ ...tank, capacity: parseInt(e.target.value) })
                    }
                    left={<i className="fas fa-indian-rupee-sign" />}
                    type={"number"}
                />
                <div className="text-lg font-bold">Connect to</div>

                {tanks && (
                    <Select
                        value={funnel.in_tank_external_id || null}
                        onChange={(val) =>
                            setFunnel({ ...funnel, in_tank_external_id: val })
                        }
                        options={[
                            {
                                label: "Main Tank",
                                value: null,
                            },
                            ...tanks
                                .map((tank) => ({
                                    label: tank?.name || "",
                                    value: tank?.external_id || "",
                                }))
                                .filter(
                                    (tank) =>
                                        tank.value !==
                                        funnel.out_tank?.external_id
                                ),
                        ]}
                    />
                )}
                <Input
                    label="Flow..."
                    value={funnel.flow}
                    onChange={(e) =>
                        setFunnel({ ...funnel, flow: parseInt(e.target.value) })
                    }
                    left={<i className="fas fa-indian-rupee-sign" />}
                    type={"number"}
                    right={
                        <>
                            <Select
                                value={funnel.flow_type || FlowType.ABSOLUTE}
                                className="w-15"
                                onChange={(val) =>
                                    setFunnel({
                                        ...funnel,
                                        flow_type: parseInt(val || "0"),
                                    })
                                }
                                options={[
                                    {
                                        label: "/-",
                                        value: FlowType.ABSOLUTE,
                                    },
                                    {
                                        label: "%",
                                        value: FlowType.PERCENTAGE,
                                    },
                                ]}
                            />
                        </>
                    }
                />
                <Switch
                    value={funnel.flow_rate_type || FlowRateType.CONSEQUENT}
                    onChange={(val) =>
                        setFunnel({
                            ...funnel,
                            flow_rate_type: parseInt(val || "0"),
                        })
                    }
                    options={[
                        {
                            label: "Everytime connected tank has an inflow",
                            value: FlowRateType.CONSEQUENT,
                        },
                        {
                            label: "Every...",
                            value: FlowRateType.TIMELY,
                        },
                    ]}
                />
                {funnel.flow_rate_type === FlowRateType.TIMELY && (
                    <div>
                        <Input
                            label="Flow Rate"
                            value={funnel.flow_rate}
                            onChange={(e) =>
                                setFunnel({
                                    ...funnel,
                                    flow_rate: e.target.value,
                                })
                            }
                            right="Cron"
                        />
                        <br />
                        <p>{cronString}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    loading={submitLoading}
                >
                    {tank.external_id ? "Save" : "Create"} Tank
                </Button>
            </form>
        </div>
    );
}
