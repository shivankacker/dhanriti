import { useEffect, useState } from "react";
import { Canvas } from "../../types/canvas";
import { Button, Input } from "@kacker/ui";
import cronstrue from "cronstrue";

export default function CanvasForm(props: {
    canvas?: Partial<Canvas>;
    onSubmit: (tank: Partial<Canvas>) => void;
    submitLoading?: boolean;
}) {
    const { canvas: initial, onSubmit, submitLoading } = props;

    const newCanvas: Partial<Canvas> = {
        name: "",
        inflow: 0,
        inflow_rate: "0 0 1 * *",
    };

    const [canvas, setCanvas] = useState(initial || newCanvas);
    const [cronString, setCronString] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(canvas);
        if (initial) return;
        setCanvas(newCanvas);
    };

    useEffect(() => {
        setCanvas(initial || newCanvas);
    }, [initial]);

    useEffect(() => {
        let cronString = "";
        try {
            cronString = cronstrue.toString(canvas.inflow_rate || "");
        } catch (error) {
            cronString = "Invalid Cron";
        }
        setCronString(cronString);
    }, [canvas.inflow_rate]);

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Name"
                    value={canvas.name}
                    onChange={(e) =>
                        setCanvas({ ...canvas, name: e.target.value })
                    }
                />
                {canvas.external_id && (
                    <Input
                        label="Main Tank Filled"
                        value={canvas.filled}
                        left={<i className="fas fa-indian-rupee-sign" />}
                        onChange={(e) =>
                            setCanvas({
                                ...canvas,
                                filled: parseInt(e.target.value),
                            })
                        }
                        type="number"
                    />
                )}
                <Input
                    label="Inflow"
                    value={canvas.inflow}
                    left={<i className="fas fa-indian-rupee-sign" />}
                    onChange={(e) =>
                        setCanvas({
                            ...canvas,
                            inflow: parseInt(e.target.value),
                        })
                    }
                    type="number"
                />
                <div>
                    <Input
                        label="Flow Rate"
                        value={canvas.inflow_rate}
                        onChange={(e) =>
                            setCanvas({
                                ...canvas,
                                inflow_rate: e.target.value,
                            })
                        }
                        right="Cron"
                    />
                    <br />
                    <p>{cronString}</p>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    loading={submitLoading}
                >
                    {initial ? "Update Canvas" : "Create Canvas"}
                </Button>
            </form>
        </div>
    );
}
