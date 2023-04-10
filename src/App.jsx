import { React } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";


import { Home } from "./components/Home";
import { Room } from "./components/Room";
import { Page404 } from "./components/Page404";


function App() {
    return (
        <BrowserRouter>
            <div className="App-header">
                <header>
                    <h1>REst Chat</h1>
                </header>
            </div>
            <Routes>
                <Route key="/" path="/" exact={true} element={<Home />} />
                <Route key="/room" path="/room" exact={true} element={<Room />}>
                    <Route key=":id" path=":id" element={<Room />} />
                </Route>
                <Route key="*" path="*" exact={false} element={<Page404 />} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;

