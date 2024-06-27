import pg from "pg-promise";
import {newDb} from "pg-mem";

const _db = newDb();
_db.public.none(`
  CREATE TABLE public.users (
    id VARCHAR NOT NULL,
    team_id VARCHAR,
    name VARCHAR NOT NULL
 )`);
_db.public.none(`
  CREATE TABLE public.teams (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL
 )`);
_db.public.none(`
  CREATE TABLE public.tasks (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    owner_id VARCHAR,
    status VARCHAR
 )`);
_db.public.none(`
  INSERT INTO public.teams(id, name) 
  VALUES
    ('208f65e7-0984-4af0-b146-cecb70fd69ae', 'Frontend'), 
    ('6b2f374e-8705-4df1-9a2e-05fd833c536a', 'Backend'),
    ('28ce2ed8-88ed-43e2-8432-5303c39ce8c9', 'Ops')
`);
_db.public.none(`
  INSERT INTO public.users(id, team_id, name) 
  VALUES
    ('11526ecf-69d5-4144-9e83-a75e232803d4', '208f65e7-0984-4af0-b146-cecb70fd69ae', 'Bert'), 
    ('973ef09d-7853-4664-8b17-f648373964a5', '6b2f374e-8705-4df1-9a2e-05fd833c536a', 'Ernie'),
    ('770c8997-f0bb-45b4-be88-db7e62201f24', '28ce2ed8-88ed-43e2-8432-5303c39ce8c9', 'Andrea'),
    ('c8c93655-2dcc-417d-bb49-01218db58894', '28ce2ed8-88ed-43e2-8432-5303c39ce8c9', 'Sarah'),
    ('2264b5aa-836b-4ba4-84c4-0816572b52a1', '28ce2ed8-88ed-43e2-8432-5303c39ce8c9', 'Courtney'),
    ('42e769f0-7d4d-472b-b1fa-05ecf6a8ac02', '28ce2ed8-88ed-43e2-8432-5303c39ce8c9', 'Doug')
`);
_db.public.none(`
  INSERT INTO public.tasks(id, name, owner_id, status) 
  VALUES
    ('aa526ecf-69d5-4144-9e83-a75e232803d4', 'Do Stuff',  '11526ecf-69d5-4144-9e83-a75e232803d4', 'To Do'), 
    ('aa3ef09d-7853-4664-8b17-f648373964a5', 'Do More Stuff', '11526ecf-69d5-4144-9e83-a75e232803d4', 'To Do'),
    ('aa0c8997-f0bb-45b4-be88-db7e62201f24', 'Do Other Stuff', '11526ecf-69d5-4144-9e83-a75e232803d4', 'In Progress')
`);

export const db = _db.adapters.createPgPromise() as pg.IDatabase<any, any>;