import { FallBack, Page } from "@kacker/ui";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "raviger";
import { API } from "../utils/api";
import { Flow } from "../types/canvas";
import moment from "moment";

export default function FlowRecords() {
    const [qparams] = useQueryParams();

    const { funnel, canvas, tank } = qparams;

    const flowQuery = useQuery(["flows", qparams], () =>
        API.flow.list(canvas, {
            funnel__external_id: funnel,
            funnel__in_tank__external_id: tank,
            ordering: "-created_at",
        })
    );

    const flows: Flow[] | undefined = flowQuery.data?.results;

    return (
        <Page
            headerProps={{
                title: "Flow Records",
            }}
        >
            <div className="p-4">
                {!canvas && <div>Error</div>}
                <div className="flex flex-col gap-2">
                    <FallBack
                        className="h-[200px]"
                        loading={flowQuery.isLoading}
                    >
                        {flows?.map((flow, index) => (
                            <div
                                key={index}
                                className="border-secondary rounded-xl p-4 border"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500">
                                            {moment(flow.created_at).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </div>
                                        <div className="text-sm text-primaryLightfont">
                                            {moment(flow.created_at).format(
                                                "h:mm A"
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {flow.manual && (
                                            <>
                                                <i className="fas fa-hand-paper text-yellow-500" />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-center flex-1">
                                        {!flow.funnel ? (
                                            <>
                                                <i className="far fa-clock" />
                                            </>
                                        ) : (
                                            <>
                                                {flow.funnel.in_tank?.name ||
                                                    "Main Tank"}
                                            </>
                                        )}
                                    </div>
                                    <div className="text-center flex-1 font-bold text-accent-500">
                                        <div>
                                            Rs.{" "}
                                            {(
                                                Math.round(flow.flowed * 100) /
                                                100
                                            ).toLocaleString("en-IN")}
                                        </div>
                                        <i className="far fa-arrow-right-long" />
                                    </div>
                                    <div className="text-center flex-1">
                                        {flow.funnel?.out_tank ? (
                                            <>{flow.funnel.out_tank.name}</>
                                        ) : (
                                            <>Main Tank</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </FallBack>
                </div>
            </div>
        </Page>
    );
}
