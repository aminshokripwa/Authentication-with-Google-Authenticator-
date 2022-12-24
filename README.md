# Two-Factor Authentication Login

## Getting Started

### Folder Structure
```
.
|-- .env
|-- App.js
|-- README.md
|-- HOWTO.md
|-- package.json
|-- .sequelizerc
|   --- config
|   --- migrations
|   --- models
|   --- public
|   --- routes
|   --- views
```

## Download the packages used to create this rest API
Run the following Node.js commands to install all the necessary packages.

```
`npm install`
```

## Setting configuration file
Edit .env file in the root of the project and set the parameters for connect to database and google data for login/register

```
`npx sequelize db:migrate`
```

## Running the project

```
`npm run start`
```

## Usage

http://localhost:3000