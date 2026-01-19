INSERT INTO make_countries
(code, title, uid)
SELECT 'RUS', 'Россия', '49e89d16-2b7c-45c7-b23a-8569732624ab'
WHERE NOT EXISTS (SELECT * FROM make_countries WHERE code = 'RUS');

INSERT INTO make_countries
(code, title, uid)
SELECT 'PLN', 'Польша', '06fa382f-5ab9-427b-a35d-97c413ad52dc'
WHERE NOT EXISTS (SELECT * FROM make_countries WHERE code = 'PLN');

INSERT INTO make_countries
(code, title, uid)
SELECT 'BEL', 'Беларусь', 'c13e101c-3356-404d-af21-b656a1373e27'
WHERE NOT EXISTS (SELECT * FROM make_countries WHERE code = 'BEL');

INSERT INTO make_countries
(code, title, uid)
SELECT 'CHN', 'Китай', 'f9a3a213-6ff8-465f-ba2c-1bfa569484a7'
WHERE NOT EXISTS (SELECT * FROM make_countries WHERE code = 'CHN');

INSERT INTO make_countries
(code, title, uid)
SELECT 'IND', 'Индия', '2ece1baf-0628-49e6-a6d1-8e53405585cf'
WHERE NOT EXISTS (SELECT * FROM make_countries WHERE code = 'IND');
