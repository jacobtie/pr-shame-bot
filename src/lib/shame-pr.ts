import { PullRequestMessage } from '../types/Messages';
import { hasPostedBefore, makeComment } from '../services/github';

export default async function shamePR(message: PullRequestMessage): Promise<void> {
  if (!shouldShamePR(message)) {
    return; // Not big enough to shame
  }

  const postedBefore = await hasPostedBefore({
    installationId: message.installationId,
    owner: message.repository.owner,
    repo: message.repository.repoName,
    issueNumber: message.repository.issueNumber,
  });

  if (postedBefore) {
    return; // Do not post more than once
  }

  await makeComment({
    installationId: message.installationId,
    owner: message.repository.owner,
    repo: message.repository.repoName,
    issueNumber: message.repository.issueNumber,
    body: getCommentBody(),
  });
}

function shouldShamePR(message: PullRequestMessage): boolean {
  const { pull: { additions, deletions } } = message;
  const totalChanges = additions + deletions;
  return totalChanges >= 1000;
}

function getCommentBody(): string {
  const imageUrl = getRandomImageUrl();
  return `# Shame 🔔 Your PR is huge!\n![Shame](${imageUrl})`;
}

const imageUrls = [
  'https://media.giphy.com/media/vX9WcCiWwUF7G/giphy.gif', // GoT Shame
  'https://media.giphy.com/media/Db3OfoegpwajK/giphy.gif', // Pumba Shame
  'https://media.giphy.com/media/P8WZZ0NYdbXAA/giphy.gif', // Panda Shame
  'https://media.giphy.com/media/PJeKg31621Wgw/giphy.gif', // Sylvester Shame
  'https://media.giphy.com/media/hURsrHYlao1Ko/giphy.gif', // Doug Shame
  'https://media.giphy.com/media/eP1fobjusSbu/giphy.gif', // Despicable Me Shame
];

function getRandomImageUrl(): string {
  const randIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randIndex];
}
