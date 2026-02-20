INSERT INTO info (name, value)
SELECT 'BankName', 'ПАО Сбербанк'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankName');

INSERT INTO info (name, value)
SELECT 'BankAccount', '40802810022240099897'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankAccount');

INSERT INTO info (name, value)
SELECT 'BankBIK', '042908612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankBIK');

INSERT INTO info (name, value)
SELECT 'BankKS', '30101810100000000612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankKS');

INSERT INTO info (name, value)
SELECT 'TaxNumber', '402700153568'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxNumber');

INSERT INTO info (name, value)
SELECT 'TaxKPP', '30101810100000000612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxKPP');

INSERT INTO info (name, value)
SELECT 'TaxLicense', 'Свидетельство 40 № 000999515 от 20.03.1997 г.'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxLicense');

INSERT INTO info (name, value)
SELECT 'CompanyName', 'ИП Герасимов Алексей Владимирович'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyName');

INSERT INTO info (name, value)
SELECT 'CompanyPostCode', '248000'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyPostCode');

INSERT INTO info (name, value)
SELECT 'CompanyCity', 'Калуга'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyCity');

INSERT INTO info (name, value)
SELECT 'CompanyAddress', 'ул. Первомайская 18-7'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyAddress');

INSERT INTO info (name, value)
SELECT 'CompanyPhone', '+7(910)911-3877'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyPhone');

INSERT INTO info (name, value)
SELECT 'CompanyEmail', 'alextechnologies@gmail.com'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'CompanyEmail');

INSERT INTO info (name, value)
SELECT 'AdminEmail', 'juryger@gmail.com'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'AdminEmail');
