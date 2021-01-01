import React, { useState } from 'react';

function Command() {

    const [value, setValue] = useState(JSON.parse(localStorage.getItem("command-obsRemote")))

    const handleChange = e => setValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }))

    const onSubmitForm = e => {
        e.preventDefault();
        localStorage.setItem("command-obsRemote", JSON.stringify(value))
    }

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <h1 className="h2">Command</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                <form onSubmit={onSubmitForm}>
                    <div className="mb-3">
                        <input type="text" name="command" className="form-control" placeholder="Comando Nome" value={value.command} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="text" name="defaultScene" className="form-control" placeholder="Default Scene" value={value.defaultScene} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                        <input type="text" name="response" className="form-control" placeholder="Response" value={value.response} onChange={handleChange} />
                    </div>

                    <button type="submit" className="w-100 btn btn-lg btn-primary">Salvar</button>
                </form>
            </div>
        </div >
    )
}

export default Command