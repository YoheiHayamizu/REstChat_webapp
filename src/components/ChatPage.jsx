import React from "react";
import axios from 'axios';

import ReactScollableFeed from "react-scrollable-feed";
// import { w3cwebsocket as WebSocket } from 'websocket';

class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            input: '',
            ws: null,
            turn: 0,
            conversationEnded: false,
        };
    }

    connectWs = () => {
        const { token, session } = this.props;
        // this.ws = new WebSocket('ws://localhost:3500/chat?token=' + token);
        this.ws = new WebSocket('wss://rest-dlg-server.herokuapp.com/chat?token=' + token);
    }

    restoreData = async () => {
        let response = null;
        // const url = 'http://localhost:3500/refresh_token'
        const url = 'https://rest-dlg-server.herokuapp.com/refresh_token'
        try {
            response = await axios.post(url, { withCredentials: true, "token": this.props.token }).then((res) => {
                const data = res.data;
                return data
            });
        } catch (error) {
            console.error(error);
        }
        console.log(response);
        // console.log(response.messages)
        this.setState({
            messages: response.messages,
            turn: response.turns,
        });
    };

    componentDidMount() {
        console.log('ChatPage is loaded');
        console.log(this.props.token, this.props.session)
        this.restoreData();

        this.connectWs();

        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('WebSocket Status: Connected');
        };

        this.ws.onmessage = this.handleMessage;
    }

    componentWillUnmount() {
        console.log('WebSocket Status: Disconnected');
        this.ws.close();
    }

    handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message Recieved: " + data['msg'])

        const message = {
            role: data['role'],
            msg: data['msg'],
            timestamp: data['timestamp']
        }
        this.setState((prevState) => ({
            messages: [...prevState.messages, message],
        }));
    };

    handleInputChange = (e) => {
        this.setState({ input: e.target.value });
    };

    handleInputSubmit = (e) => {
        e.preventDefault();
        // Check if input is empty or only whitespace
        if (!this.state.input.replace(/\s/g, '').length) {
            return;
        }

        // Do not allow to send more than 10 messages
        if (this.state.turn >= 10) {
            return;
        }

        const message = {
            role: 'Dealer',
            msg: this.state.input,
            timestamp: new Date().toISOString()
        }

        this.ws.send(this.state.input);

        this.setState((prevState) => ({
            messages: [...prevState.messages, message],
            input: '',
            turn: prevState.turn + 1,
        }));
    };

    render() {
        const { messages, input, turn } = this.state;
        const { roomName, personaData, roomProperty } = this.props.session;

        return (
            <div>
                <div className="content">
                    <div className='instruction-box'>
                        <h1>{roomName}</h1>
                        <h2>Features that you need to inform to a customer</h2>
                        <div className="content">
                            <ul>
                                <li>
                                    <strong> Size (LxW Sq. feet): </strong>
                                    {roomProperty["Size (LxW Sq. feet)"]}
                                </li>
                                <li>
                                    <strong>Flooring: </strong>
                                    {roomProperty["Flooring"]}
                                </li>
                                <li>
                                    <strong>Lighting: </strong>
                                    {roomProperty["Lighting"].map((data, index) => (
                                        <div key={index} className="text ">
                                            <div>{data}</div>
                                        </div>
                                    ))}
                                </li>
                                <li>
                                    <strong>View: </strong>
                                    {roomProperty["View"]}
                                </li>
                                <li>
                                    <strong>Room Relationship: </strong>
                                    {roomProperty["Room Relationship"].map((data, index) => (
                                        <div key={index} className="text ">
                                            <div>{data}</div>
                                        </div>
                                    ))}
                                </li>
                            </ul>
                        </div>

                        <h2>Customer's persona</h2>
                        <div className="content">
                            <ul>
                                <li>
                                    <strong> Age: </strong>
                                    {personaData["age"]}
                                </li>
                                <li>
                                    <strong> Gender: </strong>
                                    {personaData["gender"]}
                                </li>
                                <li>
                                    <strong> Marital Status: </strong>
                                    {personaData["marital_status"]}
                                </li>
                                <li>
                                    <strong> Education: </strong>
                                    {personaData["education"]}
                                </li>
                                <li>
                                    <strong> Income: </strong>
                                    {personaData["income"]}
                                </li>
                                <li>
                                    <strong> Location: </strong>
                                    {personaData["location"]}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="message-box">
                        <h1>Chat History</h1>

                        <ReactScollableFeed>
                            <div className="messages">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className="text ">
                                        <div><strong>{message.role}: </strong> {message.msg}</div>
                                    </div>
                                ))}
                            </div>
                        </ReactScollableFeed>

                        <form onSubmit={this.handleInputSubmit} className="inputs">
                            <input
                                type="text"
                                id="message"
                                value={input}
                                onChange={this.handleInputChange}
                                placeholder="Type your message here"
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>

                <div>
                    <button className="App-button" onClick={this.props.handleEnd}>
                        {turn < 10 ? <div>Click to close. ({10 - turn} turns left)</div> : <div>Please press the button to close the window.</div>}
                    </button>
                </div>
            </div>
        );
    }
}

export default ChatPage;