import { BaseModelType } from "./common";

export type Payment = BaseModelType & {
    amount: number;
    description: string;
};
