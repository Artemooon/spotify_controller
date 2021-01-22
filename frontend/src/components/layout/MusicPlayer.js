import React, { useState,useEffect } from 'react'
import {Grid, LinearProgress, Typography,Link, Iconbutton,Card, IconButton} from "@material-ui/core"
import PlayArrowIcons from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button'
import VolumeUp from '@material-ui/icons/VolumeUp';
import { makeStyles } from '@material-ui/core/styles';


export default function MusicPlayer(props){

    const useStyles = makeStyles({
        root:{
            marginTop:"-30px",
        },
        btn_success:{
            background:"green",
            marginTop:"130px",
        }
    })
    
    const classes = useStyles()

    
    const getCookie = (cookie_name) =>
    {
        var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
        
        if (results)
            return (unescape(results[2]));
        else
            return null;
    }


    let [volumeValue,setVolumeValue] = useState(getCookie("volume")) || useState(50)
    let [error,setError] = useState('')
    let [trackPosition,setTrackPosition] = useState(10000)

    useEffect(() => {
        const interval = setInterval(setVolume,500)
        return () => clearInterval(interval)
      })    

    const handleRange = (event,newVlaue) => {
        setVolumeValue(newVlaue)
    }

    const handleTrackRange = (event,newVlaue) => {
        setTrackPosition(newVlaue)
    }

    const artistsInfoRender = () => {
        return (
        <Typography color = "textPrimary" component = "h5" variant = "h5">
            {props.artists}
        </Typography>
        )
}
    const playSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/spotify-api/play-song',requestOptions).then((response) => {
            if(!response.ok){
                setError("You dont have permissions")
            }
        })
    }

    const pauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/spotify-api/pause-song',requestOptions).then((response) => {
            if(!response.ok){
                setError("You dont have permissions")
            }
        })
    }


    const setVolume = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
        }
        if(props.isHost){
        fetch('/spotify-api/set-volume/' + volumeValue.toString() ,requestOptions).then((response) => {
            if(!response.ok){
                setError("You don't have permisions",)
            }
        })
        document.cookie =  "volume=" + escape(volumeValue)
    }
    }

    const skipSong = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/spotify-api/skip-song',requestOptions).then((response) => {
            if(!response.ok){
                setError("You dont have permissions")
            }
        })
    }

    const renderVolume = () => {
        return (
        <div> 
            <VolumeUp />
            <Slider color = "secondary" style = {{"width":"130px", "marginLeft":"10px"}} value={volumeValue} onChange={handleRange} aria-labelledby="input-slider" />
        </div> 
        )
    }

    const prevSong = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/spotify-api/previous-song',requestOptions).then((response) => {
            if(!response.ok){
                setError(
                    error = "You dont have permissions"
                ) 
            }
        })
    }


        const songProgress = (props.play_time / props.duration) * 100

        function msToMinutes(duration) {
            let seconds = parseInt((duration / 1000) % 60)
            let minutes = parseInt((duration / (1000 * 60)) % 60)
          
            seconds = (seconds < 10) ? "0" + seconds : seconds;
          
            return minutes + ":" + seconds;
          }
        return ( 
            <div>
                {props.title ? <div><Card style = {{"marginTop":"40px","minHeight":"300px","height":"100%","background":"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(173,55,69,1) 100%)"}}> <Collapse  in = {error != ""}>
                    <Alert style = {{"width":"500px","margin":"auto"}} severity = "error" onClose = {() => {
                        setError(
                            error = ""
                        )
                    }}> {error} </Alert>
                </Collapse>
            <Grid container spacing = {0} alignItems = "center">
            <Grid style = {{"marginTop":"20px"}} item xs={12} lg = {4} align = "center">
                <img  src = {props.image_url} alt = "album img"/>
            </Grid>
            <Grid style = {{"marginTop":"20px"}} item lg={8} xs={12} align = "center">
            <Typography component = "h5" variant = "h5">
            <Link color="inherit" target="_blank" href = {props.track_url}>{props.title}</Link>
            </Typography>
                {artistsInfoRender()}
                <div>
                    <IconButton onClick = {() => prevSong()}>
                        <SkipPreviousIcon style = {{'color': 'white'}}/>
                    </IconButton>
                    <IconButton onClick = {() => {props.is_playing ? pauseSong() : playSong()}}>
                         {props.is_playing ? <PauseIcon style = {{'color': 'white'}}/> : <PlayArrowIcons style = {{'color': 'white'}}/>}
                    </IconButton>
                    <IconButton onClick = {() => skipSong()}>
                        <SkipNextIcon style = {{'color': 'white'}}/>
                    </IconButton>
                    <br/>
                    {renderVolume()}
                    <Typography color = "textPrimary" variant = "body1">
                        Skip song: {props.votes} / {props.votesToSkip}
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={12} align = "center">
                <Typography style = {{"color":"white"}}>{msToMinutes(props.play_time)} / {msToMinutes(props.duration)}</Typography>
            </Grid>    
        </Grid>
        </Card>  
        <LinearProgress className = "song-progress" variant = "determinate" value = {songProgress}/> </div>  : <Card style = {{"marginTop":"40px","minHeight":"300px","height":"100%","background":"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(173,55,69,1) 100%)"}}> <Typography style = {{"color":"#fff", "marginTop":"30px"}}>You should run your spotify player and turn on any track to controll it</Typography> <Button color = "primary" href = "https://open.spotify.com/" target = "_blank" className = {classes.btn_success} variant = "contained">Open Spotify</Button></Card>}
        </div>
        )
    }
