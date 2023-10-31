import type { Storage } from "../store";
import type { User } from "../types/user";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

type endpoint = `${string}`;

export type paginatedResponse<T> = {
    count: number;
    has_next: boolean;
    has_previous: boolean;
    offset: number;
    results: T[];
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

    //console.log("Making request to", url, "with payload", payload, "and headers", headers)

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
        fetch: (username: string) => request(`users/${username}`),
        save: (details: Partial<User>) =>
            request(`users/me`, "PATCH", details),
    }
};