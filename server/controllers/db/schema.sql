DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id integer unique not null,
  user_name varchar(128),
  user_email varchar(128) not null,
  rating int not null DEFAULT 0,
  local_controller boolean not null DEFAULT false,
  active_controller boolean not null DEFAULT false,
  mentor boolean not null DEFAULT false,
  mentor_to int,
  admin boolean not null DEFAULT false,
  jwt varchar(10240) not null,
  access varchar(10240) not null,
  refresh varchar(10240) not null,
  date Date not null
);

DROP TABLE IF EXISTS trainingrequests CASCADE;

CREATE TABLE IF NOT EXISTS trainingrequests (
  id integer unique not null,
  training varchar not null,
  availableDates Date[] not null
);

DROP TABLE IF EXISTS trainingoffers CASCADE;

CREATE TABLE IF NOT EXISTS trainingoffers (
  id integer not null,
  training varchar not null,
  for_user integer,
  max_users integer not null DEFAULT 1,
  availabledate timestamp[] not null
);

DROP TABLE IF EXISTS trainings CASCADE;

CREATE TABLE IF NOT EXISTS trainings (
  id_student integer[] not null,
  id_mentor integer not null,
  training varchar not null,
  availabledate timestamp[] not null
);
