import "./index.css";
import "@cloudscape-design/global-styles/index.css";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import App from "./App";
import ErrorDisplay from "./error";
import PolygonEditor from "./PolygonEditor";
import PolygonTable from "./PolygonTable";
import React from "react";
import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
    {
        "children": [
            {
                "children": [
                    {
                        "element": <PolygonTable />,
                        "path": "/"
                    },
                    {
                        "element": <PolygonEditor />,
                        "path": "/edit/:polygonId"
                    }
                ],
                "path": "/"
            }
        ],
        "element": <App />,
        "errorElement": <App outlet={<ErrorDisplay />} />,
        "path": "/"
    }
]);

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
