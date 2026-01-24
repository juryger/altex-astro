INSERT INTO discounts
(code, fromSum, title, uid)
SELECT 'S0', 1, 'Розница', 'd6622c6c-81a3-4ccb-8728-d9dbcba41b94'
WHERE NOT EXISTS (SELECT * FROM discounts WHERE code = 'S0');

INSERT INTO discounts
(code, fromSum, title, uid)
SELECT 'S30K', 30000, 'Опт', '255d1535-5a50-4234-bb0e-df8ef508c5f7'
WHERE NOT EXISTS (SELECT * FROM discounts WHERE code = 'S30K');

INSERT INTO discounts
(code, fromSum, title, uid)
SELECT 'S100K', 100000, 'Спец. цена', '0bd679f9-22c2-4070-99c5-2ab2f4552d94'
WHERE NOT EXISTS (SELECT * FROM discounts WHERE code = 'S100K');
