IF NOT EXISTS (SELECT * FROM make_countries WHERE code = 'RUS')
BEGIN
  INSERT INTO make_countries
  (code, title, uid)
  VALUES('RUS', 'Россия', '49e89d16-2b7c-45c7-b23a-8569732624ab');
END

IF NOT EXISTS (SELECT * FROM make_countries WHERE code = 'PLN')
BEGIN
  INSERT INTO make_countries
  (code, title, uid)
  VALUES('PLN', 'Польша', '06fa382f-5ab9-427b-a35d-97c413ad52dc');
END

IF NOT EXISTS (SELECT * FROM make_countries WHERE code = 'BEL')
BEGIN
  INSERT INTO make_countries
  (code, title, uid)
  VALUES('BLR', 'Беларусь', 'c13e101c-3356-404d-af21-b656a1373e27');
END

IF NOT EXISTS (SELECT * FROM make_countries WHERE code = 'CHN')
BEGIN
  INSERT INTO make_countries
  (code, title, uid)
  VALUES('CHN', 'Китай', 'f9a3a213-6ff8-465f-ba2c-1bfa569484a7');
END

IF NOT EXISTS (SELECT * FROM make_countries WHERE code = 'IND')
BEGIN
  INSERT INTO make_countries
  (code, title, uid)
  VALUES('IND', 'Индия', '2ece1baf-0628-49e6-a6d1-8e53405585cf');
END
