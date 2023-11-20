import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Canvas, Funnel, Tank } from "../types/canvas";
import { Drawer, Menu, MenuOption, Switch, WarningDrawer } from "@kacker/ui";
import { t } from "i18next";
import TankForm from "./forms/TankForm";
import { API } from "../utils/api";
import { useMutation } from "@tanstack/react-query";
import FunnelBlock from "./Funnel";

export default function TankBlock(props: {
    className?: string;
    funnel: Partial<Funnel>;
    canvas: Canvas;
    handleRefresh?: () => void;
}) {
    const { className, funnel, canvas, handleRefresh } = props;
    const tank = funnel.out_tank as Partial<Tank>;

    const [newTankDrawerOpen, setNewTankDrawerOpen] = useState(false);
    const [editTankDrawerOpen, setEditTankDrawerOpen] = useState(false);
    const [deleteTankDrawerOpen, setDeleteTankDrawerOpen] = useState(false);
    const [deleteStrategy, setDeleteStrategy] = useState<
        "discard" | "transfer"
    >("transfer");

    const tankOptions: MenuOption[] = [
        {
            label: t("tank.edit"),
            icon: "pen",
            onClick: () => {
                setEditTankDrawerOpen(true);
            },
        },
        {
            label: t("tank.trigger_inflow"),
            icon: "tank-water",
            onClick: () => {
                console.log("trigger inflow");
            },
        },
        {
            label: t("tank.delete"),
            icon: "trash",
            onClick: () => {
                setDeleteTankDrawerOpen(true);
            },
            dangerous: true,
        },
    ];

    const mainTankOptions: MenuOption[] = [
        {
            label: t("tank.connect"),
            icon: "plus",
            onClick: () => {
                setNewTankDrawerOpen(true);
            },
        },
    ];

    const options = tank.external_id
        ? [...mainTankOptions, ...tankOptions]
        : mainTankOptions;

    const newTankMutation = useMutation(
        ({ tank, funnel }: { tank: Partial<Tank>; funnel: Partial<Funnel> }) =>
            API.tanks.create(canvas.external_id, tank),
        {
            onSuccess: async (data, variables) => {
                await API.funnels.create(canvas.external_id, {
                    ...variables.funnel,
                    out_tank_external_id: data.external_id,
                });
                handleRefresh?.();
                setNewTankDrawerOpen(false);
            },
        }
    );

    const updateTankMutation = useMutation(
        ({ tank }: { tank: Partial<Tank>; funnel?: Partial<Funnel> }) =>
            API.tanks.save(canvas.external_id || "", tank),
        {
            onSuccess: async (data, variables) => {
                await API.funnels.save(canvas.external_id || "", {
                    ...variables.funnel,
                });
                handleRefresh?.();
                setEditTankDrawerOpen(false);
            },
        }
    );

    const deleteTankMutation = useMutation(
        ({ tank }: { tank: Partial<Tank>; funnel: Partial<Funnel> }) =>
            API.tanks.delete(
                canvas.external_id || "",
                tank.external_id || "",
                deleteStrategy
            ),
        {
            onSuccess: async (data, variables) => {
                await API.funnels.delete(
                    canvas.external_id || "",
                    variables.funnel.external_id || ""
                );
                handleRefresh?.();
                setDeleteTankDrawerOpen(false);
            },
        }
    );

    const handleNewTankSubmit = async (
        tank: Partial<Tank>,
        funnel?: Partial<Funnel>
    ) => {
        if (!funnel) return;
        await newTankMutation.mutateAsync({ tank, funnel });
    };

    const handleUpdateTankSubmit = async (
        tank: Partial<Tank>,
        funnel?: Partial<Funnel>
    ) => {
        if (!tank.external_id || !funnel) return;
        await updateTankMutation.mutateAsync({ tank, funnel });
    };

    return (
        <>
            <div className="flex flex-col items-center shrink-0">
                <Menu
                    menu={options}
                    title={tank.name}
                    content={
                        tank.capacity && (
                            <div className="p-4">
                                <div className="w-full h-1 rounded-full bg-secondaryActive overflow-hidden">
                                    <div
                                        style={{
                                            width: `${
                                                ((tank.filled || 0) /
                                                    tank.capacity) *
                                                100
                                            }%`,
                                        }}
                                        className="h-full bg-yellow-500"
                                    />
                                </div>
                                <div className="text-gray-500 text-sm text-center mb-4 mt-2">
                                    {((tank.filled || 0) / tank.capacity) * 100}
                                    % filled
                                </div>
                            </div>
                        )
                    }
                >
                    <button
                        className={twMerge(
                            `flex items-center flex-col gap-2 justify-center bg-primaryOpaque z-10 rounded-lg relative overflow-hidden ring-2 ring-transparent transition-all mt-5`,
                            className
                        )}
                        style={{
                            width: tank.capacity
                                ? Math.max(
                                      Math.min(tank.capacity * 0.05, 500),
                                      150
                                  )
                                : 200,
                            height: tank.capacity
                                ? Math.max(
                                      Math.min(tank.capacity * 0.025, 250),
                                      75
                                  )
                                : 100,
                        }}
                        id={`tank-${tank.external_id || "main-tank"}`}
                    >
                        {tank.capacity && (
                            <div
                                className="bg-accent-500/50 absolute inset-x-0 bottom-0 -z-10"
                                style={{
                                    height: `${
                                        ((tank.filled || 0) / tank.capacity) *
                                        100
                                    }%`,
                                }}
                            />
                        )}
                        <div>{tank.name}</div>
                        <div className="font-extrabold">
                            Rs. {tank.filled}/
                            {tank.capacity ? (
                                tank.capacity
                            ) : (
                                <i className="far fa-infinity" />
                            )}
                        </div>
                    </button>
                </Menu>
                <div className="flex gap-4">
                    {tank.funnels?.map((funnel, index) =>
                        funnel.out_tank ? (
                            <React.Fragment key={index}>
                                <FunnelBlock
                                    canvas={canvas}
                                    tank={tank}
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
            <Drawer
                title={t("tank.connect")}
                open={newTankDrawerOpen}
                onClose={() => {
                    setNewTankDrawerOpen(false);
                }}
            >
                <TankForm
                    parentTank={tank.external_id ? (tank as Tank) : undefined}
                    onSubmit={handleNewTankSubmit}
                    submitLoading={newTankMutation.isLoading}
                />
            </Drawer>
            <Drawer
                title={t("tank.edit")}
                open={editTankDrawerOpen}
                onClose={() => {
                    setEditTankDrawerOpen(false);
                }}
            >
                <TankForm
                    parentTank={tank.external_id ? (tank as Tank) : undefined}
                    tank={tank}
                    funnel={funnel}
                    onSubmit={handleUpdateTankSubmit}
                    submitLoading={updateTankMutation.isLoading}
                />
            </Drawer>
            <WarningDrawer
                open={deleteTankDrawerOpen}
                title="Delete Tank"
                content={
                    tank.funnels?.length ? (
                        "You cannot delete a tank that is connected to other tanks. First delete all connected tanks."
                    ) : (
                        <>
                            Are you sure you want to delete this tank? This
                            action is irreversible.
                            <br />
                            <br />
                            Please choose what happens to the money in this
                            tank.
                            <br />
                            <br />
                            <Switch
                                value={deleteStrategy}
                                onChange={(value) =>
                                    setDeleteStrategy(value as any)
                                }
                                options={[
                                    {
                                        label: "Discard Money",
                                        value: "discard",
                                    },
                                    {
                                        label: "Transfer to Main Tank",
                                        value: "transfer",
                                    },
                                ]}
                            />
                        </>
                    )
                }
                onConfirm={
                    tank.funnels?.length
                        ? undefined
                        : () => {
                              deleteTankMutation.mutate({ tank, funnel });
                              setDeleteTankDrawerOpen(false);
                          }
                }
                onCancel={() => setDeleteTankDrawerOpen(false)}
            />
        </>
    );
}
