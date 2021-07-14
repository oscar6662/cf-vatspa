DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id integer unique not null,
  user_name varchar(128),
  user_email varchar(128) not null,
  mentor boolean not null,
  admin boolean not null,
  jwt varchar(10240) not null,
  access varchar(10240) not null,
  refresh varchar(10240) not null,
  date Date not null
);
