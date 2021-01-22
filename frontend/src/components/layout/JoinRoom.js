import React, {Component} from 'react'
import {Grid, Button, Typography, TextField} from "@material-ui/core"
import {Link} from "react-router-dom" 

export default class JoinRoom extends Component{

    state = {
        roomCode:"",
        error:"",
    }

    handleTextFieldChange = (e) => {
        this.setState({
            roomCode:e.target.value
        })
    }
    
    buttonCheck = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: this.state.roomCode,
            })
        }
        if(this.state.roomCode){
            fetch('/api/join-room', requestOptions).then((response) => {
                if(response.ok){
                    this.props.history.push(`/room/${this.state.roomCode}`)
                }
                else{
                    this.setState({
                        error:"Invalid code"
                    })
                }
            })
            .catch((error) => console.log(error))
    }
    else{
        this.setState({
            error:"Invalid code"
        })
    }

    }
    render(){
        return <Grid container >
                <Grid item xs={12} align = "center">
                    <Typography style = {{marginTop:"40px",marginBottom:"30px"}} component='h4' variant='h4'>
                       Join to the room
                    </Typography>
                </Grid>
            <Grid item xs={12} align = "center">
               <TextField onChange = {this.handleTextFieldChange} label = "Enter room-code"  color = "secondary" error = {this.state.error} value = {this.state.roomCode}  helperText = {this.state.error}/>
            </Grid>
            <Grid style = {{marginTop:"30px"}} item xs={12} align = "center">
               <Button onClick = {this.buttonCheck} color = "secondary" variant = "contained">
                   Join the room
               </Button>
            </Grid>
            <Grid item xs={12} align = "center">
                <Button style = {{marginTop:"20px"}} to = "/" component = {Link} color = "primary" variant = "contained">Back</Button>
            </Grid>
            </Grid>

    }


} 