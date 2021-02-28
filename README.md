# PR Shame Bot

The PR Shame Bot is a GitHub application which, when installed on a repository, posts a comment shaming a pull request for having more than 1000 changes.

![Shame Comment](https://github.com/jacobtie/pr-shame-bot/blob/main/assets/shame-bot-animated.gif)

The PR Shame Bot will only ever post once on an individual pull request.

## Installation

You can install the PR Shame Bot for all or select repositories here: [https://github.com/apps/pr-shame-bot](https://github.com/apps/pr-shame-bot). Once the bot is installed in a repository, all PRs are subject to the bot's shaming.

## Security

All payloads sent to the bot's server are verified to have originated from GitHub using a secret provided by GitHub. Furthermore, all secrets relating to authentication and authorization of the bot to the GitHub API are protected on the bot's server.
