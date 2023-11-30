import { useQuery } from "@tanstack/react-query";
import { Tank } from "../types/canvas";
import { API } from "../utils/api";
import { Button, FallBack, Page } from "@kacker/ui";
import { t } from "i18next";
import { Payment } from "../types/payments";
import { useState } from "react";

export default function UpiPay(props: { canvasID: string; tankID: string }) {
    const { canvasID, tankID } = props;
    const [payment, setPayment] = useState<Partial<Payment>>({
        amount: 0,
        description: "",
    });

    const tankQuery = useQuery<Tank>(["tank", tankID], () =>
        API.tanks.fetch(canvasID, tankID)
    );
    const tank = tankQuery.data;

    const handlePay = async () => {
        console.log(payment);
    };

    return (
        <Page
            headerProps={{
                title: "Pay With UPI",
            }}
        >
            <FallBack loading={tankQuery.isLoading}>
                {tank && (
                    <div className="h-full flex flex-col items-center justify-between">
                        <div className="text-center p-4 flex-1 flex items-center justify-between">
                            <div>
                                <div>
                                    {t("upi.paying", { name: tank?.name })}
                                </div>
                                <div className="flex items-center px-6">
                                    <i className="far fa-indian-rupee-sign text-4xl" />
                                    <input
                                        value={payment.amount}
                                        onChange={(e) =>
                                            setPayment({
                                                ...payment,
                                                amount: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        type="number"
                                        className="flex-1 text-8xl font-extrabold bg-transparent w-full text-center"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    Balance after payment:{" "}
                                    {tank?.filled - (payment.amount || 0)}
                                </div>
                            </div>
                        </div>
                        <div className="p-10 w-full">
                            <Button
                                className="w-full"
                                onClick={handlePay}
                                disabled={
                                    !payment.amount ||
                                    payment.amount <= 0 ||
                                    payment.amount > tank?.filled
                                }
                            >
                                {t("tank.pay_with_upi")}{" "}
                                <i className="far fa-arrow-right-long ml-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </FallBack>
        </Page>
    );
}
