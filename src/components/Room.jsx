import { React, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactScollableFeed from "react-scrollable-feed";
import '../index.css';
import axios from "axios";

export const Room = () => {
    const params = useParams();
    const locations = useLocation();

    const token = params.id;
    const room = locations.state.houseInstance.room;
    const image = "../images/" + locations.state.houseInstance.img;
    const jsonFile = "../properties/" + locations.state.houseInstance.houseId + ".json";
    const [houseProperty, setHouseProperty] = useState({});

    // const url = 'http://localhost:3500/refresh_token'
    // const ws_url = 'ws://localhost:3500/chat?token=' + token
    const url = 'https://rest-dlg-server.herokuapp.com/refresh_token'
    const ws_url = 'wss://rest-dlg-server.herokuapp.com/chat?token=' + token

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [ws, setWs] = useState(null);

    const [count, setCount] = useState(0);

    useEffect(() => {
        const restoreData = async () => {
            let response = null;
            try {
                response = await axios.post(url, { withCredentials: true, "token": token }).then((res) => {
                    const data = res.data;
                    return data
                });
            } catch (error) {
                console.error(error);
            }
            // console.log(response);
            // console.log(response.messages)
            setMessages(response.messages);
        };

        fetch(`${jsonFile}`).then(res => res.json())
            .then(res => {
                setHouseProperty(res["Property Features"][room.charAt(0).toUpperCase() + room.slice(1).toLowerCase()])
            }).catch(_ => { console.log(_); return _; });
        // console.log(houseProperty)

        const ws = new WebSocket(ws_url);
        setWs(ws);

        // console.log(image);

        ws.onopen = () => {
            console.log('WebSocket connected');
            restoreData();
        };

        ws.onmessage = (event) => {
            let messageData = event.data;
            messageData = messageData.replace(/'/g, '"');
            // console.log(messageData);
            // res = "'" + res + "'";
            messageData = JSON.parse(messageData);
            console.log("Message Recieved: " + messageData['msg'])

            const message = {
                role: messageData['role'],
                msg: messageData['msg'],
                timestamp: messageData['timestamp']
            };
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputValue.trim() || count > 20) { // Check if input is empty or only whitespace
            return;
        }
        const message = {
            role: "Dealer",
            msg: inputValue,
            timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        setInputValue('');
        setCount(count + 1);
        console.log("Message Sent: " + message.msg);
        ws.send(message.msg);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
            <div className="content">
                <div className='instruction-box'>
                    <h2>{room.charAt(0).toUpperCase() + room.slice(1).toLowerCase()}</h2>

                    <div className="content">
                        <img src={image} alt="jsx-a11y" />
                    </div>

                    <center><h3>Features that you need to inform to a customer</h3></center>
                    <div className="content">
                        <ul>
                            <li>
                                <strong> Dimensions (Sq. feet): </strong>
                                {houseProperty["Dimensions (Sq. feet)"] ? houseProperty["Dimensions (Sq. feet)"] : "No Info."}
                            </li>
                            <li>
                                <strong>Level: </strong>
                                {houseProperty["Level"] ? houseProperty["Level"] : "No Info."}
                            </li>
                            <li>
                                <strong>Description: </strong>
                                {houseProperty["Description"] ? houseProperty["Description"] : "No Info."}
                            </li>
                            <li>
                                <strong>Scenery: </strong>
                                {houseProperty["Scenery"] ? houseProperty["Scenery"] : "No Info."}
                            </li>
                        </ul>
                        <div className="code">{count > 20} ? <p>Turn No.: {count} ({20 - count} turns left.)</p> : <p>Please close the window.</p> </div>
                    </div>


                    {/* <center><h3>Features that the customer may ask you about </h3></center>
                    <div className="content">
                        <ol>
                            <li>Type of flooring: hardwood flooring</li>
                            <li>Description: 4</li>
                        </ol>
                    </div> */}
                </div>


                <div className="message-box">
                    <h2>Chat History</h2>

                    <ReactScollableFeed>
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div key={index}>
                                    <span>
                                        <strong>{message.role}: </strong> {message.msg}
                                    </span>
                                    {/* <span className="muted" id="muted">
                                    {message.timestamp}
                                </span> */}
                                </div>
                            ))}
                        </div>
                    </ReactScollableFeed>

                    <form onSubmit={handleSubmit}>
                        <div className="inputs">
                            <input
                                type="text"
                                placeholder="Message"
                                rows="3"
                                id="message"
                                value={inputValue}
                                onChange={handleInputChange} />
                            <button type="submit" >Send</button>
                        </div>
                    </form>
                </div>

                {/* <div className="message-box">
                    <h2>Chat History</h2>
                    <div className="messages" id="messages">
                        {messages}
                    </div>

                    <div className="inputs">
                        <input type="text" rows="3"
                            placeholder="Chat message ..."
                            onChange={(e) => setMessages(e.target.value)}
                            value={message}
                            name="message"
                            id="message" />
                        <button type="button" name="send" id="send-btn" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div > */}
            </div>
        </div >
    );
};
