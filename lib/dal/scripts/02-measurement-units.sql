IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'PC')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('PC', 'шт', '88c52bc5-0678-4873-afd6-dc65879b1a58');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'BX')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('BX', 'кор.', '524e3f0c-f337-4a44-9991-f33cd00f263f');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'PK')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('PK', 'уп.', '928f83c5-0499-4ec6-b1e1-98ba731d2da6');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'TN')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('TN', 'т', '90e63862-7cb0-4dc6-a420-14fbb9be5eec');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'KG')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('KG', 'кг', '89f31cd2-7798-43f7-bfa8-38b1c0c1558d');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'GR')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('GR', 'гр', 'c5656fc8-17f1-41cf-9337-f37e2721303b');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'LT')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('LT', 'л', '78e5a388-252e-4444-8393-75b9d1e5b4a8');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MT')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('MT', 'м', 'b344fcd8-25ae-4ad1-a1c1-9af928f086cc');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MS')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('MS', 'м2', 'eedb6bce-1be0-4253-bd50-e9d0a4a9f98a');
END

IF NOT EXISTS (SELECT * FROM measurement_units WHERE code = 'MQ')
BEGIN
  INSERT INTO measurement_units
  (code, title, uid)
  VALUES('MQ', 'м3', '5a392f42-17fc-469d-a123-1f9e45dce214');
END
