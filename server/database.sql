CREATE DATABASE PerfectStaff;

USE PerfectStaff;

CREATE TABLE organisation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organisationName VARCHAR(250) NOT NULL UNIQUE,
    registrationNumber VARCHAR(250),
    VATNumber VARCHAR(250),
    email VARCHAR(160) NOT NULL UNIQUE,
    address1 VARCHAR(250),
    address2 VARCHAR(250),
    address3 VARCHAR(250),
    city VARCHAR(250),
    province VARCHAR(75) NOT NULL,
    country VARCHAR(100) NOT NULL,
    zipCode VARCHAR(10),
    contactNumber VARCHAR(15) not null,
    subscribed boolean default false,
    createdAt timestamp default now()
);


CREATE TABLE staffTypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_description varchar(60) NOT NULL,
    createdAt timestamp default now(),
    organisation INT NOT Null,
    FOREIGN KEY (organisation) REFERENCES organisation(id)
);


CREATE TABLE policies (
    id INT primary Key AUTO_INCREMENT,
    policyName varchar(250) NOT NULL,
    policyLink varchar(250) NOT NULL,
    description text NOT NULL,
    appliesTo JSON NOT NULL,
    createdAt timestamp default now(),
    policySize INT NOT NULL,
    organisation INT NOT Null,
    FOREIGN KEY (organisation) REFERENCES organisation(id)
);

CREATE TABLE userType (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userType varchar(160) not null,
    createdAt timestamp default now()
    -- organisation INT NOT Null,
    -- FOREIGN KEY (organisation) REFERENCES organisation(id)
);

    CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(160) not null,
    password varchar(255) not null,
    fname varchar(160) not null,
    lname varchar(160) not null,
    userType int not null,
    createdAt timestamp default now(),
    jobTitle varchar(160),
    organisation INT NOT Null,
    staffType INT NOT NULL,
    firstLogin boolean default true,
    FOREIGN KEY (organisation) REFERENCES organisation(id),
    FOREIGN KEY (userType) REFERENCES userType(id),
    FOREIGN KEY (staffType) REFERENCES staffTypes(id)
);

alter table users add constraint unique_email_organisation UNIQUE (email, organisation);

create table documentTypes (
    id INT primary Key AUTO_INCREMENT,
    organisation INT NOT Null,
    documentType varchar(250) not null
);


CREATE TABLE staffDocuments (
    id INT primary Key AUTO_INCREMENT, 
    documentNameName varchar(250) NOT NULL,
    documentLinkLink varchar(250) NOT NULL,
    documentDescription text NOT NULL,
    documentType INT not null,
    users INT NOT NULL,
    createdAt timestamp default now(),
    organisation INT NOT Null,
    readDocument boolean default false,
    documentSize Int not null,
    dateRead VARCHAR(250),
    FOREIGN KEY (organisation) REFERENCES organisation(id),
    FOREIGN KEY (documentType) REFERENCES documentTypes(id),
    FOREIGN KEY (users) REFERENCES users(id)
);

CREATE TABLE policiesRead (
    id INT primary Key AUTO_INCREMENT,
    policyRead INT NOT NULL,
    user INT NOT NULL,
    organisation INT NOT NULL,
    readAt timestamp default now(),
    FOREIGN KEY (organisation) REFERENCES organisation(id),
    FOREIGN KEY (policyRead) REFERENCES Policies(id),
    FOREIGN KEY (user) REFERENCES users(id)
);

CREATE TABLE packages (
    id INT primary Key AUTO_INCREMENT,
    packageName varchar(250) not null,
    usageAllowed decimal(6,2) not null,
    users int not null,
    monthly decimal(10,2) not null,
    annual  decimal(10,2) not null,
    createdAt timestamp default now()
);

CREATE TABLE enterprisePackages (
    id INT primary Key AUTO_INCREMENT,
    packageName varchar(250) not null,
    usageAllowed decimal(6,2) not null,
    users int not null,
    monthly decimal(10,2) not null,
    annual  decimal(10,2) not null,
    createdAt timestamp default now()
);

CREATE TABLE clientele (
    id INT primary Key AUTO_INCREMENT,
    organisation INT NOT NULL,
    package INT,
    enterprisePackage INT,
    monthly boolean default true,
    expiry timestamp,
    FOREIGN KEY (organisation) REFERENCES organisation(id),
    FOREIGN KEY (package) REFERENCES Packages(id),
    FOREIGN KEY (EnterprisePackage) REFERENCES EnterprisePackages(id)
);

CREATE TABLE colorScheme (
    id INT primary Key AUTO_INCREMENT,
    organisation INT NOT NULL UNIQUE,
    colorChosen varchar(150) NOT NULL
);

CREATE TABLE paymentsReceived (
    id INT primary Key AUTO_INCREMENT,
    organisation INT NOT NULL,
    pf_payment_id varchar(250) NOT NULL,
    payment_status varchar(250) NOT Null,
    package INT NOT NULL,
    amount_gross decimal(25,2) not null,
    amount_fee decimal(25,2) not null,
    amount_net decimal(25,2) not null,
    payDate timestamp
);


-- ###########################

INSERT INTO packages (packageName, usageAllowed, users, monthly, annual) values
("Introductory", 0.2, 3, 0, 0),
("Small", 25, 20, 299, 3200),
("Medium", 50, 50, 538, 5900),
("Large", 75, 100, 999, 10000),
("Larger", 100, 250, 1599, 15000),
("Silver", 125, 500, 2399, 24000),
("Gold", 225, 750, 2999, 30000),
("Platinum", 300, 1000, 3399, 34000);




INSERT INTO userType (userType) values
    ("Administrator"),
    ("Employee");

-- PUT THIS LATER ON organisation CREATE
-- INSERT INTO Clientele (organisation, package, expiry) values
-- (1, 1, now());

-- PUT THIS LATER ON organisation CREATE
INSERT INTO colorScheme (organisation, colorChosen ) values (
    1, "#142850"
);

-- #####################################


    s.id,s.documentNameName,s.documentLinkLink,s.documentDescription,s.documentType,s.users,s.createdAt,s.organisation,s.readDocument,s.documentSize, s.dateRead

-- INSERT INTO organisation (organisationName, email, address1, address2, address3, city, province, country, zipCode, contactNumber ) values
--                         ('Eccentric Toad', 'wayne@eccentricToad.com', '6 Parkside', '5 the Close', 'Tokai','Cape Town', 'WC', 'South Africa', '7945', '0740628742' );



-- INSERT INTO StaffTypes (organisation, Staff_description) values
--     (1,"All Staff"),
--     (1,"Management"),
--     (1,"Admin"),
--     (1,"Finance"),
--     (1,"Security"),
--     (1,"Maintenance"),
--     (1,"Reception");


--     CREATE TABLE users (
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     email VARCHAR(160) not null UNIQUE,
--     password varchar(255) not null,
--     fname varchar(160) not null,*
--     lname varchar(160) not null,*
--     userType int not null,*
--     createdAt timestamp default now(),
--     organisation INT NOT Null,*
--     staffType INT NOT NULL, * 2
--     FOREIGN KEY (organisation) REFERENCES organisation(id),
--     FOREIGN KEY (userType) REFERENCES userType(id)
--     FOREIGN KEY (staffType) REFERENCES staffType(id)
-- );



INSERT into users (organisation, fname, lname, email, password, staffType, userType) values
    ( 1,  'Ethel'   ,   'Ernser'    ,    'Zoey_Veum9@yahoo.com'     ,2),
    (  1, 'Judd'    ,   'Gibson'    ,  'Gunnar.Graham@hotmail.com'  ,3),
    (  1, 'Zack'    , 'Runolfsson'  ,    'Makenzie43@gmail.com'     ,4),
    ( 1, 'Jovani'   ,  'VonRueden'  ,    'Makenzie70@yahoo.com'     ,5),
    ( 1,  'Leta'    ,   'Hermann'   ,  'Dominique.Crona@yahoo.com'  ,6),
    ( 1, 'Adelia'   , 'Cruickshank' ,   'Ora_McDermott@yahoo.com'   ,7),
    ( 1, 'Nathaniel' ,   'Schuppe'   ,  'Nadia.Wunsch34@yahoo.com'   ,2),
    ( 1,  'Armando'  ,  'Wilkinson'  ,     'Ethelyn43@gmail.com'     ,3),
    ( 1,  'Ryan'    ,    'Ferry'    , 'Sibyl.Jacobson41@yahoo.com'  ,4),
    (  1,  'Lew'    ,    'Kling'    ,     'Helmer70@yahoo.com'      ,5),
    ( 1, 'Theodore'  , 'Runolfsson'  ,    'Florine28@hotmail.com'    ,6),
    ( 1,  'Casimir'  ,  'Shanahan'   ,     'Malvina37@yahoo.com'     ,7),
    ( 1,  'Jean'    ,    'Lesch'    ,   'Ahmed_Jacobi@gmail.com'    ,2),
    ( 1, 'Kaelyn'   ,   'Larkin'    ,   'Bill.Cremin@hotmail.com'   ,3),
    ( 1, 'Abraham'  ,   'Keeling'   ,      'Ocie57@gmail.com'       ,4),
    ( 1,  'Dorthy'   , 'McCullough'  ,  'Beulah.Kovacek@gmail.com'   ,5),
    ( 1,  'Fleta'   ,   'Zemlak'    ,   'Margarita52@hotmail.com'   ,6),
    ( 1,   'Blair'   ,   'Hammes'    ,    'Angeline78@gmail.com'     ,7),
    ( 1,  'Lyla'    ,    'Kuhic'    ,    'Filomena16@yahoo.com'     ,2),
    ( 1,  'Meta'    ,  'Johnston'   ,     'Petra39@hotmail.com'     ,3),
    ( 1,  'Elta'    ,    'Mohr'     , 'Chris_Rodriguez92@yahoo.com',4);

-- #######################

DROP DATABASE PerfectStaff;

-- ##########################

select * from StaffTypes;
select * from Policies;
select * from employees;