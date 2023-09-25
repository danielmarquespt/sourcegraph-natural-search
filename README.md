![alt text](https://github.com/danielmarquespt/sourcegraph-natural-search/blob/main/home-screenshot.png?raw=true)


# Sourcegraph Natural Search
This is an experimental project that translates natural language queries to Sourcegraph syntax. Made this as a way of expanding my React and javascript skills

Uses [typechat]("https://github.com/microsoft/TypeChat") to generate a valid json out of the LLM. In this case it uses the default typechat implementation to its restricted to OpenAI models or Azure.

---
### Features:

**Handles basic logic like **AND** or **OR****

`Show me the diffs containing useMemo or useEffect on the sourcegraph cody repo in the last 6 months `

returns:

`after:"6 months ago" type:diff repo:^github\.com/sourcegraph/cody$ content:"useMemo" OR after:"6 months ago" type:diff repo:^github\.com/sourcegraph/cody$ content:"useEffect"`


**Expands well know git addresses from a basic keyword:**

`all the instances of task_struct data structure on the linux repo`

returns

`type:symbol repo:^github\.com/torvalds/linux$ content:"task_struct"`

**Identifies authors and handles basic timeframes**

`all diffs with task_struct by Linus in the linux repo on the last 2 years`

returns

`author:"Linus" after:"2 years ago" type:diff repo:^github\.com/torvalds/linux$ content:"task_struct"`

---

### Known Limitations

#### Still needs to be nudged a bit in the right direction. 
For example, mentioning "changes" not always results in "type:diff". Very rarely identifies symbols in the query as symbols, but if the symbol keyword is present, then the results are more predictable

#### Does not cover the whole syntax
Things like `fork:` or `case:` or `file:hasOwner()` are not yet covered.

#### Does not handle advanced regex for content
Right now, the content of a file is almost always just a keyword. No advanced matching via regex is ever generated

### Is flaky identifying paths
When a path for something or folder is mentioned in the natural lang query, it sometimes adds it to the repo name

### Has limited knowledge about dependencies between keywords
If a language is mentioned with the diff keyword, its going to output syntax with both, which is not ideal. It does however understand that for `author:` a `type:commit` or `type:diff` is needed



---

### How to run

needs a .env file on server folder with:

```
OPENAI_MODEL="gpt-4"
OPENAI_API_KEY="sk-YOUR-TOKEN"
```

To run front-end:

```
yarn 
yarn dev
```

to build the server after changes:
```
cd server
npm run build
```

to run the server:
```
cd server
node server.js
```
