import { Theme } from "@kacker/ui";

export type Storage = {
    user?: any;
    auth_token?: string;
    theme?: Theme | null;
    language?: string;
    selectedCanvasId?: string | null;
};
