\connect bocadb;

DROP TABLE IF EXISTS "tagstable" CASCADE;
CREATE TABLE "public"."tagstable" (
    "entityid" varchar(50) NOT NULL,
    "tagid" integer NOT NULL,
    "tagname" varchar(50) NOT NULL,
    "tagvalue" varchar(50) NOT NULL,
    CONSTRAINT "entitytags_pkey" PRIMARY KEY ("entityid", "tagid")
) WITH (oids = false);