-- create database
create database if not exists animals;

use animals;

-- create table
create table if not exists animals (
    id int not null auto_increment,
    name varchar(255) not null,
    age int not null,
    species varchar(255) not null,
    description varchar(255) not null,
    imageURL varchar(255) not null,
    primary key (id)
);

-- insert random data
insert into animals (name, age, species, description, imageURL)
values
    ('Bella', 2, 'dog', 'Bella is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Luna', 1, 'dog', 'Luna is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Lola', 3, 'dog', 'Lola is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Lucy', 4, 'dog', 'Lucy is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Molly', 5, 'dog', 'Molly is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Daisy', 6, 'dog', 'Daisy is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Maggie', 7, 'dog', 'Maggie is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Sophie', 8, 'dog', 'Sophie is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Chloe', 9, 'dog', 'Chloe is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Bailey', 10, 'dog', 'Bailey is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb=350'),
    ('Max', 11, 'dog', 'Max is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Charlie', 12, 'dog', 'Charlie is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Milo', 13, 'dog', 'Milo is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Buddy', 14, 'dog', 'Buddy is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Cooper', 15, 'dog', 'Cooper is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Rocky', 16, 'dog', 'Rocky is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Toby', 17, 'dog', 'Toby is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Jake', 18, 'dog', 'Jake is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Bear', 19, 'dog', 'Bear is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350'),
    ('Duke', 20, 'dog', 'Duke is a very friendly dog', 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350');

select * from animals;
