import fs from "fs";
import path from "path";
import { useState } from 'react'
import sourcegraphLogo from './assets/sourcegraph.svg'
import codyLogo from './assets/cody.svg'


function App() {
    const [humanQuery, setHumanQuery] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [finalQuery, setFinalQuery] = useState("")

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setHumanQuery(e.target.value)
    }
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        proccessHumanQuery()
        alert("sent!")
    }
    const proccessHumanQuery = async () => {

        setIsProcessing(true);


        fetch("http://localhost:1337/api/query-request", {
            method: "POST",
            body: JSON.stringify({ newMessage: humanQuery }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((query) => {

                console.log(query);
                convertSyntax(query);
            })
            .catch((err) => console.error(err))
            .finally(() => { setIsProcessing(false); });
    };

    const convertSyntax = (query) => {
        const resultQueries: string[] = [];
        console.log(query.basicQueries);
        for (const basicQuery of query.items.basicQueries) {
            const queryStringParts: string[] = [];

            // Attributes for CommitOrDiffQuery
            if (basicQuery.resultType === 'commit' || basicQuery.resultType === 'diff') {
                const commitOrDiffQuery = basicQuery;

                if (commitOrDiffQuery.author) {
                    queryStringParts.push(`author:"${commitOrDiffQuery.author}"`);
                }

                if (commitOrDiffQuery.before) {
                    queryStringParts.push(`before:"${commitOrDiffQuery.before}"`);
                }

                if (commitOrDiffQuery.after) {
                    queryStringParts.push(`after:"${commitOrDiffQuery.after}"`);
                }

                if (commitOrDiffQuery.message) {
                    queryStringParts.push(`message:"${commitOrDiffQuery.message}"`);
                }
            }

            // Convert each basic query attribute common to BaseBasicQuery
            if (basicQuery.resultType) {
                queryStringParts.push(`type:${basicQuery.resultType}`);
            }

            if (basicQuery.includeRepos && basicQuery.includeRepos.length > 0) {
                basicQuery.includeRepos.forEach((repo: string) => {
                    queryStringParts.push(`repo:${repo}`);
                });
            }

            if (basicQuery.excludeRepos && basicQuery.excludeRepos.length > 0) {
                basicQuery.excludeRepos.forEach((repo: string) => {
                    queryStringParts.push(`-repo:${repo}`);
                });
            }

            if (basicQuery.includeFiles && basicQuery.includeFiles.length > 0) {
                basicQuery.includeFiles.forEach((file: string) => {
                    queryStringParts.push(`file:${file}`);
                });
            }

            if (basicQuery.excludeFiles && basicQuery.excludeFiles.length > 0) {
                basicQuery.excludeFiles.forEach((file: string) => {
                    queryStringParts.push(`-file:${file}`);
                });
            }

            if (basicQuery.includeContent) {
                queryStringParts.push(`content:"${basicQuery.includeContent}"`);
            }

            if (basicQuery.excludeContent) {
                queryStringParts.push(`-content:"${basicQuery.excludeContent}"`);
            }

            if (basicQuery.includeLanguages && basicQuery.includeLanguages.length > 0) {
                basicQuery.includeLanguages.forEach((lang: string) => {
                    queryStringParts.push(`language:${lang}`);
                });
            }

            if (basicQuery.excludeLanguages && basicQuery.excludeLanguages.length > 0) {
                basicQuery.excludeLanguages.forEach((lang: string) => {
                    queryStringParts.push(`-language:${lang}`);
                });
            }

            resultQueries.push(queryStringParts.join(' '));
        }

        let finalQuery = '';
        if(query.items.logicalOperator && query.items.logicalOperator !== 'NONE') {
            finalQuery = resultQueries.join(` ${query.items.logicalOperator} `);
        } else {
            finalQuery = resultQueries.join(' ');
        }

        setFinalQuery(finalQuery);
        console.log("Found operators: ", query.items.logicalOperator);
        console.log("FINAL QUERY: ", finalQuery);
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
                <div className="finall-query">
                    <pre>{finalQuery? finalQuery:"no query yet"}</pre>
                </div>

                <p>isProcessing? {isProcessing.toString()}</p>
            </div>

            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
