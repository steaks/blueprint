import pg from "pg-promise";
import {newDb} from "pg-mem";

const _db = newDb();
_db.public.none(`
  CREATE TABLE public.users (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL
 )`);
_db.public.none(`
  INSERT INTO public.users(id, name) 
  VALUES
    ('11526ecf-69d5-4144-9e83-a75e232803d4', 'Bert'), 
    ('973ef09d-7853-4664-8b17-f648373964a5', 'Ernie')
`);

export const db = _db.adapters.createPgPromise() as pg.IDatabase<any, any>;