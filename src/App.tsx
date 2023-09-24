import fs from "fs";
import path from "path";
import { useState } from 'react'
import sourcegraphLogo from './assets/sourcegraph.svg'
import codyLogo from './assets/cody.svg'
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import {CommitOrDiffQuery, QueryParams} from "./queryParamSchema";



const envDetails = {
    "OPENAI_MODEL": import.meta.env.VITE_OPENAI_MODEL,
    "OPENAI_API_KEY": import.meta.env.VITE_OPENAI_API_KEY
}


const model = createLanguageModel(envDetails);
const schema = fs.readFileSync(path.join(__dirname, "queryParamSchema.ts"), "utf8");  // Adjust the path accordingly


console.log(model);

function App() {
    const [humanQuery, setHumanQuery] = useState("")

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setHumanQuery(e.target.value)
    }
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        alert(humanQuery)
    }


    // @ts-ignore
    const proccessHumanQuery = () => {

    }

    return (
        <>
            <div>
                <img src={codyLogo} width={80} className="logo" alt="Vite logo" />
                <img src={sourcegraphLogo} width={80} className="logo react" alt="React logo" />
            </div>
            <h1>Cody for CodeSearch </h1>
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
