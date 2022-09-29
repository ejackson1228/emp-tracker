INSERT INTO departments (department_name)
VALUES
('Finance'),
('Logistics'),
('Engineering')
;

INSERT INTO roles (id, title, salary, department_id)
VALUES
(1, 'Manager', 90000, 1),
(2, 'Analyst', 50000, 1),
(3, 'Manager', 75000, 2),
(4, 'Planner', 45000, 2),
(5, 'Manager', 120000, 3),
(6, 'Engineer', 80000, 3)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Craig', 'Benoit', 1, NULL),
('Derek', 'Sharp', 2, 1),
('Selene', 'Altador', 2, 1),
('Carol', 'Schmidt', 2, 1),
('Ryan', 'Trimes', 3, NULL),
('Jessica', 'Florentino', 3, NULL),
('Lynn', 'Speck', 4, 5),
('Brian', 'Frow', 4, 5),
('Terry', 'Glass', 4, 6),
('Heather', 'Weston', 4, 6),
('Remy', 'Indira', 5, NULL),
('Natalie', 'Jackson', 5, NULL),
('Elliot', 'Thalmer', 6, 11),
('Tyler', 'Escot', 6, 11),
('Ashura', 'Namikaze', 6, 12),
('Indra', 'Namikaze', 6, 12),
('Floyd', 'Respin', 6, 12)
;