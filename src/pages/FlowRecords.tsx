import { Page } from "@kacker/ui";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "raviger";
import { API } from "../utils/api";
import { Flow } from "../types/canvas";

export default function FlowRecords() {
    const [qparams] = useQueryParams();

    const { funnel, canvas } = qparams;

    const flowQuery = useQuery(["flows", qparams], () =>
        API.flow.list(canvas, {
            funnel_external_id: funnel,
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
                {flows?.map((flow, index) => (
                    <div key={index}></div>
                ))}
            </div>
        </Page>
    );
}
