import React from "react";
import ReactDOM from "react-dom/client";
import {App} from './App'
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>

);