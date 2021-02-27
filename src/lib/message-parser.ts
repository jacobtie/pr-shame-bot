import PullRequestPayload from '../types/PullRequestPayload';
import { BadMessage, PullRequestMessage } from '../types/Messages';

export default function parseMessage(payload: PullRequestPayload): PullRequestMessage | BadMessage {
  if ((payload?.action === 'opened' || payload?.action === 'synchronize') && payload.pull_request) {
    const { pull_request: pullRequest, repository, installation } = payload;
    const {
      additions,
      deletions,
      changed_files: changedFiles,
      number: issueNumber,
    } = pullRequest;
    if (additions != null && deletions != null && changedFiles != null && issueNumber != null) {
      return {
        status: 'ok',
        installationId: installation.id,
        pull: {
          additions,
          deletions,
          changedFiles,
        },
        repository: {
          issueNumber,
          owner: repository.owner.login,
          repoName: repository.name,
        },
      };
    }
  }

  return {
    status: 'bad',
  };
}
