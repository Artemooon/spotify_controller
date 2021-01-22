import React, { useState,useEffect } from 'react'
import {Grid,Button,Typography,Link} from '@material-ui/core'
import CreateRoom from './CreateRoom'
import MusicPlayer from './MusicPlayer'

export default function  Room(props){


    const [guestCanPuase,setGuestCanPause] = useState(true)
    const [votesToSkip,setVotesToSkip] = useState(2)
    const [isUserHost,setIsUserHost] = useState(false)
    const [title,setTitle] = useState(null)
    const [visibleSettings,setVisibleSettings] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [song,setSong] = useState({})
    const [hostName,setHostName] = useState('')
    const [hostUrl,setHostUrl] = useState('')


    const code = props.match.params.code 
 
    useEffect(() => {
        const interval = setInterval(getCurrentSongInfo,1000)
        return () => clearInterval(interval)
      })

      useEffect(() => {
        getRoomInfo()
        return () => null
      })

      useEffect(() => {
        getSpotifyUserInfo()
        return () => null
      })

    const getRoomInfo = () => {
        fetch('/api/room/' + code).then((response) => {
            if(!response.ok){
                props.leaveRoomCallBack()
                props.history.push('/')
            }

            return response.json()
        } )
        .then((data) => {
                setGuestCanPause(data.can_guest_pause),
                setVotesToSkip(data.votes_to_skip)
                setIsUserHost(data.is_host)
                setTitle(data.title)
                //roomId:data.id
            
            if(isUserHost){
                authenticateSpotify()
            }
        })
    }

    const getSpotifyUserInfo = () => {
        fetch('/spotify-api/spotify-user').then((response) => {
            if(response.ok){
                return response.json()
                }
                else{
                return {}
                }
        }).then((data) => {
                setHostName(data.host_name)
                setHostUrl(data.host_url)
        })
    }

    const getCurrentSongInfo = () => {
        fetch('/spotify-api/current-song-info').then((response) => {
            if(response.ok){   
            return response.json()
            }
            else{
            return {}
            }
        }).
        then((data) => {
            setSong(data)
        })
    }

    const showRoomSettingsHandle = (value) => {
        setVisibleSettings(value)
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/api/leave-room',requestOptions).then((response) => {
            props.leaveRoomCallBack()
            props.history.push('/')
        })
    }

    const renderSettingsBtn = () => {
        return( <Grid item xs={12} style = {{marginTop:"30px"}} align = "center">
            <Button color = "secondary" onClick = {() => showRoomSettingsHandle(true)} variant = "contained">Room Settings</Button>
        </Grid>
        )
    }


    const authenticateSpotify = () => {
        fetch('/spotify-api/authentication-check').then((response) => response.json()).
        then((data) => {
            setIsAuthenticated(data.is_authenticated)
            if(!data.is_authenticated){
                fetch('/spotify-api/authorization-url').then((response) => response.json()).
                then((data) => {
                    document.location.replace(data.url)
                })
            }
        })
    }

    const renderSettingsPage = () => {
        return (
            <Grid container spacing = {0}>
                <Grid item xs={12} align = "center">
                    <CreateRoom updateMode = {true}
                    votesToSkip = {votesToSkip} 
                    guestCanPuase = {guestCanPuase}
                    title = {title}
                    roomCode = {code}
                    updateCallback = {getRoomInfo}
                    />
                </Grid>
                <Grid style = {{marginTop:"25px"}} item xs={12} align = "center">
                <Button color = "primary" onClick = {() => showRoomSettingsHandle(false)} variant = "contained">Go Back to Room</Button>
                </Grid>
            </Grid>
        )
    }


        if(!visibleSettings){
        return <Grid container>
        <Grid item xs={12} align = "center">
            <Typography style = {{marginTop:"40px",marginBottom:"10px"}} component='h4' variant='h4'>
            {title}
            </Typography>
        </Grid>
        <Grid item xs={12} align = "center">
        <Typography style = {{marginTop:"20px"}} component='h6' variant='h6'>
            Code: #{code}
        </Typography>    
        <Typography style = {{marginTop:"20px"}} component='h6' variant='h6'>
            Host: <Link color = "inherit" target = "_blank" href = {hostUrl}>{hostName}</Link>
        </Typography> 
        <Typography style = {{marginTop:"20px"}} component='h6' variant='h6'>
            Votes required to skip: {votesToSkip}
        </Typography>  
        <Typography style = {{marginTop:"20px"}} component='h6' variant='h6'>
           {guestCanPuase ? "Guest can control music" : "Guest can't control music"}
        </Typography>  
        </Grid>
        <Grid item xs={12} align = "center">
         <MusicPlayer {...song} volumeCallback = {getCurrentSongInfo} votesToSkip = {votesToSkip} isHost = {isUserHost}/>
        </Grid> 
        {isUserHost ? renderSettingsBtn() : ""}
        <Grid item xs={12} style = {{marginTop:"30px"}} align = "center">
            <Button color = "primary" onClick = {leaveButtonPressed} variant = "contained">Leave Room</Button>
        </Grid>
        </Grid>
    }
    else{
        return renderSettingsPage()
    }
}
