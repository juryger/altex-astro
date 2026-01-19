INSERT INTO makers
(code, title, uid)
SELECT 'CHEBMETAPLAN', 'Чебоксарский металлургический завод', '7dc04f8b-5c50-4bc9-8a6b-931b45972551'
WHERE NOT EXISTS (SELECT * FROM makers WHERE code = 'CHEBMETAPLAN');

INSERT INTO makers
(code, title, uid)
SELECT 'METACHEL', 'Металлург Челябинск', 'b7fd7fe2-1416-4f99-b043-f91607a9c2fe'
WHERE NOT EXISTS (SELECT * FROM makers WHERE code = 'METACHEL');
