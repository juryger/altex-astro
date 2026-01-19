INSERT INTO measurement_units
(code, title, uid)
SELECT 'PC', 'шт', '88c52bc5-0678-4873-afd6-dc65879b1a58'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'PC');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'BX', 'кор.', '524e3f0c-f337-4a44-9991-f33cd00f263f'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'BX');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'PK', 'уп.', '928f83c5-0499-4ec6-b1e1-98ba731d2da6'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'PK');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'TN', 'т', '90e63862-7cb0-4dc6-a420-14fbb9be5eec'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'TN');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'KG', 'кг', '89f31cd2-7798-43f7-bfa8-38b1c0c1558d'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'KG');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'GR', 'гр', 'c5656fc8-17f1-41cf-9337-f37e2721303b'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'GR');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'LT', 'л', '78e5a388-252e-4444-8393-75b9d1e5b4a8'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'LT');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'MT', 'м', 'b344fcd8-25ae-4ad1-a1c1-9af928f086cc'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MT');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'MS', 'м2', 'eedb6bce-1be0-4253-bd50-e9d0a4a9f98a'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MS');

INSERT INTO measurement_units
(code, title, uid)
SELECT 'MQ', 'м3', '5a392f42-17fc-469d-a123-1f9e45dce214'
WHERE NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MQ');
