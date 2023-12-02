CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title)
values ('Dan Abramov', 'https://overreacted.io/things-i-dont-know-as-of-2018/', 'Things I Don''t Know as of 2018');

insert into blogs (author, url, title)
values ('Martin Fowler', 'https://martinfowler.com/articles/distributed-objects-microservices.html', 'Microservices and the First Law of Distributed Objects');
