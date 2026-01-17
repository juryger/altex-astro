IF NOT EXISTS (SELECT * FROM makers WHERE code = 'CHEBMETAPLAN')
BEGIN
  INSERT INTO makers
  (code, title, uid)
  VALUES('CHMLPL', 'Чебоксарский металлургический завод', '7dc04f8b-5c50-4bc9-8a6b-931b45972551');
END

IF NOT EXISTS (SELECT * FROM makers WHERE code = 'MLRG')
BEGIN
  INSERT INTO makers
  (code, title, uid)
  VALUES('METAL', 'Металлург', 'b7fd7fe2-1416-4f99-b043-f91607a9c2fe');
END