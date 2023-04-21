--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE vizsgaremek;




--
-- Drop roles
--

DROP ROLE vizsgaremek;


--
-- Roles
--

CREATE ROLE vizsgaremek;
ALTER ROLE vizsgaremek WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:KY1bMRtEX53nDlJ4TGxlLw==$Oh1uuNC++f+PwQCQ1eb+h3/1in/c7d11b3RudUwsgOs=:6ViNtjrriRILxyyn47RQ2Siv+QX2RPVW+Qn2LlV4pyU=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: vizsgaremek
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO vizsgaremek;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: vizsgaremek
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: vizsgaremek
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: vizsgaremek
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: vizsgaremek
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO vizsgaremek;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: vizsgaremek
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- Database "vizsgaremek" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vizsgaremek; Type: DATABASE; Schema: -; Owner: vizsgaremek
--

CREATE DATABASE vizsgaremek WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE vizsgaremek OWNER TO vizsgaremek;

\connect vizsgaremek

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: vizsgaremek
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO vizsgaremek;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: vizsgaremek
--

COMMENT ON SCHEMA public IS '';


--
-- Name: role; Type: TYPE; Schema: public; Owner: vizsgaremek
--

CREATE TYPE public.role AS ENUM (
    'customer',
    'employee',
    'manager',
    'admin'
);


ALTER TYPE public.role OWNER TO vizsgaremek;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auditoriums; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.auditoriums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    seats integer NOT NULL
);


ALTER TABLE public.auditoriums OWNER TO vizsgaremek;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.movies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    duration_mins integer NOT NULL,
    thumbnail_path text,
    banner_path text,
    description text
);


ALTER TABLE public.movies OWNER TO vizsgaremek;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.reservations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    screening_id uuid NOT NULL,
    user_id uuid NOT NULL,
    purchase_time timestamp with time zone NOT NULL
);


ALTER TABLE public.reservations OWNER TO vizsgaremek;

--
-- Name: screenings; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.screenings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    movie_id uuid NOT NULL,
    auditorium_id uuid NOT NULL,
    "time" timestamp with time zone NOT NULL
);


ALTER TABLE public.screenings OWNER TO vizsgaremek;

--
-- Name: shifts; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.shifts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shift_from timestamp with time zone NOT NULL,
    shift_to timestamp with time zone NOT NULL,
    required_staff integer NOT NULL
);


ALTER TABLE public.shifts OWNER TO vizsgaremek;

--
-- Name: shifts_taken; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.shifts_taken (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    shift_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.shifts_taken OWNER TO vizsgaremek;

--
-- Name: users; Type: TABLE; Schema: public; Owner: vizsgaremek
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    role public.role DEFAULT 'customer'::public.role NOT NULL,
    totp_secret text,
    totp_enabled boolean DEFAULT false,
    hourly_wage numeric,
    manager_id uuid,
    registration_date timestamp with time zone DEFAULT now(),
    hire_date timestamp with time zone,
    CONSTRAINT username_regexp CHECK ((username ~ '^([A-Za-z0-9_-]){4,32}$'::text))
);


ALTER TABLE public.users OWNER TO vizsgaremek;

--
-- Data for Name: auditoriums; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.auditoriums (id, name, seats) FROM stdin;
7175a1c5-7909-4301-a788-44d40ea478e5    Room 1A 20
6b150f5e-86c5-46ac-8f20-c09d49c1c159    Room 1B 20
edd8577d-d5c5-4609-9f8f-33f1e42704dc    Room 2A 30
d8bbd08f-e280-48bd-9875-0f21d4ce33d3    Room 2B 30
3ec4c9c0-1d58-401f-a876-9ab523d985e8    Grand Premiere Room South       120
d5fed57b-a423-42ce-a110-5016fd3aeeac    Grand Premiere Room North       120
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.movies (id, title, subtitle, duration_mins, thumbnail_path, banner_path, description) FROM stdin;
e7b06cff-ac79-4f6e-9edd-ce89f7f95681    Drive   Drive (2011)    100     \N      \N      A mysterious Hollywood action film stuntman gets in trouble with gangsters when he tries to help his neighbor's husband rob a pawn shop while serving as his getaway driver.
088e7f0e-8695-4b65-a854-eee17317b1e4    Shrek 3 Shrek the Third 120     \N      \N      Reluctantly designated as the heir to the land of Far, Far Away, Shrek hatches a plan to install the rebellious Artie as the new king while Princess Fiona tries to fend off a coup d'état by the jilted Prince Charming.
09bdb4f0-33cf-436e-ad01-46cc71b4b47f    Cars 2          130     \N      \N      Star race car Lightning McQueen and his pal Mater head overseas to compete in the World Grand Prix race. But the road to the championship becomes rocky as Mater gets caught up in an intriguing adventure of his own: international espionage.
30d569f9-e500-4119-9876-25538ef6b71f    Avatar  The Way of Water        190     \N      \N      Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.
edd100fe-af94-4dd9-bbbb-8d923d6a1ccb    Barbie          90      \N      \N      To live in Barbie Land is to be a perfect being in a perfect place. Unless you have a full-on existential crisis. Or you're a Ken.
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.reservations (id, screening_id, user_id, purchase_time) FROM stdin;
\.


--
-- Data for Name: screenings; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.screenings (id, movie_id, auditorium_id, "time") FROM stdin;
77fd9662-c7c9-47f3-9164-77f84c4fd5e3    088e7f0e-8695-4b65-a854-eee17317b1e4    7175a1c5-7909-4301-a788-44d40ea478e5    2023-05-02 14:00:00+00
e44e9911-fd37-4aef-b0b7-935d6652e489    088e7f0e-8695-4b65-a854-eee17317b1e4    6b150f5e-86c5-46ac-8f20-c09d49c1c159    2023-05-02 14:00:00+00
9981a991-4105-419c-b397-9ae10b709365    09bdb4f0-33cf-436e-ad01-46cc71b4b47f    edd8577d-d5c5-4609-9f8f-33f1e42704dc    2023-05-02 14:00:00+00
65404fb8-8668-49cf-bae2-d8a3cebbce18    edd100fe-af94-4dd9-bbbb-8d923d6a1ccb    3ec4c9c0-1d58-401f-a876-9ab523d985e8    2023-05-02 14:00:00+00
7c9cc887-0d63-45c9-a536-f64d5972bb70    e7b06cff-ac79-4f6e-9edd-ce89f7f95681    d8bbd08f-e280-48bd-9875-0f21d4ce33d3    2023-05-02 14:00:00+00
48284739-2ba4-496e-9f2c-bbc4edb74f60    088e7f0e-8695-4b65-a854-eee17317b1e4    6b150f5e-86c5-46ac-8f20-c09d49c1c159    2023-06-10 14:00:00+00
454d0d4f-04ac-47cd-ac54-621859da96d3    088e7f0e-8695-4b65-a854-eee17317b1e4    7175a1c5-7909-4301-a788-44d40ea478e5    2023-06-10 14:00:00+00
27a95156-1217-4202-867b-74bafda3e710    09bdb4f0-33cf-436e-ad01-46cc71b4b47f    edd8577d-d5c5-4609-9f8f-33f1e42704dc    2023-06-10 14:00:00+00
f1ab8653-2673-4d4e-9755-25c8cdb26077    edd100fe-af94-4dd9-bbbb-8d923d6a1ccb    3ec4c9c0-1d58-401f-a876-9ab523d985e8    2023-06-10 14:00:00+00
2b76b4fc-ba01-4354-ab65-949a82f4f575    e7b06cff-ac79-4f6e-9edd-ce89f7f95681    d8bbd08f-e280-48bd-9875-0f21d4ce33d3    2023-06-10 14:00:00+00
\.


--
-- Data for Name: shifts; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.shifts (id, shift_from, shift_to, required_staff) FROM stdin;
4085d702-bd70-495a-816e-fca3e867aebf    2023-05-01 06:00:00+00  2023-05-01 14:00:00+00  2
7b6ed346-a098-41ea-b638-96f58e9fcffb    2023-05-01 06:00:00+00  2023-05-01 10:00:00+00  2
3a2114a6-613d-4e25-b029-9e8afcc3496a    2023-05-01 10:00:00+00  2023-05-01 14:00:00+00  2
0d15a0dc-fb8f-4cdf-bd42-696750fb1966    2023-05-01 10:00:00+00  2023-05-01 18:00:00+00  2
8a7791a4-259d-46e3-81ce-c47c4dfa0002    2023-05-01 14:00:00+00  2023-05-01 18:00:00+00  2
be154871-a7d0-4e5a-b67f-ebf40457d046    2023-05-01 14:00:00+00  2023-05-01 22:00:00+00  2
2b86b220-4db9-4207-831b-679b70d65031    2022-05-02 06:00:00+00  2023-05-02 14:00:00+00  2
2e1cc000-6063-4574-bc5f-463405a6227c    2023-05-02 06:00:00+00  2023-05-02 10:00:00+00  2
95e10a24-8c7a-408f-899a-032c0bfd1319    2023-05-02 10:00:00+00  2023-05-02 14:00:00+00  2
ac9907ab-a439-4a78-aa4b-03a432fc9760    2023-05-02 10:00:00+00  2023-05-02 18:00:00+00  2
2bf3b172-0d59-4b38-89e6-b4675858410e    2023-05-02 14:00:00+00  2023-05-02 18:00:00+00  2
2138c46b-be79-47a5-a704-bf32d396744e    2023-05-02 14:00:00+00  2023-05-02 22:00:00+00  2
9da3184c-d0a1-4aa1-a3ca-806ab70ef3e6    2023-05-03 06:00:00+00  2023-05-03 14:00:00+00  2
ad60a0e3-4a4e-4064-9d1b-8e9845af1d0c    2023-05-03 06:00:00+00  2023-05-03 10:00:00+00  2
128acd77-9224-4f68-8be7-86d2f70287a7    2023-05-03 10:00:00+00  2023-05-03 14:00:00+00  2
66881c7e-e511-4d7f-9710-49dec3013c56    2023-05-03 10:00:00+00  2023-05-03 18:00:00+00  2
6fcaa742-5380-4e78-b67c-634cab9015b2    2023-05-03 14:00:00+00  2023-05-03 18:00:00+00  2
9ab3f534-2307-46d9-8441-076316640c4d    2023-05-03 14:00:00+00  2023-05-03 22:00:00+00  2
9df301b0-c257-4044-ae13-921a897ce73e    2023-05-25 06:00:00+00  2023-05-25 14:00:00+00  2
916d8206-aa84-40dd-b5b3-27fcff3da8e4    2023-05-25 06:00:00+00  2023-05-25 10:00:00+00  2
08bd5bf4-36e7-4704-93a4-33508dc72145    2023-05-25 10:00:00+00  2023-05-25 14:00:00+00  2
fe15acbe-7387-4cbc-b479-4b4dc3d0c089    2023-05-25 10:00:00+00  2023-05-25 18:00:00+00  2
fcb008c3-5f8e-4d8c-9849-a2679584ce1a    2023-05-25 14:00:00+00  2023-05-25 18:00:00+00  2
a22de5af-3c67-4855-9f78-dba2c156ce24    2023-05-25 14:00:00+00  2023-05-25 22:00:00+00  2
e203c029-b640-4c4e-b44d-885757c39889    2023-06-10 06:00:00+00  2023-06-10 14:00:00+00  2
53631bc0-471d-498a-9a58-b080c918b107    2023-06-10 06:00:00+00  2023-06-10 10:00:00+00  2
7256d887-390c-42de-988e-5f2d92016c53    2023-06-10 10:00:00+00  2023-06-10 14:00:00+00  2
5517f67e-7279-4725-8b40-397f7620e40e    2023-06-10 10:00:00+00  2023-06-10 18:00:00+00  2
549a4ba6-f4ea-4ac9-98a3-5db9ce6d9b0b    2023-06-10 14:00:00+00  2023-06-10 18:00:00+00  2
b80847ca-d7c9-4fa9-9f97-1bad51fb8c3c    2023-06-10 14:00:00+00  2023-06-10 22:00:00+00  2
\.


--
-- Data for Name: shifts_taken; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.shifts_taken (id, shift_id, user_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vizsgaremek
--

COPY public.users (id, username, password, first_name, last_name, role, totp_secret, totp_enabled, hourly_wage, manager_id, registration_date, hire_date) FROM stdin;
53e1abaf-bb8e-4882-9ba0-5a9157ecc75b    test_admin      $argon2id$v=19$m=65536,t=3,p=4$DNe2WcH6Mxji2gcinG8oNw$jh4OBrPY/CAT/vaLqcxpxRoZAabR3POgFkiqquA4NTw     Test    Admin   admin   \N      f       \N      \N      2023-04-21 06:17:54.448396+00   \N
7b470cbf-8b5f-4af1-8c7d-7a9c5f955858    test_customer   $argon2id$v=19$m=65536,t=3,p=4$IrxY+6cdxDs8NhWhMjY7vQ$jzL+NB+C35L1w+mhdOZtn1+L6hF5+vDr1EkADIBWSaM     Test    Customer        customer        \N      f       \N      \N      2023-04-21 06:18:39.058146+00   \N
ba8748ce-517e-400d-b8c6-859331015151    test_manager    $argon2id$v=19$m=65536,t=3,p=4$I/FNcU+RcMNBDCH9Lu+ioQ$KBxmu+oFzI8Tn7JWLVNAxEMK1nTHqoTIMaU3C2XRudg     Test    Manager manager \N      f       \N      \N      2023-04-21 06:18:12.206793+00   2023-04-21 06:21:12.605232+00
9af9eb88-609a-4b14-8265-7e347979cd96    test_employee   $argon2id$v=19$m=65536,t=3,p=4$isvvnlznwUK90a235EcFrg$gg+0I24Tug6T6dkgWDUgyHyMiAKNnsVgklQaY2HSFOc     Test    Employee        employee        \N      f       \N      \N      2023-04-21 06:18:25.160212+00   2023-04-21 06:21:12.615702+00
\.


--
-- Name: auditoriums auditoriums_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.auditoriums
    ADD CONSTRAINT auditoriums_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: screenings screenings_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.screenings
    ADD CONSTRAINT screenings_pkey PRIMARY KEY (id);


--
-- Name: shifts shifts_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.shifts
    ADD CONSTRAINT shifts_pkey PRIMARY KEY (id);


--
-- Name: shifts_taken shifts_taken_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.shifts_taken
    ADD CONSTRAINT shifts_taken_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: reservations reservations_screening_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_screening_id_fkey FOREIGN KEY (screening_id) REFERENCES public.screenings(id) ON DELETE CASCADE;


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: screenings screenings_auditorum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.screenings
    ADD CONSTRAINT screenings_auditorum_id_fkey FOREIGN KEY (auditorium_id) REFERENCES public.auditoriums(id) ON DELETE CASCADE;


--
-- Name: screenings screenings_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.screenings
    ADD CONSTRAINT screenings_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: shifts_taken shifts_taken_shift_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.shifts_taken
    ADD CONSTRAINT shifts_taken_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id) ON DELETE CASCADE;


--
-- Name: shifts_taken shifts_taken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.shifts_taken
    ADD CONSTRAINT shifts_taken_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vizsgaremek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: vizsgaremek
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--