import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import {useNavigate} from "react-router-dom";


function NavBar (): JSX.Element {
    const navigate = useNavigate();

    function handleNavClick (href: string): void {
        navigate(href);
    }

    return (
        <TopNavigation
            identity={{
                "href": "#",
                "title": "Polygon Creator"
            }}
            utilities={[
                {
                    "ariaLabel": "All Polygons",
                    "onClick": () => handleNavClick("/"),
                    "text": "All Polygons",
                    "type": "button"
                },
                {
                    "ariaLabel": "New Polygon",
                    "onClick": () => handleNavClick("/edit/new"),
                    "text": "New Polygon",
                    "type": "button"
                }
            ]}
        />
    );
}

export default NavBar;
