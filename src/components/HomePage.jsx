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
            url: "https://rest-dlg-server.herokuapp.com/token"
            // url: "http://localhost:3500/token"
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
        const response = await axios.post(this.state.url, {
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
                            We are currently conducting research on the utilization of language in conveying information to enhance the conversational proficiency of chatbots. 
                            To effectively investigate the methods of transmitting information to others, we are collecting a dataset of conversations. 
                            This dataset will be instrumental in enhancing the functionality of chatbots.
                            </p>

                            <p>
                            For this experiment, you will be required to play the role of a real estate agent and imagine yourself in a room within a property. 
                            The task at hand is to communicate the room's features to an experimenter who will be acting as a customer. 
                            The provided instructions will specify which features to communicate, such as "size of the living room" or "view from the room," 
                            along with the customer's persona.  
                            </p>

                            <p><b> 
                            Your objective is to effectively convey the room's attributes to satisfy the customer's preferences within the constraints of the given instructions. 
                            You can make the customer envision a scenario where the customer enjoys living in this property.  
                            </b></p>   

                            <p>
                            It is important to refrain from providing information beyond the given instructions, such as "location of the property."  
                            Also, note that you and the customer will only be in this room and will not be able to move to the rest of the property during a conversation. 
                            The conversation will be restricted to a maximum of 10 turns, with one turn being defined as a pair of messages between the agent and the customer. 
                            </p>

                            <p>
                            The conversation will take place on this web platform. Please adhere to the instructions provided below.
                            </p>

                            <ol>
                                <li> Click the start button below. </li>
                                <li> Once you have accessed the chat tool, you will see the information on room features and a customer profile on the left and
                                    the chat box on the right.
                                </li>
                                <li> Read the information and inform the features as much as you can. </li>
                                <li> The experimenter will respond to you, so please continue the conversation.
                                    If the customer requests information, please answer as accurately as possible.
                                    However, do not provide any information beyond the given instructions.
                                </li>
                                <li> Once the conversation is complete, please close the chat by clicking the button bottom. </li>
                            </ol>
                            
                            <br />
                            {/* <br /> */}
                            <h1>Notes</h1>
                            <div>
                                <p> <b>GOOD Utterance:</b>
                                <ol>
                                    <li> "The living room is spacious, which size is 400 sq. feet. You can have a party, inviting your colleagues." (specific + detailed) </li>
                                    <li> "The kitchen is open to the living room, so it's really comfortable to cook and easily relax as you spend quality time with your family." (specific + persuasive) </li>
                                </ol>    
                                </p>
                                <p> <b>BAD Utterance:</b>
                                <ol>
                                    <li> "The living room is good." (unspecific + unhelpful) </li>
                                    <li> "The size of this room is 320 square feet." (descriptive, but not alluring) </li>
                                </ol>  
                                    
                                </p>
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
