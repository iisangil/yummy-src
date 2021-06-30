# [yummy-src](https://iisangil.github.io/yummy)
This repo contains the source code for Yummy, a web application developed using React and Go.

## Contents
- [How To Use](https://github.com/iisangil/yummy-src#how-to-use)
- [Setting Up Locally](https://github.com/iisangil/yummy-src#setting-up-locally)
- [Frontend](https://github.com/iisangil/yummy-src#frontend)
- [Backend](https://github.com/iisangil/yummy-src#backend)
- [Todo](https://github.com/iisangil/yummy-src#todo)
- [Contributing](https://github.com/iisangil/yummy-src#contributing)

## How To Use
Ensure location services are turned on or Yummy will not work properly.

First, login or sign up. Then, you can either create a room or join a room. Once everyone has joined the room, hit start and you will be able to see restaurants and begin swiping.

## Setting Up Locally
To run locally, begin by cloning this repository. This repository is set up so that the frontend will run on localhost port 3000, and the backend will run on localhost port 8000.

## Frontend
In the `frontend` folder, run `yarn install` to install all dependencies needed. Then, run `yarn start` to begin running the web application.

This can also be done with other package managers, such as _npm_

You will also need a _Firebase_ configuration object and update the `.env.dist` file in the `frontend` folder. This can be done seen [here](https://firebase.google.com/docs/auth/web/password-auth)

## Backend
In the `backend` folder, run `go run main.go` to begin running the server.

You will need a _Yelp Fusion_ API key and update the `.env.dist` file in the `backend` folder. This can be done seen [here](https://www.yelp.com/developers/documentation/v3/authentication)

## Todo
- [ ] Make the Room component prettier
- [ ] Clicking on tinder card opens menu
- [ ] Include map component to menu to show restaurant location

## Contributing
This is an open source project, and anybody is welcome to contribute. If there are any suggestions, criticisms, bugs, feel free to open an issue as well.
