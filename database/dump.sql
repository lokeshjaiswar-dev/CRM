create database if not exists crm_db;
use crm_db;

create table companies(
    id int primary key auto_increment,
    company_name varchar(100) not null,
    created_at timestamp default current_timestamp
);

create table users(
    id int primary key auto_increment,
    company_id int,
    fname varchar(100) not null,
    lname varchar(100) not null,
    email varchar(100) not null,
    password varchar(255) not null,
    phone varchar(20) not null,
    role enum('owner', 'manager', 'staff') default 'staff',
    created_at timestamp default current_timestamp,

    UNIQUE KEY unique_key (email),
    -- CONSTRAINT unique_key UNIQUE(email)

    FOREIGN KEY (company_id) references companies(id)
);

-- create table leads(
--     id int primary key auto_increment,
--     created_by int,
--     assigned_to int,
--     company_id int,
--     lead_name varchar(200) not null,
--     lead_email varchar(200) not null,
--     lead_phone varchar(20) not null,
--     lead_address varchar(255) not null,
--     lead_company varchar(100) not null,
--     lead_job varchar(100) not null,
--     lead_industry varchar(100) not null,
--     lead_type enum ('enterprise', 'startup', 'government', 'individual', 'education') not null,
--     lead_source enum('website_form', 'social_media', 'webinar', 'walk_in', 'referral') not null,
--     lead_status enum('new', 'contacted', 'qualified', 'won', 'lost') default 'new',
--     created_at timestamp default current_timestamp,
--     updated_at timestamp default current_timestamp on update current_timestamp,

--     foreign key (created_by) references users(id),
--     foreign key (assigned_to) references users(id),
--     foreign key (company_id) references companies(id),

--     index idx_email (lead_email)
-- );

CREATE table lead_type(
	id INT PRIMARY KEY AUTO_INCREMENT,
    type_name varchar(50) not null unique,
    description text,
    created_at timestamp default current_timestamp
);

insert into lead_type(type_name, description) values 
	("business", "Business Company"),
	("individual", "Individual Person"),
	("government", "Government org"),
	("school", "Educational Institute");

create table lead_source(
	id int primary key auto_increment,
    source_name varchar(50) not null unique,
    description text,
    created_at timestamp default current_timestamp
);

insert into lead_source(source_name, description) values 
	("website", "has seen our website"),
	("social media", "has seen our social media handles"),
	("walk in", "has came to our office"),
	("reference", "existing customer referred"),
    ("cold call", "sales team contacted");

create table lead_status(
	id int primary key auto_increment,
    status_name varchar(50) not null unique,
    description text,
    created_at timestamp default current_timestamp
);

insert into lead_status(status_name, description) values 
	("new", "has just added in the list"),
	("contacted", "has contacted the lead"),
	("won", "converted to customer"),
	("lost", "not converted to customer");


CREATE TABLE leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT NOT NULL,
    assigned_to INT,
    company_id INT NOT NULL,
    lead_name VARCHAR(200) NOT NULL,
    lead_email VARCHAR(200) NOT NULL,
    lead_phone VARCHAR(20) NOT NULL,
    lead_address VARCHAR(255) NOT NULL,
    lead_company VARCHAR(100) NOT NULL,
    
    -- Foreign key references
    lead_type_id INT NOT NULL,
    lead_source_id INT NOT NULL,
    lead_status_id INT DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    
    -- New foreign key constraints
    FOREIGN KEY (lead_type_id) REFERENCES lead_type(id),
    FOREIGN KEY (lead_source_id) REFERENCES lead_source(id),
    FOREIGN KEY (lead_status_id) REFERENCES lead_status(id),

    -- Indexes for better performance
    INDEX idx_email (lead_email),
    INDEX idx_lead_type (lead_type_id),
    INDEX idx_lead_source (lead_source_id),
    INDEX idx_lead_status (lead_status_id),
    INDEX idx_company (company_id),
    INDEX idx_assigned_to (assigned_to)
);

CREATE TABLE permissions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_by INT,
    company_id INT NOT NULL, -- Consider making this NOT NULL
    permission_name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys with actions
    FOREIGN KEY (created_by) REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicates
    UNIQUE KEY uk_company_permission (company_id, permission_name),
    
    -- Indexes for performance
    INDEX idx_permissions_company (company_id),
    INDEX idx_permissions_created_by (created_by),
    INDEX idx_permissions_status (status),
    INDEX idx_permissions_name (permission_name),
    
    -- Composite index for common queries
    INDEX idx_company_status (company_id, status)
);

CREATE TABLE roles(
	id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions(
	id int primary key auto_increment,
	role_id int not null,
    permission_id int not null,
    
    foreign key (role_id) references roles(id) on delete cascade,
    foreign key (permission_id) references permissions(id) on delete cascade,
    
    index idx_role_id (role_id),
    index idx_permission_id (permission_id)
);

drop table leads;
delete from users where id=4;

select * from companies;
select * from users;
select * from leads;

select * from lead_status;
select * from lead_type;
select * from lead_source;

select * from permissions;
select * from roles;
select * from role_permissions;

select r.id,r.role_name, group_concat(permission_name) as permissions
from role_permissions rp
join roles r on rp.role_id = r.id
join permissions p on rp.permission_id = p.id
group by r.id;


