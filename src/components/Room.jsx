import { React, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReactScollableFeed from "react-scrollable-feed";
import axios from "axios";

export const Room = () => {
    const params = useParams();
    const locations = useLocation();

    const token = params.id;
    const room_id = locations.state.houseInstance.room_id;
    const image = "../images/" + locations.state.houseInstance.img_file;
    const houseProperty = locations.state.houseInstance.room_property;
    const personaData = locations.state.houseInstance.persona_data;

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
            console.log(response);
            // console.log(response.messages)
            setCount(response.turns);
            setMessages(response.messages);
        };


        const ws = new WebSocket(ws_url);
        setWs(ws);

        // console.log(image);

        ws.onopen = () => {
            console.log('WebSocket connected');
            restoreData();
        };

        ws.onmessage = (event) => {
            let messageData = event.data;
            // messageData = messageData.replace(/'/g, '"');
            console.log(messageData);
            // res = "'" + res + "'";
            // messageData = '"' + messageData + '"';
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
        if (!inputValue.trim() || count > 10) { // Check if input is empty or only whitespace
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
                    <h1>{room_id.charAt(0).toUpperCase() + room_id.slice(1).toLowerCase()}</h1>

                    <div>
                        <img src={image} alt="jsx-a11y" />
                    </div>

                    <h2>Features that you need to inform to a customer</h2>
                    <div className="content">
                        <ul>
                            <li>
                                <strong> Dimensions (Sq. feet): </strong>
                                {houseProperty["Dimensions (Sq. feet)"] ? houseProperty["Dimensions (Sq. feet)"] : "Provide an information"}
                            </li>
                            <li>
                                <strong>Level: </strong>
                                {houseProperty["Level"] ? houseProperty["Level"] : "Provide an information"}
                            </li>
                            <li>
                                <strong>Description: </strong>
                                {houseProperty["Description"] ? houseProperty["Description"] : "Provide an information"}
                            </li>
                            <li>
                                <strong>Scenery: </strong>
                                {houseProperty["Scenery"] ? houseProperty["Scenery"] : "Provide an information"}
                            </li>
                        </ul>
                    </div>

                    <h2>Customer's persona</h2>
                    <div className="content">
                        <ul>
                            <li>
                                <strong> Name: </strong>
                                {personaData["name"]}
                            </li>
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
                            {/* <li>
                                <strong> Channels: </strong>
                                {personaData["channels"]}
                            </li> */}
                            <li>
                                <strong> Tech: </strong>
                                {personaData["tech"].map((data, index) => (
                                    <div key={index} className="text ">
                                        <div>{data}</div>
                                    </div>
                                ))}
                            </li>
                            <li>
                                <strong> Dreams and Goals: </strong>
                                {personaData["dreams_and_goals"].map((data, index) => (
                                    <div key={index} className="text ">
                                        <div>{data}</div>
                                    </div>
                                ))}
                            </li>
                            <li>
                                <strong> Pain Points and Challenges: </strong>
                                {personaData["pain_points_and_challenges"].map((data, index) => (
                                    <div key={index} className="text ">
                                        <div>{data}</div>
                                    </div>
                                ))}
                            </li>
                        </ul>
                    </div>


                    {/* <center><h2>Features that the customer may ask you about </h2></center>
                    <div className="content">
                        <ol>
                            <li>Type of flooring: hardwood flooring</li>
                            <li>Description: 4</li>
                        </ol>
                    </div> */}
                </div>


                <div className="message-box">
                    <h1>Chat History</h1>

                    <ReactScollableFeed>
                        <div className="messages">
                            {messages.map((message, index) => (
                                <div key={index} className="text ">
                                    <div><strong>{message.role}: </strong> {message.msg}</div>
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
                                // type="text"
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
            <div className="App-button">
                {count < 10 ? <div>Turn No.: {count} ({10 - count} turns left.)</div> : <div>Please close the window.</div>}
            </div>
        </div >
    );
};
