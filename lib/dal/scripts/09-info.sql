INSERT INTO info (name, value)
SELECT 'BankName', 'ПАО Сбербанк'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankName');

INSERT INTO info (name, value)
SELECT 'BankAccount', '40802810022240099897'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankAccount');

INSERT INTO info (name, value)
SELECT 'BankIndentityCode', '042908612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankIndentityCode');

INSERT INTO info (name, value)
SELECT 'BankCorrAccount', '30101810100000000612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'BankCorrAccount');

INSERT INTO info (name, value)
SELECT 'TaxNumber', '402700153568'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxNumber');

INSERT INTO info (name, value)
SELECT 'TaxRegoReasonCode', '30101810100000000612'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxTaxRegoReasonCode');

INSERT INTO info (name, value)
SELECT 'TaxLicense', 'Свидетельство 40 № 000999515 от 20.03.1997 г.'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'TaxLicense');

INSERT INTO info (name, value)
SELECT 'Name', 'ИП Герасимов Алексей Владимирович'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'Name');

INSERT INTO info (name, value)
SELECT 'PostCode', '248000'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'PostCode');

INSERT INTO info (name, value)
SELECT 'City', 'Калуга'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'City');

INSERT INTO info (name, value)
SELECT 'StreetAddress', 'ул. Первомайская 18-7'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'StreetAddress');

INSERT INTO info (name, value)
SELECT 'PhoneNumber', '+7(910)911-3877'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'PhoneNumber');

INSERT INTO info (name, value)
SELECT 'ContactEmail', 'alextechnologies@gmail.com'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'ContactEmail');

INSERT INTO info (name, value)
SELECT 'AdminEmail', 'juryger@gmail.com'
WHERE NOT EXISTS (SELECT * FROM info WHERE name = 'AdminEmail');
