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
            // url: 'http://localhost:3500/refresh_token',
            url: 'https://rest-dlg-server.herokuapp.com/refresh_token',
            // ws_url: 'ws://localhost:3500/chat?token=',
            ws_url: 'wss://rest-dlg-server.herokuapp.com/chat?token='
        };
    }

    connectWs = () => {
        const { token } = this.props;
        // this.ws = new WebSocket(this.state.ws_url + token);
        this.ws = new WebSocket(this.state.ws_url + token);
    }

    restoreData = async () => {
        let response = null;
        try {
            response = await axios.post(this.state.url, { withCredentials: true, "token": this.props.token }).then((res) => {
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
            turn: response.message_counts,
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


        const flexTextarea = (el) => {
            const dummy = el.querySelector('.FlexTextarea__dummy');
            el.querySelector('.FlexTextarea__textarea').addEventListener('input', (e) => {
                dummy.textContent = e.target.value + '\u200b';
            });
        };
        document.querySelectorAll('.FlexTextarea').forEach(flexTextarea);
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
            msg: data['msg']
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
            msg: this.state.input
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
                        <h1>{roomName.charAt(0).toUpperCase() + roomName.slice(1).toLowerCase()}</h1>
                        <br />
                        <h2>Features that you need to inform</h2>
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
                                    <strong> Job: </strong>
                                    {personaData["job"]}
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
                                    <strong>Hobbies: </strong>
                                    {/* {personaData["hobbies"]} */}
                                    {personaData["hobbies"].map((data, index) => (
                                        <div key={index} className="text ">
                                            <div>{data}</div>
                                        </div>
                                    ))}
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
                            {/* <input
                                type="text"
                                id="message"
                                value={input}
                                onChange={this.handleInputChange}
                                placeholder="Type your message here"
                            /> */}
                            <button type="submit">Send</button>
                            <div className="FlexTextarea">
                                <div className="FlexTextarea__dummy" aria-hidden="true"></div>
                                <textarea
                                    id="FlexTextarea"
                                    type="text"
                                    className="FlexTextarea__textarea"
                                    value={input}
                                    onChange={this.handleInputChange}
                                    placeholder="Type your message here">
                                </textarea>
                            </div>
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

