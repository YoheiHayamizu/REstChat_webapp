import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const url = "https://rest-dlg-server.herokuapp.com/token"
    // const url = "http://localhost:3500/token"

    const [houseInstance, setHouseInstance] = useState({});
    const [roomProperty, setRoomProperty] = useState({});
    const [personaData, setPersonaData] = useState({});

    const [count, setCount] = useState(0); //initial time count for loading

    // const [refreshKey, setRefreshKey] = useState(0);

    const selectInstance = () => {
        // Randomlly select a house id
        const house_ids = ["house001", "house002"]; //, "house003", "house004", "house005", "house006", "house007", "house008", "house009", "house010"];
        const house_id = house_ids[Math.floor(Math.random() * house_ids.length)];

        // Randomlly select a room from the list of rooms
        const room_ids = ["livingroom", "kitchen", "bedroom", "bathroom", "balcony"]; //, "diningroom", "garden", "studyroom", "hallway", "garage", "basement", "attic"];
        const room_id = room_ids[Math.floor(Math.random() * room_ids.length)];

        // Randomlly select a persona from the list of personas
        const persona_ids = ["persona001", "persona002", "persona003", "persona004", "persona005"] //, "persona006", "persona007", "persona008", "persona009", "persona010"];
        const persona_id = persona_ids[Math.floor(Math.random() * persona_ids.length)];

        const property_file = "../properties/" + house_id + ".json";
        const persona_file = "../personas/" + persona_id + ".json";

        fetch(`${property_file}`).then(res => res.json())
            .then(res => {
                // console.log(res);
                setRoomProperty(res["Property Features"][room_id.charAt(0).toUpperCase() + room_id.slice(1).toLowerCase()]);
            }).catch(_ => { console.log(_); return _; });

        fetch(`${persona_file}`).then(res => res.json())
            .then(res => {
                // console.log(res);
                setPersonaData(res);
            }).catch(_ => { console.log(_); return _; });
        // console.log(roomProperty)
        // console.log(personaData)

        return {
            house_id: house_id,
            room_id: room_id,
            persona_id: persona_id,
            img_file: house_id + "-" + room_id + ".png",
            property_file: house_id + ".json",
            persona_file: persona_id + ".json",
            room_property: roomProperty,
            persona_data: personaData,
        };
    }

    const fetchData = () => {
        // setHouseInstance();
        return axios.post(url, {
            withCredentials: true,
            "house_id": houseInstance.house_id,
            "room_id": houseInstance.room_id,
            "persona_id": houseInstance.persona_id,
            "img_file": houseInstance.img_file,
            "property": houseInstance.room_property,
            "persona": houseInstance.persona_data,
        }).then(res => {
            console.log(res.data);
            return res.data;
        });
    }

    let navigate = useNavigate();
    const Start = () => {
        fetchData().then((data) => {
            navigate("/room/" + data.token, { state: { data, houseInstance } });
        });
    }

    useEffect(() => {
        // setCount((count) => count + 1); //increment this Hook
        // const updateCount = () => {
        //     // let count = 0;
        //     if (count < 100) {
        //     }
        // };
        // updateCount();
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        setHouseInstance(selectInstance());
        // console.log(houseInstance);
    }, [selectInstance(), houseInstance]);

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
                <button className="App-button" onClick={Start}>{<div>Start</div>}</button>
                {/* <button className="App-button" onClick={Start}>{count > 100 ? <div>Start</div> : <div>Loading</div>}</button> */}
            </div>
        </div>
    );
}