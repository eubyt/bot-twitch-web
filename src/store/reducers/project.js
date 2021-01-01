const start_state = {
    statusObsRemote: "disconnected",
    statusTwitch: "disconnected"
}

export default function theme(state = start_state, action) {
    switch (action.type) {
        case "SET_STATUS_OBS_REMOTE":
            return { ...state, statusObsRemote: action.statusObsRemote };
        case "SET_STATUS_TWITCH":
            return { ...state, statusTwitch: action.statusTwitch };
        default:
            return state;
    }
}