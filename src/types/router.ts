export type RouterHistory = {
    path: string;
    subActions?: ActionHistory[];
};

export type ActionHistory = {
    name?: string;
    onBack?: () => void;
};
