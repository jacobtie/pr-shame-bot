# PR Shame Bot

The PR Shame Bot is a GitHub application which, when installed on a repository, posts a comment shaming a pull request for having more than 1000 changes.

![Shame Comment](https://github.com/jacobtie/pr-shame-bot/blob/main/assets/shame-bot-animated.gif)

The PR Shame Bot will only ever post once on an individual pull request.

## Installation

You can install the PR Shame Bot for all or select repositories here: [https://github.com/apps/pr-shame-bot](https://github.com/apps/pr-shame-bot). Once the bot is installed in a repository, all PRs are subject to the bot's shaming.

The source code for the PR Shame Bot is open source under the MIT license and is available here: [https://github.com/jacobtie/pr-shame-bot](https://github.com/jacobtie/pr-shame-bot).

## Security

All payloads sent to the bot's server are verified to have originated from GitHub using a secret stored in GitHub. Furthermore, all secrets relating to authentication and authorization of the bot to the GitHub API are protected on the bot's server.

The bot's permissions are set so that the bot cannot read code from repositories on which it is installed. The bot can only read metadata from a pull request and absolutely no data is permanently stored.

## Implementation

The GitHub application uses a web hook whenever a pull request is made on an installed repository. This web hook hits the single endpoint in this server. The server was built in Node.js with TypeScript and the express.js microframework.

The server itself is deployed to heroku using a GitHub action on a merge to the `main` branch.
