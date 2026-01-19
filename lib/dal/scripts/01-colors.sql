-- 1 
INSERT INTO colors
(code, title, uid)
SELECT 'AB', 'Бронза', '2613c52a-364a-4dbf-8de0-67a35c8b7751'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'AB');

-- 2
INSERT INTO colors
(code, title, uid)
SELECT 'AC', 'Медь', 'd266524d-98d4-41f0-a02b-8f0efcd5db74'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'AC');

-- 3
INSERT INTO colors
(code, title, uid)
SELECT 'CP', 'Хром', '745a0a05-72f3-4f43-91fa-0b68f2e0fb46'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'CP');

-- 4
INSERT INTO colors
(code, title, uid)
SELECT 'PB', 'Латунь', '88facc0e-c816-4745-8c48-c8240366033d'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'PB');

-- 5
INSERT INTO colors
(code, title, uid)
SELECT 'SN', 'Матовый хром', 'e7858503-6b1a-46fd-906c-c7bed9febccf'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'SN');

-- 6
INSERT INTO colors
(code, title, uid)
SELECT 'WW', 'Белый', '4be432b7-bc52-48c3-aeb3-3711f692601d'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'WW');

-- 7
INSERT INTO colors
(code, title, uid)
SELECT 'BB', 'Черный', '901ecf27-bee1-439b-8575-e8fbfdf1c336'
WHERE NOT EXISTS (SELECT * FROM colors WHERE code = 'BB');
