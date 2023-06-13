import {render, screen} from "@testing-library/react";
import App from "./App";
import React from "react";

test(
    "renders learn react link",
    (): void => {
        render(<App />);
        const linkElement: HTMLElement = screen.getByText(/All Polygons/iu);
        expect(linkElement).toBeInTheDocument();
    }
);
