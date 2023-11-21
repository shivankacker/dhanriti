import { useTranslation } from "react-i18next";
import {
    Button,
    Drawer,
    FallBack,
    IconButton,
    Menu,
    Select,
    WarningDrawer,
} from "@kacker/ui";
import { useAtom } from "jotai";
import { storageAtom } from "../store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../utils/api";
import { Canvas } from "../types/canvas";
import CanvasBlock from "../components/Canvas";
import { useEffect, useState } from "react";
import CanvasForm from "../components/forms/CanvasForm";
import Loading from "../components/loading";
import { navigate } from "raviger";

export default function HomePage() {
    const { t } = useTranslation();

    const [storage, setStorage] = useAtom(storageAtom);
    const [editCanvasDrawerOpen, setEditCanvasDrawerOpen] = useState(false);
    const [deleteCanvasDrawerOpen, setDeleteCanvasDrawerOpen] = useState(false);
    const [createCanvasDrawerOpen, setCreateCanvasDrawerOpen] = useState(false);

    const handleRefresh = async () => {
        await Promise.all([canvasQuery.refetch()]);
    };

    const canvasQuery = useQuery(["canvases"], () => API.canvases.list(), {
        enabled: !!storage?.auth_token,
        refetchInterval: 1000 * 60,
    });
    const canvases: Canvas[] | undefined = canvasQuery.data?.results;
    const selectedCanvas = canvases?.find(
        (canvas) => canvas.external_id === storage?.selectedCanvasId
    );

    const canvasUpdateMutation = useMutation(
        ({ canvas }: { canvas: Partial<Canvas> }) =>
            API.canvases.save(canvas.external_id || "", canvas),
        {
            onSuccess: (data) => {
                canvasQuery.refetch();
                setStorage({ ...storage, selectedCanvasId: data.external_id });
            },
        }
    );

    const canvasCreateMutation = useMutation(
        ({ canvas }: { canvas: Partial<Canvas> }) =>
            API.canvases.create(canvas),
        {
            onSuccess: () => {
                canvasQuery.refetch();
            },
        }
    );

    const deleteCanvasMutation = useMutation(
        ({ canvasId }: { canvasId: string }) =>
            API.canvases.delete(canvasId || ""),
        {
            onSuccess: () => {
                canvasQuery.refetch();
            },
        }
    );

    useEffect(() => {
        if (
            canvases &&
            storage?.auth_token &&
            canvases.length > 0 &&
            (!storage?.selectedCanvasId ||
                !canvases.find(
                    (canvas) => canvas.external_id === storage?.selectedCanvasId
                ))
        ) {
            setStorage({
                ...storage,
                selectedCanvasId: canvases[0].external_id,
            });
        }
    }, [canvases, storage?.auth_token]);

    useEffect(() => {
        const timeout = setInterval(() => {
            canvasQuery.refetch();
        }, 1000 * 60);

        return () => {
            clearInterval(timeout);
        };
    }, []);

    return (
        <div className="h-screen flex flex-col justify-between">
            {canvasQuery.isLoading && <Loading />}
            {canvases && canvases.length > 0 && (
                <div className="p-2 flex gap-2 justify-between items-center">
                    <Select
                        title={t("select_canvas")}
                        value={storage?.selectedCanvasId || ""}
                        onChange={(value) =>
                            setStorage({
                                ...storage,
                                selectedCanvasId: value || "",
                            })
                        }
                        options={
                            canvases?.map((canvas) => ({
                                label: canvas.name,
                                value: canvas.external_id,
                            })) || []
                        }
                        className="w-full"
                    />
                    <IconButton
                        className="shrink-0"
                        icon="circle-plus"
                        onClick={() => setCreateCanvasDrawerOpen(true)}
                    />
                    {storage?.selectedCanvasId && (
                        <Menu
                            menu={[
                                {
                                    label: "Edit Canvas",
                                    onClick: () => {
                                        setEditCanvasDrawerOpen(true);
                                    },
                                    icon: "pen",
                                },
                                {
                                    label: "Flow Records",
                                    onClick: () => {
                                        navigate(
                                            "/flows?canvas=" +
                                                storage?.selectedCanvasId
                                        );
                                    },
                                    icon: "chart-line",
                                },
                                {
                                    label: "Delete Canvas",
                                    onClick: () => {
                                        setDeleteCanvasDrawerOpen(true);
                                    },
                                    icon: "trash",
                                    dangerous: true,
                                },
                            ]}
                        >
                            <IconButton
                                className="shrink-0"
                                icon="ellipsis-vertical"
                            />
                        </Menu>
                    )}
                </div>
            )}
            {canvases && canvases.length === 0 && (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center p-4">
                        <div className="text-8xl">💸</div>
                        <br />
                        <h1 className="text-3xl font-extrabold">
                            {t("welcome")}!
                        </h1>
                        <br />
                        <p>
                            Dhanriti, as the name suggests is a tool to help you
                            plan your finances. Let&apos;s get started by
                            creating a canvas.
                        </p>
                        <br />
                        <br />
                        <Button
                            onClick={() => setCreateCanvasDrawerOpen(true)}
                            className="w-full"
                        >
                            Create Canvas
                        </Button>
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col relative">
                {selectedCanvas ? (
                    <FallBack loading={canvasQuery.isLoading}>
                        <CanvasBlock
                            canvas={selectedCanvas}
                            handleRefresh={handleRefresh}
                        />
                        <div className="absolute bottom-20 inset-x-0">
                            <div className="text-center text-gray-500 text-sm">
                                Total
                            </div>
                            <div className=" text-center text-2xl font-extrabold">
                                <i className="far fa-indian-rupee-sign text-xl" />{" "}
                                {(
                                    Math.round(
                                        (selectedCanvas.total_money || 0) * 100
                                    ) / 100
                                ).toLocaleString("en-IN")}
                            </div>
                        </div>
                    </FallBack>
                ) : (
                    <div></div>
                )}
            </div>
            <Drawer
                open={editCanvasDrawerOpen}
                onClose={() => setEditCanvasDrawerOpen(false)}
                title="Edit Canvas"
            >
                <CanvasForm
                    canvas={selectedCanvas}
                    onSubmit={async (canvas) => {
                        await canvasUpdateMutation.mutateAsync({ canvas });
                        setEditCanvasDrawerOpen(false);
                    }}
                    submitLoading={canvasUpdateMutation.isLoading}
                />
            </Drawer>
            <Drawer
                open={createCanvasDrawerOpen}
                onClose={() => setCreateCanvasDrawerOpen(false)}
                title="Create Canvas"
            >
                <CanvasForm
                    onSubmit={async (canvas) => {
                        await canvasCreateMutation.mutateAsync({ canvas });
                        setCreateCanvasDrawerOpen(false);
                    }}
                    submitLoading={canvasCreateMutation.isLoading}
                />
            </Drawer>
            <WarningDrawer
                open={deleteCanvasDrawerOpen}
                title="Delete Canvas"
                content="Are you sure you want to delete this canvas? This action is irreversible."
                onConfirm={() => {
                    deleteCanvasMutation.mutate({
                        canvasId: selectedCanvas?.external_id || "",
                    });
                    setDeleteCanvasDrawerOpen(false);
                }}
                onCancel={() => setDeleteCanvasDrawerOpen(false)}
            />
        </div>
    );
}
