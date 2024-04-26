create table student(
	SID serial primary key,
	username varchar (20),
	email varchar (50),
	password varchar (200),
	year int
);
create table events(
	EID serial primary key,
	Title varchar (50),
	Domain_t varchar(50),
	Date DATE,
	Description varchar (100),
	Seats int
)
create table alumnus(
	AID serial primary key,
	username varchar (20),
	password varchar(200),
	email varchar (50),
	experience_years int
)

create table internship(
	IID serial primary key,
	Title varchar (20),
	Roles varchar (20),
	Domain_t varchar (20),
	applicants int,
	description varchar (100),
	duration_months int,
	date DATE
)
alter table internship add column aid_fk int
alter table internship add FOREIGN KEY(aid_fk) references alumnus(AID);

create table apply(
	sid_fk int,
	iid_fk int,
	acceptance boolean,
	primary key (sid_fk,iid_fk)
)
alter table apply add FOREIGN KEY (sid_fk) references student(sid)
alter table apply add FOREIGN KEY (iid_fk) references internship(iid)

create table register(
	sid_fk int,
	eid_fk int,
	PRIMARY KEY(sid_fk,eid_fk)
)
alter table register add FOREIGN KEY (sid_fk) references student(sid)
alter table register add FOREIGN KEY (eid_fk) references events(eid)

create table manageEvents(
	sid_fk int,
	aid_fk int,
	acceptance boolean,
	primary key (sid_fk,aid_fk)
)
alter table manageEvents add FOREIGN KEY (sid_fk) references student(sid);
alter table manageEvents add FOREIGN KEY (aid_fk) references alumnus(aid);

create table student_interests(
	sid int primary key,
	AIML boolean,
	Web_Development boolean,
	Data_Science boolean,
	App_Dev boolean,
	CyberSec boolean,
	Cloud_Computing boolean,
	BlockChain boolean,
	IOT boolean
)
alter table student_interests add FOREIGN KEY(sid) references student(sid)

create table alumni_expertise(
	aid int primary key,
	AIML boolean,
	Web_Development boolean,
	Data_Science boolean,
	App_Dev boolean,
	CyberSec boolean,
	Cloud_Computing boolean,
	BlockChain boolean,
	IOT boolean
)
alter table alumni_expertise add FOREIGN KEY(aid) references alumnus(aid)
alter table events add column location varchar (20);
alter table internship add column location varchar (20);
ALTER TABLE events ADD COLUMN registeredStudents INTEGER DEFAULT 0;
alter table internship drop column applicants;
ALTER TABLE internship ADD COLUMN applications INTEGER DEFAULT 0;

-- updated version for multiple logins
create table users (
	uid serial primary key,
	username varchar (20),
	password varchar (200),
	email varchar (50)
)
ALTER TABLE student DROP COLUMN username, DROP COLUMN password, DROP COLUMN email;
ALTER TABLE alumnus DROP COLUMN username, DROP COLUMN password, DROP COLUMN email;
alter table student add column uid int;
alter table student add FOREIGN KEY(uid) references users(uid)
alter table alumnus add column uid int;
alter table alumnus add FOREIGN KEY(uid) references users(uid)
drop table student_interests;
alter table alumni_expertise RENAME TO user_preference
alter table user_preference drop column aid
alter table user_preference add column uid serial primary key
alter table user_preference add FOREIGN KEY(uid) references users(uid)

-- updated version for multiple logins(by pratham)
alter table users add role varchar(10);

-- queries for manage events table
alter table manageevents add column eid_fk int;
ALTER TABLE manageevents ADD FOREIGN KEY (eid_fk) REFERENCES events(eid);

-- Latest queries
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'manageevents'
  AND constraint_type = 'PRIMARY KEY';

alter table manageevents drop constraint manageevents_pkey;
alter table manageevents add primary key(sid_fk,eid_fk,aid_fk);

create table manageinternships(
 aid_fk int,
 iid_fk int,
 sid_fk int,
 PRIMARY KEY (aid_fk,iid_fk,sid_fk)
)

alter table manageinternships add FOREIGN KEY (sid_fk) references student(sid);
alter table manageinternships add FOREIGN KEY (aid_fk) references alumnus(aid);
alter table manageinternships add FOREIGN KEY (iid_fk) references internship(iid);

--updated for internship handling
drop table manageinternships;
alter table apply add column aid_fk int;

SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'apply'
  AND constraint_type = 'PRIMARY KEY';

alter table apply drop constraint apply_pkey;
alter table apply add primary key(sid_fk,iid_fk,aid_fk);


--ON DELETE CASCADE
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'apply'
  AND constraint_type ='FOREIGN KEY';

  ALTER TABLE apply
DROP CONSTRAINT apply_iid_fk_fkey,
ADD CONSTRAINT apply_iid_fk_fkey
FOREIGN KEY (iid_fk)
REFERENCES internship (iid)
ON DELETE CASCADE;


