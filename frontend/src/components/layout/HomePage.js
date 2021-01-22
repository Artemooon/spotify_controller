import React, {Component} from 'react'
import Typography from "@material-ui/core/Typography" 
import Grid from "@material-ui/core/Grid" 
import Button from "@material-ui/core/Button"
import {Link,Redirect,Switch,Route,BrowserRouter as Router} from "react-router-dom" 
import CreateRoom from './CreateRoom'
import JoinRoom from './JoinRoom'
import Room from './Room'


export default class HomePage extends Component{
    
    state = {
        roomCode:null,
    }

    async componentDidMount(){
        fetch('/api/user-room-session').then((response) => response.json()).
        then((data) => {
            this.setState({
                roomCode: data.code,
            })
        })
    }

    
    renderHomePage = () => {
            return (
                <Grid container spacing = {0}>
                <Grid item xs={12} style = {{marginTop:'70px', marginBottom:"30px"}} align = "center">
                    <Typography component='h1' variant='h1'>
                        <span>Music Hub</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} style = {{marginTop:'250px',}} align = "center">
                    <Button color = "secondary" to = "create-room" component = {Link} variant = "contained">Create new room</Button>
                </Grid>
                <Grid item xs={12} style = {{marginTop:"20px"}}  align = "center">
                    <Button color = "primary" to = "join-room" component = {Link} variant = "contained">Join the room</Button>
                </Grid>
                <Grid item style = {{marginTop:"30px"}} xs={12} align = "center">
                <Typography variant="body2">
                        * You need Spotify PREMIUM to correctly use this app
                    </Typography>
                </Grid>
                </Grid>
            )
    }


    deleteRoomCode = () => {
        this.setState({
            roomCode:null,
        })
    }

    render(){
        return (
        <Router>
            <Switch>
                <Route exact  path = "/"  render={() => {
                return this.state.roomCode ? 
                <Redirect to={`/room/${this.state.roomCode}`} /> : this.renderHomePage()
            }}/>
                <Route path = "/room/:code"  render = {(props) => {
                    return <Room {...props} leaveRoomCallBack = {this.deleteRoomCode}/>
                }}/>
                <Route path = "/create-room" component = {CreateRoom}></Route>
                <Route path = "/join-room" component = {JoinRoom}></Route>
            </Switch>
        </Router>
        )
    }
} 