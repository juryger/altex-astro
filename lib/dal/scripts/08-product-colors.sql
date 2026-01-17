IF NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 1)
BEGIN
  /* 1. Цвета: хром/зол/медь */
  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(1, 3, '61719448-5289-48d3-a4da-e26b65392377');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(1, 1, 'a801e822-c7f0-4da4-80a5-086330414a03');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(1, 2, 'dbc1dbb8-dc68-420f-b29f-d159ee82fa22');
END

IF NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 2)
BEGIN
  /* 2. Цвета: AC/AB/CP/PB */
  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(2, 2, '68884329-01b1-4304-bed5-87e1c6296b8b');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(2, 1, '97fe149a-1977-40fe-9720-023608787658');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(2, 4, '18bf9ea3-08d3-461c-b65b-7c9dcff70df6');
END

IF NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3)
BEGIN
  /* 3. Цвета: ALL */
  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 1, 'cb5c70cc-5f11-4b3f-af11-0f1ea48a1cea');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 2, '0420a31a-f205-4689-b242-86ddb0c7cb52');  

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 3, '147baea7-a32b-486c-99b1-5270ca72f6c2');

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 4, '067c6c6b-0afd-45ea-a082-00c67c70e96f');

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 5, 'fd7fe2cf-147f-4897-b2c2-11508d4c8afe');

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 6, '54da4276-53a8-4d45-8cd0-32f52e47cf4f');

  INSERT INTO product_colors (product_id, color_id, uid)
  VALUES(3, 7, '0e306d35-ac5a-4f43-a4bc-b227f264ae62');
END