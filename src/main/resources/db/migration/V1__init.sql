create table users (
    id                      bigserial primary key,
    username                varchar(30) not null unique,
    password                varchar(80) not null,
    email                   varchar(80) unique,
    created_at              timestamp default current_timestamp,
    updated_at              timestamp default current_timestamp
);

create table roles (
    id                      bigserial primary key,
    name                    varchar(50) not null unique,
    created_at              timestamp default current_timestamp,
    updated_at              timestamp default current_timestamp
);

CREATE TABLE users_roles (
          user_id                 bigint not null references users (id),
          role_id                 bigint not null references roles (id),
          primary key (user_id, role_id)
);

insert into roles (name)
values
('ROLE_USER'),
('ROLE_ADMIN');

insert into users (username, password, email)
values
('user', '$2y$12$4g1SOm4vGFSF/CbT84nOzOyygKSuTtRshecj7HYOCC1xUPjhkVPWG', 'bob_johnson@gmail.com'),
('admin', '$2y$12$4g1SOm4vGFSF/CbT84nOzOyygKSuTtRshecj7HYOCC1xUPjhkVPWG', 'john_johnson@gmail.com');

insert into users_roles (user_id, role_id)
values
(1, 1),
(2, 2);

create table categories (
    id                              bigserial primary key,
    title                           varchar(255),
    created_at                      timestamp default current_timestamp,
    updated_at                      timestamp default current_timestamp
);

insert into categories (title)
values
('Food');

create table products (
    id                              bigserial primary key,
    title                           varchar(255),
    price                           numeric (8, 2),
    category_id                     bigint references categories (id),
    created_at                      timestamp default current_timestamp,
    updated_at                      timestamp default current_timestamp
);

insert into products (title, price, category_id)
values
('Bread', 25.50, 1),
('Milk', 80.40, 1),
('Cheese', 325.00, 1),
('Cheese2', 325.00, 1),
('Cheese3', 325.00, 1),
('Cheese4', 325.00, 1),
('Cheese5', 325.00, 1),
('Cheese6', 325.00, 1),
('Cheese7', 325.00, 1),
('Cheese8', 325.00, 1),
('Cheese9', 325.00, 1),
('Cheese10', 325.00, 1),
('Cheese11', 325.00, 1),
('Cheese12', 325.00, 1);

create table orders (
    id                              bigserial primary key,
    user_id                         bigint references users (id),
    price                           numeric (8, 2),
    created_at                      timestamp default current_timestamp,
    updated_at                      timestamp default current_timestamp
);

create table order_items (
    id                              bigserial primary key,
    order_id                        bigint references orders (id),
    product_id                      bigint references products (id),
    quantity                        int,
    price_per_product               numeric (8, 2),
    price                           numeric (8, 2),
    created_at                      timestamp default current_timestamp,
    updated_at                      timestamp default current_timestamp
);