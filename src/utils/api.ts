import { Canvas, Funnel, Tank } from "../types/canvas";
import { Payment } from "../types/payments";
import { Storage } from "../types/storage";
export const API_BASE_URL = import.meta.env.VITE_API_URL;

type endpoint = `${string}`;

export type paginatedResponse<T> = {
    count: number;
    has_next: boolean;
    has_previous: boolean;
    offset: number;
    results: T[];
};

export type PaginatedFilters = {
    limit?: number;
    offset?: number;
    ordering?: string;
    search?: string;
};

type methods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

type options = {
    formdata?: boolean;
    external?: boolean;
    headers?: any;
    auth?: boolean;
};

const request = async (
    endpoint: endpoint,
    method: methods = "GET",
    data: any = {},
    options: options = {}
) => {
    const { formdata, external, headers, auth: isAuth } = options;

    let url = external ? endpoint : API_BASE_URL + endpoint;
    let payload: null | string = formdata ? data : JSON.stringify(data);

    if (method === "GET") {
        const requestParams = data
            ? `?${Object.keys(data)
                  .filter(
                      (key) => data[key] !== null && data[key] !== undefined
                  )
                  .map((key) => `${key}=${data[key]}`)
                  .join("&")}`
            : "";
        url += requestParams;
        payload = null;
    }
    const storage: Storage = JSON.parse(
        (await localStorage.getItem("dhanriti-storage")) || "{}"
    );
    const localToken = storage.auth_token;

    const auth =
        isAuth === false ||
        typeof localToken === "undefined" ||
        localToken === null
            ? ""
            : "Token " + localToken;

    const response = await fetch(url, {
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
            ...headers,
        },
        body: payload,
    });
    try {
        const txt = await response.clone().text();
        if (txt === "") {
            return {};
        }
        const json = await response.clone().json();
        if (json && response.ok) {
            return json;
        } else {
            throw json;
        }
    } catch (error) {
        throw { error };
    }
};

export const API = {
    user: {
        login: (data: {
            email?: string;
            password?: string;
            client_url?: string;
            login_token?: string;
        }) => request("auth/login", "POST", data),
        me: () => request("users/me"),
        save: (details: any) => request(`users/me`, "PATCH", details),
    },
    canvases: {
        list: (filters: PaginatedFilters = {}) =>
            request(`canvases`, "GET", filters),
        fetch: (id: string) => request(`canvases/${id}`),
        create: (canvas: Partial<Canvas>) =>
            request(`canvases`, "POST", canvas),
        save: (canvasId: string, canvas: Partial<Canvas>) =>
            request(`canvases/${canvasId}`, "PATCH", canvas),
        delete: (id: string) => request(`canvases/${id}`, "DELETE"),
    },
    tanks: {
        list: (canvasId: string, filters: PaginatedFilters = {}) =>
            request(`canvases/${canvasId}/tanks`, "GET", filters),
        fetch: (canvasId: string, id: string) =>
            request(`canvases/${canvasId}/tanks/${id}`),
        create: (canvasId: string, tank: Partial<Tank>) =>
            request(`canvases/${canvasId}/tanks`, "POST", tank),
        save: (canvasId: string, tank: Partial<Tank>) =>
            request(
                `canvases/${canvasId}/tanks/${tank.external_id}`,
                "PATCH",
                tank
            ),
        delete: (
            canvasId: string,
            id: string,
            strategy: "discard" | "transfer" = "discard"
        ) =>
            request(
                `canvases/${canvasId}/tanks/${id}?strategy=${strategy}`,
                "DELETE"
            ),
    },
    funnels: {
        list: (canvasId: string, filters: PaginatedFilters = {}) =>
            request(`canvases/${canvasId}/funnels`, "GET", filters),
        fetch: (canvasId: string, id: string) =>
            request(`canvases/${canvasId}/funnels/${id}`),
        create: (canvasId: string, funnel: Partial<Funnel>) =>
            request(`canvases/${canvasId}/funnels`, "POST", funnel),
        save: (canvasId: string, funnel: Partial<Funnel>) =>
            request(
                `canvases/${canvasId}/funnels/${funnel.external_id}`,
                "PATCH",
                funnel
            ),
        delete: (canvasId: string, id: string) =>
            request(`canvases/${canvasId}/funnels/${id}`, "DELETE"),
    },
    flow: {
        list: (
            canvas_id: string,
            filters: PaginatedFilters & {
                funnel__external_id?: string;
                funnel__out_tank__external_id?: string;
                funnel__in_tank__external_id?: string;
            } = {}
        ) => request(`canvases/${canvas_id}/flows`, "GET", filters),
        retrieve: (canvas_id: string, flow_id: string) =>
            request(`canvases/${canvas_id}/flows/${flow_id}`),
        trigger: (canvas_id: string, funnel_external_id?: string) =>
            request(
                `canvases/${canvas_id}/flows/trigger${
                    funnel_external_id
                        ? `?funnel_external_id=${funnel_external_id}`
                        : ""
                }`,
                "POST"
            ),
    },
    payments: {
        list: (
            canvas_id: string,
            tank_id: string,
            filters: PaginatedFilters = {}
        ) => request(`canvases/${canvas_id}/tanks/${tank_id}/payments`, "GET"),
        retrieve: (canvas_id: string, tank_id: string, payment_id: string) =>
            request(
                `canvases/${canvas_id}/tanks/${tank_id}/payments/${payment_id}`
            ),
        create: (
            canvas_id: string,
            tank_id: string,
            payment: Partial<Payment>
        ) =>
            request(
                `canvases/${canvas_id}/tanks/${tank_id}/payments`,
                "POST",
                payment
            ),
    },
};
