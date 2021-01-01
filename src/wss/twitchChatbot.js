import setStatusTwitch from '../store/actions/statusTwitch';
import { setScene } from './streamlabsRemote';

let client = null;

export function disconnectTmi() {
    client.disconnect();
}

export function createTmi(name, oauth, channels, onActive, onError, dispatch) {
    const tmi = require('tmi.js');

    client = new tmi.Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: name,
            password: oauth
        },
        channels: channels
    });

    client.on("connected", (address, port) => {
        dispatch(setStatusTwitch("connected"))
    });

    client.on("disconnected", (reason) => {
        dispatch(setStatusTwitch("disconnected"))
    });

    client.on("chat", (channel, user, message, self) => {
        // if (self) return;
        let data = JSON.parse(localStorage.getItem("command-obsRemote"))

        let params = message.slice(1).split(' ');
        let command = `!${params.shift().toLowerCase()}`;
        let msg = message.replace(command, "").trim()

        if (command === data.command) {
            let cena = null

            if (params.length < 1)
                cena = data.defaultScene
            else
                cena = msg

            setScene(cena)

            client.say(channel, data.response.replace("$name", cena))
        }
    });

    client.connect();

}
