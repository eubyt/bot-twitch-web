import React, { useState } from 'react';
import { createConection, closeConection } from '../wss/streamlabsRemote';
import { createTmi, disconnectTmi } from '../wss/twitchChatbot';
import { useSelector, useDispatch } from 'react-redux';

function Twitch() {

    const [value, setValue] = useState(JSON.parse(localStorage.getItem("twitch-data")) || {
        username: '',
        oauth: ''
    })

    const project = useSelector(state => state.project);
    const dispatch = useDispatch();

    const handleChange = e => setValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

    const onSubmitForm = e => {
        e.preventDefault();
        localStorage.setItem("twitch-data", JSON.stringify(value))
        if (project.statusTwitch === 'disconnected')
            createTmi(value.username, value.oauth, [value.username], () => { }, () => { }, dispatch)
        else
            disconnectTmi()
    }

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header">
                <h4 className="my-0 fw-normal">Twitch</h4>
            </div>
            <div className="card-body">
                <form onSubmit={onSubmitForm}>
                    <div className="mb-3">
                        <input type="text" name="username" className="form-control" placeholder="Username" value={value.username} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" name="oauth" className="form-control" placeholder="OAuth" value={value.oauth} onChange={handleChange} />
                    </div>
                    <ul className="list-unstyled mt-3 mb-4">
                        <li>{project.statusTwitch}</li>
                    </ul>
                    {project.statusTwitch === 'disconnected' && (
                        <button type="submit" className="w-100 btn btn-lg btn-primary">Salvar</button>
                    )}

                    {project.statusTwitch !== 'disconnected' && (
                        <button type="submit" className="w-100 btn btn-lg btn-primary">Desconectar</button>
                    )}
                </form>
            </div>
        </div>
    )
}

function OBS() {

    const [value, setValue] = useState(JSON.parse(localStorage.getItem("obs-data")) || {
        url: 'http://127.0.0.1:59650/api',
        token: ''
    })

    const project = useSelector(state => state.project);
    const dispatch = useDispatch();

    const handleChange = e => setValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

    const onSubmitForm = e => {
        e.preventDefault();
        localStorage.setItem("obs-data", JSON.stringify(value))
        if (project.statusObsRemote === 'disconnected')
            createConection(value.url, value.token, () => { }, (e) => {
                console.log("Error:", e)
            }, dispatch)
        else
            closeConection()
    }

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header">
                <h4 className="my-0 fw-normal">Streamlabs OBS Remote</h4>
            </div>
            <div className="card-body">
                <form onSubmit={onSubmitForm}>
                    <div className="mb-3">
                        <input type="text" name="url" className="form-control" placeholder="URL" value={value.url} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" name="token" className="form-control" placeholder="Token" value={value.token} onChange={handleChange} />
                    </div>
                    <ul className="list-unstyled mt-3 mb-4">
                        <li>{project.statusObsRemote}</li>
                    </ul>
                    {project.statusObsRemote === 'disconnected' && (
                        <button type="submit" className="w-100 btn btn-lg btn-primary">Salvar</button>
                    )}

                    {project.statusObsRemote !== 'disconnected' && (
                        <button type="submit" className="w-100 btn btn-lg btn-primary">Desconectar</button>
                    )}
                </form>
            </div>
        </div>
    )
}

function Home() {
    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                <div className="col">
                    <Twitch />
                </div>
                <div className="col">
                    <OBS />
                </div>
            </div>
        </div >
    )
}

export default Home