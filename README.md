![](https://i.imgur.com/qNZOPv2.png)

<p>
  <a><img alt="ci" src="https://github.com/shinomiya-corp/chika/actions/workflows/ci.yml/badge.svg"/></a>
	<a href="https://www.chikawara.xyz"><img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fwww.chikawara.xyz"></a>
	<a href="https://codeclimate.com/github/shinomiya-corp/chika-bot/maintainability"><img src="https://api.codeclimate.com/v1/badges/b8793d37cbbbde8f1e96/maintainability" /></a>
	<a><img alt="GitHub" src="https://img.shields.io/github/license/shinomiya-corp/chika"></a>
  <a href="https://discord.com/api/oauth2/authorize?client_id=843481025459519528&permissions=540018688&scope=bot"><img alt="Invite" src="https://img.shields.io/static/v1?logo=discord&label=invite&message=Chika&color=f2d5da"></a>
<p/>

# discord.js bot for Chika

I strongly believe **Hayasaka is best girl**, so it puzzles myself why I chose Chika as a template for the bot. But we've gone too far to turn back now.

## Features

- 🎮 Games from the manga (Shiritori and Balloon(?))
  - More are coming soon<sup>TM</sup>
- 🎧 Simple music streaming
- 🦜 An unintelligent AI chatbot for Kaguya and Chika
  - I don't know anything about ML but hey it kinda works
- 💰 Global currency system
- ...and some others probably, see the full list [here](https://www.chikawara.xyz/commands)

## Run Locally

Clone the project

```bash
  git clone https://github.com/shinomiya-corp/chika.git
```

Install dependencies

```bash
  cd chika && yarn
```

Build and run (requires node v14.16.1 for music to work, idk why lol)

```bash
  yarn tsc && node dist/index.js
```

## Environment Variables

To run this project, you'll need to add the following environment variables to your .env file

`APP_TOKEN`, `BOT_USER_ID` (from Discord's developer portal)

`DATABASE_URL`, `REDISCLOUD_URL` (pointing to a postgres and redis instance)

`HUGGING_FACE_CHIKA`, `HUGGING_FACE_CHIKA_KEY`, `HUGGING_FACE_KAGUYA`, `HUGGING_FACE_KAGUYA_KEY` (from hosting the ML stuff on huggingface.co)

`ANILIST_SCHEMA` (it's just https://graphql.anilist.co)

## Roadmap

- Web dashboard in NextJS
- Integrate [uwu](https://github.com/Daniel-Liu-c0deb0t/uwu) into a command

## Screenshots

Here are some bruh moments

![](https://i.imgur.com/f04jOgr.png)

![](https://i.imgur.com/m5F6ows.png)

![](https://i.imgur.com/UQZxD0E.png)

## Feedback

If you have any feedback or spot bugs, please raise an issue on GitHub.
