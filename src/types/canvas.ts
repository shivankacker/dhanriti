import type { BaseModelType } from "./common";
import type { FlowRateType, FlowType } from "./enums";

export type Canvas = BaseModelType & {
    name: string,
    description: string,
    inflow: number,
    inflow_rate: string,
    funnels?: Funnel[]
}

export type Funnel = BaseModelType & {
    name: string,
    description: string,
    flow_rate: string,
    flow_rate_type: FlowRateType,
    flow: number,
    flow_type: FlowType
    out_tank: Tank,
    out_tank_external_id?: string,
    in_tank_external_id?: string,
}

export type Tank = BaseModelType & {
    name: string,
    description: string,
    capacity: number,
    color: Canvas,
    funnels?: Funnel[]
    filled: number
}