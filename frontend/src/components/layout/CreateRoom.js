import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from "react-router-dom" 
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid" 
import Typography from "@material-ui/core/Typography" 
import TextField from "@material-ui/core/TextField" 
import FormHelperText from "@material-ui/core/FormHelperText" 
import FormControl from "@material-ui/core/FormControl" 
import Radio from "@material-ui/core/Radio" 
import RadioGroup from "@material-ui/core/RadioGroup" 
import FormControlLabel from "@material-ui/core/FormControlLabel" 
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';


export default class CreateRoom extends Component{
   static defaultProps = {
       votesToSkip:3,
       guestCanPuase:true,
       title:"",
       updateMode:false,
       roomCode:"",
       updateCallback:() => {},
   }

    state = {
        guestCanPuase:this.props.guestCanPuase,
        votesToSkip:this.props.votesToSkip,
        title:this.props.title,
        success:"",
        error:"",
    }
    

    votesToSkipHandle = (e) => this.setState({votesToSkip:e.target.value})

    guestCanPauseHandle = (e) => this.setState({guestCanPuase:e.target.value === 'true' ? true : false})

    handleTextFieldChange = (e) => {
        this.setState({
            title:e.target.value
        })
    }
    
    createButtonHandle = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                can_guest_pause: this.state.guestCanPuase,
                title:this.state.title,
            })
        }
        fetch('/api/create-room', requestOptions).then((response) => response.json())
        .then((data) => this.props.history.push('/room/' + data.code))
    }

    updateButtonHandle = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                can_guest_pause: this.state.guestCanPuase,
                title:this.state.title,
                code:this.props.roomCode
            })
        }
        fetch('/api/update-room', requestOptions).then((response) => {
            if(response.ok){
                this.setState({
                    success:"Room updated successfully"
                })
        }
        else{
            this.setState({
                error:"Error updating"
            })
        }
        this.props.updateCallback()
        })

    }


    renderCreateRoomButtons = () => {
        return (
            <Grid container >
            <Grid item xs={12} align = "center">
                <Button style = {{marginTop:"20px"}} onClick = {this.createButtonHandle} disabled = {!this.state.title.trim()} color = "secondary" variant = "contained">Create new room</Button>
            </Grid>
            <Grid item xs={12} align = "center">
                <Button style = {{marginTop:"20px"}} to = "/" component = {Link} color = "primary" variant = "contained">Back</Button>
            </Grid>
            </Grid>
        )
    }

    renderUpdateRoomButtons = () => {
        return (
        <Grid item xs={12} align = "center">
            <Button style = {{marginTop:"25px"}} onClick = {this.updateButtonHandle} color = "secondary" variant = "contained">Update</Button>
        </Grid> 
        )
    }

    render(){
        const title = this.props.updateMode ? "Update room settings" : "Create new room"
        return <Grid container spacing = {0}>
            <Grid style = {{"marginTop":"40px"}} item xs={12} align = "center">
                <Collapse  in = {this.state.success != "" || this.state.error != ""}>
                    {this.state.success ? <Alert style = {{"width":"500px","margin":"auto"}} severity = "success" onClose = {() => {
                        this.setState({
                            success:""
                        })
                    }}> {this.state.success} </Alert>
                    : <Alert style = {{"width":"500px","margin":"auto"}} severity = "error" onClose = {() => {
                        this.setState({
                            error:""
                        })
                    }}> {this.state.error} </Alert>}
                </Collapse>
            </Grid>
            <Grid item xs={12} align = "center">
                <Typography component='h4' variant='h4'>
                    <span style = {{display:'block',marginTop:'40px', marginBottom:"30px"}}>{title}</span>
                </Typography>
            </Grid>
            <Grid item xs={12} align = "center">
               <FormControl component = "fieldset">
                   <FormHelperText>
                       <div style = {{"color":'skyblue'}} align = "center">
                            Guest Controll
                       </div>
                   </FormHelperText>
                   <RadioGroup row defaultValue = {this.state.guestCanPuase.toString()} onChange = {this.guestCanPauseHandle}>
                        <FormControlLabel value = "true" 
                        control = {<Radio color = "secondary"/>} 
                        label = "Full room control"
                        labelPlacement = "bottom"/>
                        <FormControlLabel value = "false" 
                        control = {<Radio color = "secondary"/>} 
                        label = "No control"
                        labelPlacement = "bottom"/>
                   </RadioGroup>
               </FormControl>
            </Grid>
            <Grid style = {{marginTop: "10px"}} item xs={12} align = "center">
                <FormControl>
                    <TextField onChange = {this.votesToSkipHandle} color = "secondary" required = {true} type = "number"
                     defaultValue = {this.state.votesToSkip}
                     inputProps = {{
                         min:1,  
                         style:{textAlign:"center", marginTop: "10px",color:"white"}
                     }}
                    />
                    <FormHelperText>
                        <div style = {{"color":'skyblue'}} align = "center">Votes required to skip song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid style = {{marginTop: "15px"}} item xs={12} align = "center">
               <TextField  onChange = {this.handleTextFieldChange} label = "Enter room name" color = "secondary" style = {{textAlign:"center"}} value = {this.state.title} inputProps = {{
                         style:{textAlign:"center",color:"white"}
                     }}/>
                     <FormHelperText>
                        <div style = {{"color":'skyblue'}} align = "center">Required</div>
                    </FormHelperText>
            </Grid>
            {this.props.updateMode ? this.renderUpdateRoomButtons() : this.renderCreateRoomButtons()}
        </Grid>
    }
} 