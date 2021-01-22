import React from 'react'
import ReactDOM from 'react-dom'
import HomePage from './layout/HomePage'



export default function App (props){
    return(
        <HomePage/>
        )
}

ReactDOM.render(<App/>, document.getElementById('app'))