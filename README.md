# COATI CHALLENGE

A simple web app system to schedule a event in the with users and roles (Admin and Normal Users) for Coati

### Features

- Registration and authentication using JWT (Sign In and Sing Up for new Users)
- CRUD Users (for Admins)
- CRUD Events (for Admins and Users)

### Installation NodeJS app

Run next command in terminal

```sh
npm install
```

After that, run the follow command

```sh
npm update
```

For run project localhost (development) execute next command

```sh
npm run dev
```
This run a local server in the next url
```sh
127.0.0.1:3000
```

#### Compile for production

For build to production run the next command

```sh
babel src --out-dir dist
```

After that run for production, but first verify the conections to db

```sh
node dist/index.js
```
