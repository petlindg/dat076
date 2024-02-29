import {socket} from "../App";

export function ClickableParsnip() { 
    return (<div className="boxing-cursor parsnip-animation" onClick={incrementParsnip}>
    <img
        draggable="false"
        alt='The main parsnip'
        src={require('../assets/images/parsnip.png')}
    />
</div>)
}

export async function incrementParsnip() { 
    socket.emit("parsnipClick")
}

