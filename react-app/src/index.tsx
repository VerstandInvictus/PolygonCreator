import "./index.css";
import "@cloudscape-design/global-styles/index.css";
import {apiCallerProps, polygonApiResponse} from "./Interfaces";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import ErrorDisplay from "./error";
import PolygonEditor from "./PolygonEditor";
import PolygonTable from "./PolygonTable";
import React from "react";
import ReactDOM from "react-dom/client";

export async function polygonApiCaller ({payload, verb, target}: apiCallerProps) : Promise<polygonApiResponse> {
    // All API calls in the app are done from here, whether they're react-router Loaders or direct calls.
    const config: AxiosRequestConfig = {
        data: payload || null,
        method: verb,
        url: target
    };
    try {
        const polygonResponse: AxiosResponse = await axios.request(config);
        return {
            "polygons": polygonResponse.data,
            "success": true
        };
    } catch (error) {
        let errorMessage : string;
        if (error instanceof AxiosError) {
            errorMessage = error?.message || "Server did not provide details";
        } else {
            errorMessage = String(error);
        }
        return {
            "error": errorMessage,
            "polygons": [],
            "success": false
        };
    }
}

export async function loadAllPolygons () : Promise<polygonApiResponse> {
    return await polygonApiCaller({target: "/api/polygons/all", verb: "get"});
}

export async function loadSpecificPolygon (polygonId: string) : Promise<polygonApiResponse> {
    if (polygonId === "new") {
        // Shortcut - we know there's nothing to get, so just return an empty result.
        return {
            "polygons": [],
            "success": true
        };
    }
    return await polygonApiCaller({
        target: `/api/polygons/get/${polygonId}`,
        verb: "get"
    });
}

const router = createBrowserRouter([
    {
        children: [
            // This double-nested structure allows errors everywhere, including 404, to be caught by react-router
            {
                children: [
                    {
                        element: <PolygonTable />,
                        loader: loadAllPolygons,
                        path: "/"
                    },
                    {
                        element: <PolygonEditor />,
                        loader: async ({params}) : Promise<polygonApiResponse> => {
                            return await loadSpecificPolygon(params.polygonId ? params.polygonId : "new");
                        },
                        path: "/edit/:polygonId"
                    }
                ],
                path: "/"
            }
        ],
        element: <App />,
        // Errors get kicked to this version of the page, which keeps the navbar present for them to go back
        errorElement: <App outlet={<ErrorDisplay />} />,
        path: "/"
    }
]);

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
