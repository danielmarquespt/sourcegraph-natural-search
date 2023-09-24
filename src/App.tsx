import { useState } from 'react'
import sourcegraphLogo from './assets/sourcegraph.svg'
import codyLogo from './assets/cody.svg'


function App() {
    const [humanQuery, setHumanQuery] = useState("")

    const handleChange = (e) => {
        setHumanQuery(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(humanQuery)
    }

    const proccessHumanQuery = () => {


    }

    return (
        <>
            <div>
                <img src={codyLogo} width={80} className="logo" alt="Vite logo" />
                <img src={sourcegraphLogo} width={80} className="logo react" alt="React logo" />
            </div>
            <h1>Cody for CodeSearch</h1>
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} className="home-input"/>
            </form>
            <div className="card">

                <h3>human query is {humanQuery}</h3>

            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
