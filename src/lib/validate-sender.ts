import crypto from 'crypto';
import PullRequestPayload from '../types/PullRequestPayload';

const githubAppSecret = process.env.GITHUB_APP_SECRET;
if (!githubAppSecret) {
  throw new Error('GITHUB_APP_SECRET env var not set');
}

export default function isSenderValid(message: Partial<PullRequestPayload>, hash: string): boolean {
  const messageHash = crypto.createHmac('sha256', githubAppSecret!)
    .update(JSON.stringify(message))
    .digest('hex');
  const messageHashWithPrefix = `sha256=${messageHash}`;
  return messageHashWithPrefix === hash;
}
