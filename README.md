# Welcome to Budgie!
Budgie is a simple, friendly app to help create budgets and track spending. It was born out of a couple needs - I stink with money, which needs to change, and I've gotten excited about the world beyond the front-end of an application but I had no way to explore that. 

So, I created this project to handle both those things!

Next steps? Create a REST API and a frontend app to consume it. 

## Local setup
- Pull this project down.
- Cd into the project.
- Startup the virtual environment : `. venv/bin/activate`
- Install all the dependencies.
- Make sure you have a `config.py` file in the root of the project with correct values.
- Create a user in your db - there's no interface for creating users in the app. Only login and logout.
- Then Run:
 ```
 % flask db upgrade
 % python main.py
```

## Add config file to connect to db
- In the root of the project create a `config.py` file.
- Add the following code, but replace DB_NAME with your db's name.
- I'm using postgres. You can swap that out if you want.
```
class Config(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql:///[DB_NAME]'
```

## Setup postgresql
- [Install postgres.](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/)
- Start postgres service.
```
% brew services start postgresql@14
```
- View services to confirm.
```
% brew services list
```
- Stop services (if you need to).
```
% brew services stop postgresql@14
```


## create a db:
- Enter postgres.
```
% psql postgres
```
- Create db.
```
postgres=# create database [DB_NAME];
```
- List dbs.
```
postgres=# \l
```
- Choose your database.
```
postgres=# \c [DB_NAME]
```
- View tables in chosen database.
```
[DB_NAME]=# \dt
```
- View contents of a particular table.
```
[DB_NAME]=# SELECT * FROM table_name
```
- Exit
```
exit;
```

## Start existing db.
```
% psql [DB_NAME]
```

