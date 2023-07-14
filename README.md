
## setup postgresql
- [install postgres](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/)
- start postgres service
```
% brew services start postgresql@14
```
- view services to confirm
```
% brew services list
```
- stop services
```
% brew services stop postgresql@14
```
---

## to create a new db:
- enter postgres
```
% psql postgres
```
- create db
```
postgres=# create database [DB_NAME];
```
- list dbs
```
postgres=# \l
```
- choose your database
```
postgres=# \c [DB_NAME]
```
- view tables in chosen database
```
[DB_NAME]=# \dt
```
- view contents of a particular table
```
[DB_NAME]=# SELECT * FROM table_name
```
- exit
```
exit;
```
---

## start existing db
```
% psql [DB_NAME]
```

## startup virtual env
```
. venv/bin/activate
```

## add config file to connect to db
- in the root of the project create a `config.py` file
- add the following code, but replace DB_NAME with your db's name
```
class Config(object):
    SQLALCHEMY_DATABASE_URI = 'postgresql:///[DB_NAME]'
```
