export interface QueryParams {
    logicalOperator?: 'AND' | 'OR' | 'NONE';
    basicQueries: BasicQuery[];
}

export type BasicQuery = CommitOrDiffQuery | RegularQuery;

export interface BaseBasicQuery {

    // if not a full repo path is mentioned, suggest the most likely full path. for example
    // react repo => ^github\.com/facebook/react$
    // vue => ^github\.com/vuejs/vue$
    // linux => ^github\.com/torvalds/linux$
    // gitlab => ^gitlab\.com/gitlab-org/gitlab$
    includeRepos?: RegExpPattern[];
    excludeRepos?: RegExpPattern[];
    revisions?: Revision[];
    includeLanguages?: Language[];
    excludeLanguages?: Language[];
    includeFiles?: RegExpPattern[];
    excludeFiles?: RegExpPattern[];
    includeContent?: RegExpPattern;
    excludeContent?: string;
}

export interface CommitOrDiffQuery extends BaseBasicQuery {

    //'commit' is used for searches only the commit message itself.
    //'diff' is used to retrieve changes made by an author. Even if the request mentions commit, this is often preferable instead

    resultType: 'commit' | 'diff';
    author?: string;

    //examples of accepted date formats: november 1 2019
    // 1 november 2019
    // 2019.11.1
    // 11/1/2019
    // 01.11.2019
    // Thu, 07 Apr 2005 22:13:13 +0200
    // 2005-04-07
    // 2005-04-07T22:13:13
    // 2005-04-07T22:13:13+07:00
    // yesterday
    // 5 days ago
    // 20 minutes ago
    // 2 weeks ago

    before?: string;
    after?: string;
    message?: string;
}

export interface Revision {
    branch?: string;
    gitTag?: string;
    commitHash?: string;
}

export interface RegularQuery extends BaseBasicQuery {
    resultType:
    // returns a list of programing symbols like variables, functions, Modules/Packages/Imports, data structures etc
        'symbol'
        // only displays file paths on results
        | 'path'
        // returns files that match the on their content or title
        | 'file';
}

//RegExpPattern examples:
//\.md$"
//\.js$"
//^github\.com/org/repo-name$
//companyName\/.*

export type RegExpPattern = string;  // Add any regex validation logic in the application, not as comments

// List of supported languages
export type Language =
    | 'python'
    | 'javascript'
    | 'java'
    | 'c#'
    | 'php'
    | 'typescript'
    | 'ruby'
    | 'c++'
    | 'go'
    | 'swift'
    | 'kotlin'
    | 'rust';
