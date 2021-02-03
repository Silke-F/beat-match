import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';

export default class BioEditor extends React.Component {

    constructor() {
        super();
        this.state = {
            bioEditMode: false,
            showBio: true,
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    updateBio(event) {

        axios
            .post("/api/updatebio", {
                editedBio: this.state.bioeditor
            })
            .then((res) => {
                console.log("axios post request new bio res", newBio);
                const newBio = res.data.updatedUser.bio;
                this.props.bioEditDone(newBio);
                this.setState({
                    bioEditMode: false,
                    showBio: true,
                });
            }) 
    }

    render() {

        return (
                    <div id="bio-editor">

                        {this.state.showBio && (
                            <div id="show-bio">
                                <div id="word-wrap"><strong>Something about me: </strong>{this.props.userBio}</div> 
                                <button onClick={(event) => this.setState({ bioEditMode: true, showBio: false })}>Edit bio</button>
                            </div>
                        )}

                        {this.state.bioEditMode && (
                            <div id="edit-bio">
                                <textarea onChange={(event) => this.handleChange(event)} name="bioeditor" />
                                <button onClick={(event) => this.updateBio(event)}>Save</button>
                            </div>
                        )}

                    </div>
                );
        } 
    }
