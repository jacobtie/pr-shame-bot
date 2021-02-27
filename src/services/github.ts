import axios from 'axios';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import InstallationAccessTokenResponse from '../types/InstallationAccessTokenResponse';

const localCache = new NodeCache({
  stdTTL: 55 * 60, // 55 minutes
});

const {
  GITHUB_API_BASE: githubBaseUrl,
  GITHUB_API_ACCEPT_HEADER: githubApiAcceptHeader,
  GITHUB_APP_ID: githubAppId,
} = process.env;

let { GITHUB_APP_PEM: githubAppPem, } = process.env;

if (
  !githubBaseUrl
  || !githubApiAcceptHeader
  || !githubAppId
  || !githubAppPem
) {
  throw new Error('Missing GitHub env vars');
}

githubAppPem = githubAppPem.replace(/\\n/g, '\n');

interface GithubPullRequestCommentContext {
  owner: string;
  repo: string;
  issueNumber: number;
  body: string;
  installationId: number;
}

const githubAxiosInstance = axios.create({
  baseURL: githubBaseUrl,
  headers: {
    Accept: githubApiAcceptHeader,
  },
});

export async function makeComment(context: GithubPullRequestCommentContext): Promise<void> {
  try {
    const installationAccessToken = await getInstallationAccessToken(context.installationId);
    const { owner, repo, issueNumber, body } = context;
    await githubAxiosInstance.post(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, { body }, {
      headers: {
        Authorization: `Token ${installationAccessToken}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function getInstallationAccessToken(installationId: number): Promise<string> {
  try {
    const existingToken = localCache.get(`installationAccessToken:${installationId}`);
    if (existingToken && typeof existingToken === 'string') {
      return existingToken;
    }
    
    const jwt = getGithubJwt();
    const res = await githubAxiosInstance.post<InstallationAccessTokenResponse>(`/app/installations/${installationId}/access_tokens`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  
    const { token } = res.data;
  
    if (!token) {
      throw new Error('Installation access token was blank');
    }

    localCache.set(`installationAccessToken:${installationId}`, token);

    return token;
  } catch (err) {
    err.title = 'Could not get installation access token';
    throw err;
  }
}

function getGithubJwt(): string {
  try {
    const myJwt = jwt.sign({
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(new Date(new Date().getTime() + (9.5 * 60000)).getTime() / 1000),
      iss: githubAppId,
    }, githubAppPem!, {
      algorithm: 'RS256'
    });

    return myJwt;
  } catch (err) {
    err.title = 'Could not get GitHub JWT';
    throw err;
  }
}
