create database if not exist crm_db;

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
    created_at timestamp default current_timestamp

    UNIQUE KEY unique_key (email)
    -- CONSTRAINT unique_key UNIQUE(email)

    FOREIGN KEY (company_id) references companies(id);
);

create table leads(
    id int primary key auto_increment,
    created_by int,
    assigned_to int,
    company_id int,
    lead_name varchar(200) not null,
    lead_email varchar(200) not null,
    lead_phone varchar(20) not null,
    lead_address varchar(255) not null,
    lead_company varchar(100) not null,
    lead_job varchar(100) not null,
    lead_industry varchar(100) not null,
    lead_type enum ('enterprise', 'startup', 'government', 'individual', 'education') not null,
    lead_source enum('website_form', 'social_media', 'webinar', 'walk_in', 'referral') not null,
    lead_status enum('new', 'contacted', 'qualified', 'won', 'lost') default 'new',
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,

    foreign key (created_by) references users(id),
    foreign key (assigned_to) references users(id),
    foreign key (company_id) references companies(id),

    index idx_email (lead_email)

);

-- app.get('/api/enums', async (req, res) => {
--   const enums = {
--     leadStatus: ['new', 'contacted', 'qualified', 'won', 'lost'],
--     leadType: [], // Your lead_type enum values
--     leadSource: [] // Your lead_source enum values
--   };
--   res.json(enums);
-- });