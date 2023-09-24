import { useState } from 'react'
import sourcegraphLogo from './assets/sourcegraph.svg'
import codyLogo from './assets/cody.svg'
import {SyncLoader} from 'react-spinners'

function App() {
    const [humanQuery, setHumanQuery] = useState("All the gitignore files Linus added in the last year to the linux repo")
    const [isProcessing, setIsProcessing] = useState(false)
    const [finalQuery, setFinalQuery] = useState("Type your natural language query and hit enter")

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setHumanQuery(e.target.value)
    }
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        proccessHumanQuery()
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
        <div className="container">
            <div>
                <img src={codyLogo} className="logo" alt="Cody logo" />
                <img src={sourcegraphLogo} className="logo" alt="Sourcegraph logo" />
            </div>
            <h1>Cody for CodeSearch </h1>
            <form onSubmit={handleSubmit}>
                <span className="label">Natural Language Query</span>
                <input onChange={handleChange} className={isProcessing ? "home-input disabled" : "home-input"} value={humanQuery}/>
            </form>
            <div className="card">
                <span className="label">Sourcegraph Syntax</span>
                <div className="final-query">
                    <a href={"https://sourcegraph.com/search?q="+ encodeURIComponent(finalQuery)} target="_blank"><pre>{isProcessing ? <SyncLoader size="6"  speedMultiplier="0.6" color="#FF5543"/> : finalQuery}</pre></a>
                </div>

            </div>
        </div>
    )
}

export default App
