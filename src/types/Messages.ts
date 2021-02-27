export interface BadMessage {
  status: 'bad';
}

export interface PullRequestMessage {
  status: 'ok';
  installationId: number;
  pull: {
    additions: number;
    deletions: number;
    changedFiles: number;
  };
  repository: {
    owner: string;
    repoName: string;
    issueNumber: number;
  };
}
