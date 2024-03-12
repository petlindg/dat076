import {socket} from "../App";
import { UserData } from "../Models/Api";

/**
 * React component, a clickable parsnip that increases your parsnips.
 * @returns {Component}
 */
export function ClickableParsnip({userData}:{userData:UserData|undefined}) {

    async function incrementParsnip() {
        socket.emit("parsnipClick")
    }

    let cursorStyle:string
    if(userData) {
        cursorStyle = 'url(' + require('../assets/images/cursors/' + userData.cursor + '.png') + '),auto'
    } else {
        cursorStyle = 'auto'
    }

    return (
        <div className="parsnip c3">
            <img
                className="parsnip-animation" onClick={incrementParsnip}
                style={{cursor: cursorStyle}}
                draggable="false"
                alt='The main parsnip'
                src={require('../assets/images/parsnip.png')}
            />
        </div>
    )
}


