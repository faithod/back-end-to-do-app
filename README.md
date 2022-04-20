# To-Do App

A small full-stack to-do app built with the PERN stack (PostgreSQL Express React Node). This is only the back-end of this application, front-end can be found here: https://github.com/faithod/front-end-to-do-app 

## Demo

https://pern-to-do-app.netlify.app/

## Getting Started

### Front-end set-up

Install dependencies ```yarn```

Run locally ```yarn start```


### Back-end set-up

Install dependencies ```yarn```

Run server locally ```yarn start```

Or, for dev mode (restarts server automatically when relevant files change): ```yarn start:dev```

#### DB Setup

Install PostgreSQL and run it

You will need to create your own databases for this project - one locally and one on Heroku.

Copy .env.example to .env and set `DATABASE_URL` and `PORT` to your liking.

Example for a local database: `DATABASE_URL=postgres://username:password@host:port/databasename`


## Built With


### Front-end
* ReactJS 
* Create React App
* JavaScript
* TypeScript
* HTML
* CSS

### Back-end
* Node.js 
* Express.js 
* PostgreSQL 
* Dotenv 
