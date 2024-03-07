import {socket} from "../App";

export function ClickableParsnip() {

    async function incrementParsnip() {
        socket.emit("parsnipClick")
    }

    return (
        <div className="parsnip c3">
            <div className="boxing-cursor parsnip-animation" onClick={incrementParsnip}>
                <img
                    draggable="false"
                    alt='The main parsnip'
                    src={require('../assets/images/parsnip.png')}
                />
            </div>
        </div>
    )
}


