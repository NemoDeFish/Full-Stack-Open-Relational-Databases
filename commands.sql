CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text, -- Solution: adds `NOT NULL` but question doesn't state is required
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0 -- Solution: uses `int` instead of `integer`, same thing
);

-- Solution: try and use uppercase letters for commands i.e. INSERT INTO
insert into blogs (author, url, title)
values ('Dan Abramov', 'https://overreacted.io/things-i-dont-know-as-of-2018/', 'Things I Don''t Know as of 2018');

insert into blogs (author, url, title)
values ('Martin Fowler', 'https://martinfowler.com/articles/distributed-objects-microservices.html', 'Microservices and the First Law of Distributed Objects');

-- Solution: inserts 3 blogs instead of 2 only