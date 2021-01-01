import setStatusObsRemote from '../store/actions/statusObsRemote';

let socket = null;
let nextRequestId = 1;
let scenes = [];
let requests = {};

const sendMessage = message => {
    let requestBody = message

    if (typeof message === 'string') {
        try {
            requestBody = JSON.parse(message);
        } catch (e) {
            console.log('Invalid JSON');
            return
        }
    }

    if (!requestBody.id) {
        console.log('id is required')
        return
    }

    return new Promise((resolve, reject) => {
        requests[requestBody.id] = {
            body: requestBody,
            resolve,
            reject,
            completed: false
        };
        socket.send(JSON.stringify(requestBody));
    });
}

const onMessageHandler = data => {
    let message = JSON.parse(data);
    console.log(message)
    let request = requests[message.id];

    if (request) {
        if (message.error) {
            request.reject(message.error);
        } else {
            request.resolve(message.result);
        }
        delete requests[message.id];
    }
}

const request = (resourceId, methodName, ...args) => {
    let id = nextRequestId++;
    let requestBody = {
        jsonrpc: '2.0',
        id,
        method: methodName,
        params: { resource: resourceId, args }
    };

    return sendMessage(requestBody);
}

const addScene = scene => scenes.push({ ...scene })

const onConnectionHandler = (onActive, dispatch) => {
    dispatch(setStatusObsRemote("connected"))
    onActive();
    request('ScenesService', 'getScenes').then(response => {
        response.forEach(scene => addScene(scene));
    });
}

export function setScene(name) {
    const currentScene = scenes.filter(x => x.name.toLowerCase() === name.toLowerCase())[0]
    console.log("Achou", currentScene)
    if (currentScene != null)
        request('ScenesService', 'makeSceneActive', currentScene.id)
}

export function closeConection() {
    socket.close()
}

export function createConection(url, token, onActive, onError, dispatch) {
    const SockJS = require("sockjs-client")
    dispatch(setStatusObsRemote("pending"))
    socket = new SockJS(url)
    socket.onopen = () => {
        request('TcpServerService', 'auth', token).then(() => {
            onConnectionHandler(onActive, dispatch);
        }).catch(e => {
            dispatch(setStatusObsRemote("disconnected"))
            onError(e.message)
        })
    };
    socket.onmessage = e => onMessageHandler(e.data);
    socket.onclose = (e) => {
        dispatch(setStatusObsRemote("disconnected"))
        onError(e.reason)
    };
}
