import "./App.css";
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
            { outlet ? outlet : <Outlet /> }
        </div>
    );
}

export default App;
