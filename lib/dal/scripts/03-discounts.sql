IF NOT EXISTS (SELECT * FROM discounts WHERE code = 'S0')
BEGIN
  INSERT INTO discounts
  (code, fromSum, title, uid)
  VALUES('S0', 0, 'Розница', 'd6622c6c-81a3-4ccb-8728-d9dbcba41b94');
END

IF NOT EXISTS (SELECT * FROM discounts WHERE code = 'S30K')
BEGIN
  INSERT INTO discounts
  (code, fromSum, title, uid)
  VALUES('S30K', 30000, 'Опт', '255d1535-5a50-4234-bb0e-df8ef508c5f7');
END

IF NOT EXISTS (SELECT * FROM discounts WHERE code = 'S100K')
BEGIN
  INSERT INTO discounts
  (code, fromSum, title, uid)
  VALUES('S100K', 100000, 'Спец. цена', '0bd679f9-22c2-4070-99c5-2ab2f4552d94');
END
