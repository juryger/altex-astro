/* 1 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'AB')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('AB', 'Бронза', '2613c52a-364a-4dbf-8de0-67a35c8b7751');
END

/* 2 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'AC')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('AC', 'Медь', 'd266524d-98d4-41f0-a02b-8f0efcd5db74');
END

/* 3 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'CP')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('CP', 'Хром', '745a0a05-72f3-4f43-91fa-0b68f2e0fb46');
END

/* 4 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'PB')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('PB', 'Латунь', '88facc0e-c816-4745-8c48-c8240366033d');
END

/* 5 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'SN')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('SN', 'Матовый хром', 'e7858503-6b1a-46fd-906c-c7bed9febccf');
END

/* 6 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'WW')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('WW', 'Белый', '4be432b7-bc52-48c3-aeb3-3711f692601d');
END

/* 7 */
IF NOT EXISTS (SELECT * FROM colors WHERE code = 'BB')
BEGIN
  INSERT INTO colors
  (code, title, uid)
  VALUES('BB', 'Черный', '901ecf27-bee1-439b-8575-e8fbfdf1c336');
END
