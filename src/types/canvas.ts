import type { BaseModelType } from "./common";
import type { FlowRateType, FlowType } from "./enums";

export type Canvas = BaseModelType & {
    name: string;
    description?: string;
    inflow: number;
    inflow_rate: string;
    filled: number;
    funnels?: Funnel[];
    last_flows?: Flow[];
    total_money?: number;
};

export type Funnel = BaseModelType & {
    name: string;
    description?: string;
    flow_rate: string;
    flow_rate_type: FlowRateType;
    flow: number;
    flow_type: FlowType;
    out_tank?: Tank;
    in_tank?: Tank;
    out_tank_external_id?: string | null;
    in_tank_external_id?: string | null;
    last_flows?: Flow[];
};

export type Tank = BaseModelType & {
    name: string;
    description?: string;
    capacity: number;
    color?: string;
    funnels?: Funnel[];
    filled: number;
};

export type Flow = BaseModelType & {
    flowed: number;
    canvas?: Canvas;
    funnel?: Funnel;
    manual?: boolean;
};
