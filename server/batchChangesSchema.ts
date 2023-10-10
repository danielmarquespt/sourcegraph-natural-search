/**
 * A batch specification, which describes the batch change and what kinds of changes to make
 * (or what existing changesets to track).
 */
export interface BatchSpec {
    /**
     * A template describing how to create (and update) changesets with the file changes
     * produced by the command steps.
     */
    changesetTemplate?: ChangesetTemplate;
    /**
     * The description of the batch change.
     */
    description?: string;
    /**
     * Import existing changesets on code hosts.
     */
    importChangesets?: ImportChangeset[] | null;
    /**
     * The name of the batch change, which is unique among all batch changes in the namespace. A
     * batch change's name is case-preserving.
     */
    name: string;
    /**
     * The set of repositories (and branches) to run the batch change on, specified as a list of
     * search queries (that match repositories) and/or specific repositories.
     */
    on?: OnQueryOrRepository[] | null;
    /**
     * The sequence of commands to run (for each repository branch matched in the `on` property)
     * to produce the workspace changes that will be included in the batch change.
     */
    steps?: Step[] | null;
    /**
     * Optional transformations to apply to the changes produced in each repository.
     */
    transformChanges?: TransformChanges | null;
    /**
     * Individual workspace configurations for one or more repositories that define which
     * workspaces to use for the execution of steps in the repositories.
     */
    workspaces?: WorkspaceConfiguration[] | null;
}

/**
 * A template describing how to create (and update) changesets with the file changes
 * produced by the command steps.
 */
export interface ChangesetTemplate {
    /**
     * The body (description) of the Pull request to be opened about this change.
     */
    body?: string;
    /**
     * The name of the Git branch to create or update on each repository with the changes.
     */
    branch: string;
    /**
     * The Git commit to create with the changes.
     */
    commit: ExpandedGitCommitDescription;
    /**
     * Whether to publish the changeset to a fork of the target repository. If omitted, the
     * changeset will be published to a branch directly on the target repository, unless the
     * global `batches.enforceFork` setting is enabled. If set, this property will override any
     * global setting.
     */
    fork?: boolean;
    /**
     * Whether to publish the changeset. An unpublished changeset can be previewed on
     * Sourcegraph by any person who can view the batch change, but its commit, branch, and pull
     * request aren't created on the code host. A published changeset results in a commit,
     * branch, and pull request being created on the code host. If omitted, the publication
     * state is controlled from the Batch Changes UI.
     */
    published?: { [key: string]: boolean | string }[] | boolean | null | string;
    /**
     * The title of the changeset.
     */
    title: string;
}

/**
 * The Git commit to create with the changes.
 */
export interface ExpandedGitCommitDescription {
    /**
     * The author of the Git commit.
     */
    author?: GitCommitAuthor;
    /**
     * The Git commit message.
     */
    message: string;
}

/**
 * The author of the Git commit.
 */
export interface GitCommitAuthor {
    /**
     * The Git commit author email.
     */
    email: string;
    /**
     * The Git commit author name.
     */
    name: string;
}

export interface ImportChangeset {
    /**
     * The changesets to import from the code host. For GitHub this is the PR number, for GitLab
     * this is the MR number, for Bitbucket Server this is the PR number.
     */
    externalIDs: Array<number | string> | null;
    /**
     * The repository name as configured on your Sourcegraph instance.
     */
    repository: string;
}

/**
 * A Sourcegraph search query that matches a set of repositories (and branches). Each
 * matched repository branch is added to the list of repositories that the batch change will
 * be run on.
 *
 * A specific repository (and branch) that is added to the list of repositories that the
 * batch change will be run on.
 */
export interface OnQueryOrRepository {
    /**
     * A Sourcegraph search query that matches a set of repositories (and branches). If the
     * query matches files, symbols, or some other object inside a repository, the object's
     * repository is included.
     */
    repositoriesMatchingQuery?: string;
    /**
     * The repository branch to propose changes to. If unset, the repository's default branch is
     * used. If this field is defined, branches cannot be.
     */
    branch?: string;
    /**
     * The repository branches to propose changes to. If unset, the repository's default branch
     * is used. If this field is defined, branch cannot be.
     */
    branches?: string[];
    /**
     * The name of the repository (as it is known to Sourcegraph).
     */
    repository?: string;
}

/**
 * A command to run (as part of a sequence) in a repository branch to produce the required
 * changes.
 */
export interface Step {
    /**
     * The Docker image used to launch the Docker container in which the shell command is run.
     */
    container: string;
    /**
     * Environment variables to set in the step environment.
     */
    env?: Array<{ [key: string]: string } | string> | { [key: string]: string } | null;
    /**
     * Files that should be mounted into or be created inside the Docker container.
     */
    files?: { [key: string]: string } | null;
    /**
     * A condition to check before executing steps. Supports templating. The value 'true' is
     * interpreted as true.
     */
    if?: boolean | null | string;
    /**
     * Files that are mounted to the Docker container.
     */
    mount?: Mount[] | null;
    /**
     * Output variables of this step that can be referenced in the changesetTemplate or other
     * steps via outputs.<name-of-output>
     */
    outputs?: { [key: string]: OutputVariable } | null;
    /**
     * The shell command to run in the container. It can also be a multi-line shell script. The
     * working directory is the root directory of the repository checkout.
     */
    run: string;
}

export interface Mount {
    /**
     * The path in the container to mount the path on the local machine to.
     */
    mountpoint: string;
    /**
     * The path on the local machine to mount. The path must be in the same directory or a
     * subdirectory of the batch spec.
     */
    path: string;
}

export interface OutputVariable {
    /**
     * The expected format of the output. If set, the output is being parsed in that format
     * before being stored in the var. If not set, 'text' is assumed to the format.
     */
    format?: "json" | "text" | "yaml";
    /**
     * The value of the output, which can be a template string.
     */
    value: string;
    [property: string]: any;
}

export interface TransformChanges {
    /**
     * A list of groups of changes in a repository that each create a separate, additional
     * changeset for this repository, with all ungrouped changes being in the default changeset.
     */
    group?: TransformChangesGroup[] | null;
}

export interface TransformChangesGroup {
    /**
     * The branch on the repository to propose changes to. If unset, the repository's default
     * branch is used.
     */
    branch: string;
    /**
     * The directory path (relative to the repository root) of the changes to include in this
     * group.
     */
    directory: string;
    /**
     * Only apply this transformation in the repository with this name (as it is known to
     * Sourcegraph).
     */
    repository?: string;
}

/**
 * Configuration for how to setup workspaces in repositories
 */
export interface WorkspaceConfiguration {
    /**
     * The repositories in which to apply the workspace configuration. Supports globbing.
     */
    in?: string;
    /**
     * If this is true only the files in the workspace (and additional .gitignore) are
     * downloaded instead of an archive of the full repository.
     */
    onlyFetchWorkspace?: boolean;
    /**
     * The name of the file that sits at the root of the desired workspace.
     */
    rootAtLocationOf: string;
}
