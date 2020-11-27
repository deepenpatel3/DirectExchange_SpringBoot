import React, { Component } from 'react';
import { Layout, Card, message } from 'antd';
import axios from "axios";

class VerifyEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error : false
        };
    }
    componentDidMount = async () => {
        console.log("aya");
        let data = {
            id: this.props.match.params.id
        };
        
        if(data.id){
            try{
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/verify` , data);
                window.location.href= '/';
            }
            catch(e){
                message.error(e.message);
                this.setState({
                    error : true
                })
            }
        }
        else{
            this.setState({
                error : true
            })
        }
       
    }
    
render() {
        return (
            <Card title="Verify account" style={{ width: 400, margin: "auto", marginTop: "100px", verticalAlign: "middle" }}>
                {this.state.error ? 
                "There was an error processing your request" : "Please wait.."}
            </Card>
        );
    }
}

export default VerifyEmail;