import { React } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const url = "https://rest-dlg-server.herokuapp.com/token"
    // const url = "http://localhost:3500/token"

    const selectInstance = () => {
        // Randomlly select a house id
        const houseIds = ["house001", "house002"]; //, "house003", "house004", "house005", "house006", "house007", "house008", "house009", "house010"];
        const houseId = houseIds[Math.floor(Math.random() * houseIds.length)];

        // Randomlly select a room from the list of rooms
        const rooms = ["livingroom", "kitchen", "bedroom", "bathroom", "balcony"]; //, "diningroom", "garden", "studyroom", "hallway", "garage", "basement", "attic"];
        const room = rooms[Math.floor(Math.random() * rooms.length)];

        return { houseId: houseId, room: room, img: houseId + "-" + room + ".png" };
    }

    const fetchData = async () => {
        return await axios.post(url, { withCredentials: true }).then(res => {
            console.log(res.data);
            return res.data;
        });
    }

    let navigate = useNavigate();
    const Start = () => {
        const houseInstance = selectInstance();
        fetchData().then((data) => {
            navigate("/room/" + data.token, { state: { data, houseInstance } });
        });
    }

    return (
        <div>
            <div className="content">
                <div className='Home-body'>
                    <h1>INSTRUCTIONS</h1>
                    <p>
                        We are conducting research on how people use language to convey information to each other with the aim of improving
                        the conversational capabilities of chatbots. To investigate effective ways of conveying information to others, we are
                        collecting conversation tokensets. This tokenset will be used to improve the functionality of chatbots.
                    </p>
                    <p>
                        In this experiment, you will assume the role of a real estate agent and imagine that you are standing in a room of a property.
                        You will be required to describe the room's features to a chatbot playing the role of a customer. You will be provided with
                        an image of the room and instructions on which features to convey (such as "size of the living room" or "view from the room").
                        Based on the impression of the image, please describe the room's features in words. Additionally, the customer may request
                        information beyond the given instructions (such as "type of flooring"). Please try your best to convey as much information as
                        possible to satisfy the customer, but do not provide any information further beyond the given instructions (such as
                        "location of the property"). The conversation will be limited to a maximum of 10 turns.
                        1 turn is defined as a pair of messages from the agent and the customer.
                    </p>
                    <p>
                        The conversation will take place using a specific text chat tool. Please follow the instructions below to participate in the experiment.</p>
                    <ol>
                        <li> Access the chat tool from the link provided below. </li>
                        <li>Once you have accessed the chat tool, introduce yourself as a real estate agent. </li>
                        <li>The bot will respond with an introduction, so please continue the conversation. </li>
                        <li>View the image of the room displayed on the screen and describe the features of the room based on the given instructions.
                            If the customer requests information, please answer as accurately as possible.
                            However, do not provide any information beyond the given instructions.
                        </li>
                        <li>Once the conversation is complete, please close the chat tool.</li>
                    </ol>
                    <h1>Notes</h1>
                    <div>
                        <p> <b>GOOD Utterance:</b> "The living room is spacious and accommodates up to 10 people." (specific + detailed) </p>
                        <p> <b>BAD Utterance:</b> "The living room is good." (unspecific + unhelpful) </p>
                    </div>
                </div>
            </div>

            <div>
                <button className="App-button" onClick={Start}>Start</button>
            </div>
        </div>
    );
}