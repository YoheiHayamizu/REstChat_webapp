import React from 'react';
import axios from 'axios';
// import personas from './personas/all_personas.json';
// import properties from 'data/properties/allproperties.json';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            roomName: '',
            personaId: '',
            roomProperty: {},
            personaData: {},
        };
    }

    // Define a function that will load the room property data
    // and set the state of the roomProperty variable
    loadRoomPropertyData() {
        fetch('properties/all_properties.json')
            .then(response => response.json())
            .then(data => {
                // console.log(data[0]);
                const idx = Math.floor(Math.random() * data.length);
                this.setState({
                    roomId: data[idx].id,
                    roomName: data[idx].name,
                    roomProperty: data[idx]
                });
                // console.log(this.state.roomProperty);
            })
            .catch(error => {
                // handle errors
                console.error(error);
            });
    }

    // Define a function that will load the persona data
    // and set the state of the persona variable
    loadPersonaData() {
        fetch('personas/all_personas.json')
            .then(response => response.json())
            .then(data => {
                // console.log(data[0]);
                const idx = Math.floor(Math.random() * data.length);
                this.setState({
                    personaId: data[idx].id,
                    personaData: data[idx]
                });
                // console.log(this.state.personaData);
            })
            .catch(error => {
                // handle errors
                console.error(error);
            });
    }

    componentDidMount() {
        // call your function here
        console.log('HomePage is loaded');
        this.loadRoomPropertyData();
        this.loadPersonaData();
    }

    handleStart = async () => {
        // console.log(this.state)
        const url = "https://rest-dlg-server.herokuapp.com/token"
        // const url = "http://localhost:3500/token"
        const response = await axios.post(url, {
            withCredentials: true,
            "room_id": this.state.roomId,
            "room_name": this.state.roomName,
            "persona_id": this.state.personaId,
            "persona": this.state.personaData,
            "property": this.state.roomProperty,
        });

        const token = await response.data.token;
        this.props.handleStart(token, this.state);
    };

    render() {

        return (
            <div>
                {/* {
                    !showChat ? ( */}
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
                        <button className="App-button" onClick={this.handleStart}>Start</button>
                    </div>

                </div>
            </div>
        );
    }
}

export default HomePage;
