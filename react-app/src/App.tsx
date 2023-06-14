import "./App.css";
import Container from "@cloudscape-design/components/container";
import NavBar from "./Navbar";
import {Outlet} from "react-router-dom";
import React from "react";

interface AppProps {
    outlet?: JSX.Element;
}

function App ({outlet}: AppProps): JSX.Element {
    return (
        <div className="App">
            <NavBar />
            <Container>
                { outlet ? outlet : <Outlet /> }
            </Container>
        </div>
    );
}

export default App;
