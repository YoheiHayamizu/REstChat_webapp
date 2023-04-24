import React, { Component } from "react";

import "./App.css";


// import { Home } from "./components/Home";
// import { Room } from "./components/Room";
// import { Page404 } from "./components/Page404";
import HomePage from "/app/rest_chat/src/components/HomePage";
import ChatPage from "/app/rest_chat/src/components/ChatPage";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            session: null,
            isChatStart: false,
        };
        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const session = localStorage.getItem('session');

        if (session) {
            this.setState({
                token: token,
                session: JSON.parse(session),
                isChatStart: true,
            });
            // console.log("Reloaded: ", token, session);
        }
    }

    handleStart(token, session) {
        localStorage.setItem('token', token);
        localStorage.setItem('session', JSON.stringify(session));
        console.log("Start a chat: ", token, session);
        this.setState({ token: token, session: session, isChatStart: true });
    }

    handleEnd() {
        localStorage.removeItem('token');
        localStorage.removeItem('session');
        this.setState({ token: '', session: null, isChatStart: false });
    }


    render() {
        const { token, session, isChatStart } = this.state;

        return (
            <div className="App" >
                <div className="App-header">
                    <header>
                        <h1>REst Chat</h1>
                    </header>
                </div>
                {!isChatStart ? (
                    <HomePage handleStart={this.handleStart} />
                ) : (
                    <ChatPage token={token} session={session} handleEnd={this.handleEnd} />
                )}
            </div>
        );
    }
}

export default App;

