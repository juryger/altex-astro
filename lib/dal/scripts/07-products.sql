/* 1. VESHALKA NA POLKE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'VESHNAPLAN3KRUCSERINATA', 'CHOZ-1', 6, 'Вешалка на планке 3 крючка серия Наташа', NULL, 2, 3, 3, 120.01, 115, 110.11, 1, 2, 1, 'fab7dd52-b231-4ed0-b81e-c908a77b34f5'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'VESHNAPLAN3KRUCSERINATA');

/* 2. VESHALKA NA PLANKE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, make_country_id, has_image, uid)
SELECT 'VESHNAPLAN4KRUCSERINATA', 'CHOZ-2', 6, 'Вешалка на планке 4 крючка серия Наташа', NULL, 3, 6, 6, 125.42, 118, 111.33, 3, 1, '87da923c-da7e-465e-8a97-6eaad396db6e'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'VESHNAPLAN4KRUCSERINATA');

/* 3. ZAMOK FERRE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'ZAMOFERR1323MEJO', 'ZAMO-1', 8, 'Замок FERRE 1323 межос 80 мм', NULL, 1, 80, 1, 1, 120.01, 115, 110.11, 1, 1, 1, 'f0eced48-627b-49d4-8cc6-f2a90452c9a8'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'ZAMOFERR1323MEJO');

/* 4. ZAMOK APEKS */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'ZAMOAPEKPD38PERFOKLUC', 'ZAMO-2', 9, 'Замок АПЕКС PD-38 перфо-ключ', NULL, 1, 1, 1, 20.13, 15, 10.07, 2, 2, 1, '6416c021-2212-488b-90aa-edaa174258e0'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'ZAMOAPEKPD38PERFOKLUC');

/* 5. ZAMOK FERRE 100мм */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'ZAMOFERR1325MEJO', 'ZAMO-3', 8, 'Замок FERRE 1325 межос 100 мм', NULL, 1, 100, 78, 12, 1, 1, 123.02, 117.09, 111.12, 1, 1, 0, 'fbeced41-627a-49d4-8cc6-f2a90452c9a1'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'ZAMOFERR1325MEJO');

/* 7. 
  Личинка 6 кл 80 мм ключ-поворот. 
  Price: 202.5 / 175.5 
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH6KL80MMKLUCPOVO', 'LICH-1', 24, 'Личинка 6 кл 80 мм ключ-поворот', NULL, 1, 80, NULL, NULL, 12, 12, 202.5, 175.5, 167.11, NULL, 1, 0, '58553907-b03f-4671-99d2-4c1a3016e5f2'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH6KL80MMKLUCPOVO');

/* 8. 
  Личинка 6 кл 80 мм ключ-ключ
  Price: 180 / 156
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH6KL80MMKLUCKLUC', 'LICH-2', 24, 'Личинка 6 кл 80 мм ключ-ключ', NULL, 1, 80, NULL, NULL, 12, 12, 180, 156, 141.01, NULL, 4, 0, '757ae789-fd05-41ed-a03d-93634028f715'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH6KL80MMKLUCKLUC');

/* 9. 
  Личинка 6 кл 90 мм ключ-ключ 
  Price: 195 / 169 
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH6KL90MMKLUCKLUC', 'LICH-3', 24, 'Личинка 6 кл 90 мм ключ-ключ', NULL, 1, 90, NULL, NULL, 12, 12, 195, 169, 161, NULL, 3, 0, 'e8289634-ab95-4d43-86b7-0bfcec2d29f0'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH6KL90MMKLUCKLUC');

/* 10. 
  Личинка 6 кл 90 мм ключ-поворот 
  Price: 217.5 / 188.5 
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH6KL90MMKLUCPOVO', 'LICH-4', 24, 'Личинка 6 кл 90 мм ключ-поворот', NULL, 1, 90, NULL, NULL, 12, 12, 217.5, 188.5, 173.4, NULL, 1, 0, '7927d818-c9fb-4adc-b118-7004aa14ac71'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH6KL90MMKLUCPOVO');

/* 11. 
  Личинка 60 мм кл\кл перфо FURBAT 
  Price: 247.5 / 214.5 
  Pack: 12/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH60MMKLKLPERFFURB', 'LICH-5', 24, 'Личинка 60 мм кл\кл перфо FURBAT', NULL, 1, 60, NULL, NULL, 12, 1, 247.5, 214.5, 201.5, NULL, 2, 0, '9ea14a9b-e137-44e6-8dbb-51773a332898'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH60MMKLKLPERFFURB');

/* 12. 
  Личинка 60 мм Перф Ключ-Ключ
  Price: 150 / 130 
  Pack: 12/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH60MMPERFKLUCKLUC', 'LICH-6', 24, 'Личинка 60 мм Перф Ключ-Ключ', NULL, 1, 80, NULL, NULL, 12, 12, 202.5, 175.5, 167.11, NULL, 1, 0, 'a47305db-3262-4cd0-a706-5514a7f60f97'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH60MMPERFKLUCKLUC');

/* 13. 
  Личинка 70 мм ключ-ключ для замка ВАЗ
  Price: 157.5 / 136.5 
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH70MMKLUCKLUCDLYAZAMKVAZ', 'LICH-7', 24, 'Личинка 70 мм ключ-ключ для замка ВАЗ', NULL, 1, 70, NULL, NULL, 12, 12, 157.5, 136.5, 127.5, NULL, 1, 0, 'c34b1c50-8ba2-47fb-98fc-a299aa2e426f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH70MMKLUCKLUCDLYAZAMKVAZ');

/* 14. 
  Личинка 70 мм кл\.пов перфо FURBAT
  Price: 307.5 / 266.5 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH70MMKLPOVPERFBURB', 'LICH-8', 24, 'Личинка 70 мм кл\.пов перфо FURBAT', NULL, 1, 70, NULL, NULL, 12, 1, 307.5, 266.5, 251.3, NULL, 1, 0, 'bdc2d6ae-afd5-4ba0-aced-26bec4474a80'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH70MMKLPOVPERFBURB');

/* 15.
  Личинка 80 мм кл\пов. перфо FURBAT
  Price: 412.5 / 357.5 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH80MMKLPOVPERFFURB', 'LICH-9', 24, 'Личинка 80 мм кл\пов. перфо FURBAT', NULL, 1, 80, NULL, NULL, 12, 1, 412.5, 357.5, 346.03, NULL, 1, 0, '553205c5-f1f1-4305-9ba6-cb0b6210fd5c'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH80MMKLPOVPERFFURB');

/* 16. 
  Личинка 90 мм кл\пов перфо FURBAT
  Price: 450 / 390 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH90MMKLPOVPERFFURBA', 'LICH-10', 24, 'Личинка 90 мм кл\пов перфо FURBAT', NULL, 1, 90, NULL, NULL, 12, 12, 450, 390, 370, NULL, 1, 0, '29fec28b-e353-4b75-b7b8-bd3d05154663'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH90MMKLPOVPERFFURBA');

/* 17. 
  Личинка 90 мм кл\кл перфо FURBAТ
  Price: 397.5 / 344.5 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH90MMKLKLPERFFURB', 'LICH-11', 24, 'Личинка 90 мм кл\кл перфо FURBAТ', NULL, 1, 90, NULL, NULL, 12, 1, 397.5, 344.5, 330.3, NULL, 1, 0, 'a005a7f0-6648-4c41-b0cc-4eef1e631b2d'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH90MMKLKLPERFFURB');

/* 18.
  Личинка MCM Перфо 55\40 мм кл-кл
  Price: 885 / 767
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCMPERF5540MMKLKL', 'LICH-12', 24, 'Личинка MCM Перфо 55\40 мм кл-кл', NULL, 1, 95, NULL, NULL, 6, 1, 885, 767, 742, NULL, 1, 0, '0e4d7a18-c979-439f-adb1-0fae4a344364'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCMPERF5540MMKLKL');

/* 19. 
  Личинка MCM 30\40 мм кл-верт
  Price: 870 / 754
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM3040MMKLVERT', 'LICH-13', 24, 'Личинка MCM 30\40 мм кл-верт', NULL, 1, 70, NULL, NULL, 6, 1, 870, 754, 737, NULL, 1, 0, '14280b41-8324-4a49-baab-c14764e45ea2'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM3040MMKLVERT');

/* 20. 
  Личинка MCM 45/35 мм кл-верт
  Price: 909 / 787.8 
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM4535MMKLVERT', 'LICH-14', 24, 'Личинка MCM 45/35 мм кл-верт', NULL, 1, 80, NULL, NULL, 6, 1, 909, 787.8, 775.9, NULL, 3, 0, 'ac701f53-51fd-4562-8063-d2bf1a740bcf'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM4535MMKLVERT');

/* 21. 
  Личинка для замка FAIN
  Price: 210 / 182
  Pack: 12/12 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHDLYAZAMKFAIN', 'LICH-15', 24, 'Личинка для замка FAIN', NULL, 1, NULL, NULL, NULL, 12, 12, 210, 182, 177.32, NULL, 1, 0, 'd22e852d-3f3f-41d1-9a0c-f1bda2f3eb60'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHDLYAZAMKFAIN');

/* 22. 
  Личинка ЗВ1-2(70мм) врезн Зенит
  Price: 181.5 / 157.3 
  Pack: 10/10
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH3B1270MMVREZZENI', 'LICH-16', 24, 'Личинка ЗВ1-2(70мм) врезн Зенит', NULL, 1, 70, NULL, NULL, 10, 10, 181.5, 157.3, 143.76, NULL, 2, 0, '89a314ea-2a0b-44c1-b7a8-67d2deb54a04'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH3B1270MMVREZZENI');

/* 23. 
  Личинка КЭМЗ М1
  Price: 367.5 / 318.5 
  Pack: 20/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHKEMZM1', 'LICH-17', 24, 'Личинка КЭМЗ М1', NULL, 1, NULL, NULL, NULL, 20, 1, 367.5, 318.5, 314.07, NULL, 1, 0, 'a759ad0f-59ca-4641-b4e1-28dd8b74cadb'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHKEMZM1');

/* 24. 
  Личинка КЭМЗ М2
  Price: 360 / 312 
  Pack: 20/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHKEMZM2', 'LICH-18', 24, 'Личинка КЭМЗ М2', NULL, 1, 80, NULL, NULL, 20, 1, 360, 312, 310, NULL, 1, 0, '8edcffeb-2219-4a50-b210-a09d5764f872'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHKEMZM2');

/* 25. 
  Личинка МСМ 50\40 мм кл-кл
  Price: 870 / 754
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM5040MMKLKL', 'LICH-19', 24, 'Личинка МСМ 50\40 мм кл-кл', NULL, 1, 90, NULL, NULL, 6, 1, 870, 754, 730, NULL, 1, 0, '23802b42-7c05-4183-862e-d787f132549d'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM5040MMKLKL');

/* 26. 
  Личинка МСМ 55\45 мм кл-кл
  Price: 930 / 806
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM5545MMKLKL', 'LICH-20', 24, 'Личинка МСМ 55\45 мм кл-кл', NULL, 1, 100, NULL, NULL, 6, 1, 930, 806, 804.41, NULL, 1, 0, '6c5617c0-1f53-43da-bedb-3e0695151b30'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM5545MMKLKL');

/* 27. 
  Личинка МСМ 60 мм ключ-верт.
  Price: 780 / 676 
  Pack: 12/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM60MMKLUCVERT', 'LICH-21', 24, 'Личинка МСМ 60 мм ключ-верт.', NULL, 1, 60, NULL, NULL, 12, 1, 780, 676, 652.11, NULL, 1, 0, 'ae3495ed-4034-4cde-ab5a-1da49539f7c1'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM60MMKLUCVERT');

/* 28. 
  Личинка МСМ 90 мм ключ-верт.
  Price: 967.5 / 838.5 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM90MMKLUCVERT', 'LICH-22', 24, 'Личинка МСМ 90 мм ключ-верт.', NULL, 1, 90, NULL, NULL, 12, 1, 967.5, 838.5, 831.11, NULL, 1, 0, '9c2ce392-5168-4de0-a604-5d26c9e2b95d'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM90MMKLUCVERT');

/* 29. 
  Личинка МСМ 100 мм ключ-верт
  Price: 1065 / 923
  Pack: 12/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM100MMKLUCVERT', 'LICH-23', 24, 'Личинка МСМ 100 мм ключ-верт', NULL, 1, 100, NULL, NULL, 12, 1, 1065, 923, 897, NULL, 1, 0, '2dfc3565-a659-47bb-bdc6-9468ee33ea70'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM100MMKLUCVERT');

/* 30. 
  Личинка МСМ 100 мм ключ-ключ
  Price: 930 / 806 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM100MMKLUCKLUC', 'LICH-24', 24, 'Личинка МСМ 100 мм ключ-ключ', NULL, 1, 100, NULL, NULL, 12, 1, 930, 806, 801.4, NULL, 1, 0, '205f65b1-bc99-421b-8497-eadb9ee50591'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM100MMKLUCKLUC');

/* 31. 
  Личинка МСМ 120 мм ключ-верт
  Price: 1101 / 954.2 
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM120MMKLUCVERT', 'LICH-25', 24, 'Личинка МСМ 120 мм ключ-верт', NULL, 1, 120, NULL, NULL, 6, 1, 1101, 954.2, 943.41, NULL, 1, 0, '90a00498-85b1-4a6a-8f3e-2e01977a1351'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM120MMKLUCVERT');

/* 32. Личинка МСМ 120 мм ключ-ключ
  Price: 979.5 / 848.9 
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM120MMKLUCKLUC', 'LICH-26', 24, 'Личинка МСМ 120 мм ключ-ключ', NULL, 1, 120, NULL, NULL, 6, 1, 979.5, 848.9, 834.42, NULL, 1, 0, '0ef2bf64-833b-4fac-b830-a8a0d69dea8c'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM120MMKLUCKLUC');

/* 33. 
  Личинка МСМ 35/55 мм кл-верт
  Price: 967.5 / 838.5 
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM3555MMKLVERT', 'LICH-27', 24, 'Личинка МСМ 35/55 мм кл-верт', NULL, 1, 90, NULL, NULL, 6, 1, 967.5, 838.5, 832.01, NULL, 1, 0, '482d73e5-7572-4b12-ac6c-76cfaafaa57f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM3555MMKLVERT');

/* 34. 
  Личинка МСМ 35\65 мм кл-верт
  Price: 1065 / 923
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM3565MMKLVERT', 'LICH-28', 24, 'Личинка МСМ 35\65 мм кл-верт', NULL, 1, 100, NULL, NULL, 6, 1, 1065, 923, 911, NULL, 1, 0, '51d583d3-08ea-4d5d-998d-12ed7dd71519'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM3565MMKLVERT');

/* 35. 
  Личинка МСМ 40/30 мм кл-пов
  Price: 870 / 754
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM4030MMKLPOV', 'LICH-29', 24, 'Личинка МСМ 40/30 мм кл-пов', NULL, 1, 70, NULL, NULL, 6, 1, 870, 754, 745, NULL, 1, 0, '7fc21f47-e00f-4505-8f66-191da9ec7c5f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM4030MMKLPOV');

/* 36. 
  Личинка МСМ 40\30 мм кл-кл
  Price: 720 / 624
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM4030MMKLKL', 'LICH-30', 24, 'Личинка МСМ 40\30 мм кл-кл', NULL, 1, 70, NULL, NULL, 12, 1, 720, 624, 613, NULL, 1, 0, '3db2a083-2640-49dc-b7cc-c6a3e78c7fed'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM4030MMKLKL');

/* 37. 
  Личинка МСМ 40\50 мм кл-верт
  Price: 967.5 / 838.5 
  Pack: 6/1 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM4050MMKLVERT', 'LICH-31', 24, 'Личинка МСМ 40\50 мм кл-верт', NULL, 1, 90, NULL, NULL, 6, 1, 967.5, 838.5, 826.39, NULL, 1, 0, '9d14702e-075a-42cf-8293-3ea6e79cfe69'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM4050MMKLVERT');

/* 38. 
  Личинка МСМ 45\35 мм кл- кл
  Price: 795 / 689
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM4535MMKLKL', 'LICH-32', 24, 'Личинка МСМ 45\35 мм кл- кл', NULL, 1, 80, NULL, NULL, 6, 1, 795, 689, 679.23, NULL, 1, 0, 'd3fdbc15-c585-4e98-a549-88c5ba6f149f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM4535MMKLKL');

/* 39. 
  Личинка МСМ 50\60 мм кл-верт
  Price: 1080 / 936
  Pack: 6/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM5060MMKLVERT', 'LICH-33', 24, 'Личинка МСМ 50\60 мм кл-верт', NULL, 1, 110, NULL, NULL, 6, 1, 1080, 936, 927, NULL, 1, 0, 'f061eac5-b3fd-4233-8fb5-16ad25fcc71d'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM5060MMKLVERT');

/* 40. 
  Личинка МСМ 60 мм ключ-ключ
  Price: 652.5 / 565.5 
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM60MMKLUCKLUC', 'LICH-34', 24, 'Личинка МСМ 60 мм ключ-ключ', NULL, 1, 60, NULL, NULL, 12, 1, 652.5, 565.5, 541.11, NULL, 1, 0, '9add49ec-c64f-46f4-b3f6-faee97b4a0cf'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM60MMKLUCKLUC');

/* 41. 
  Личинка МСМ 70 мм ключ-ключ
  Price: 747 / 647.4
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM70MMKLUCKLUC', 'LICH-35', 24, 'Личинка МСМ 70 мм ключ-ключ', NULL, 1, 70, NULL, NULL, 12, 1, 747, 647.4, 638.31, NULL, 1, 0, 'bf80f54c-b514-4385-a2b2-e38dcce95be7'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM70MMKLUCKLUC');

/* 42. 
  Личинка МСМ 80 мм ключ-верт.
  Price: 909 / 787.8
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICHMCM80MMKLUCVERT', 'LICH-36', 24, 'Личинка МСМ 80 мм ключ-верт.', NULL, 1, 80, NULL, NULL, 12, 1, 909, 787.8, 783.42, NULL, 1, 0, '7bb7840c-1725-46a5-96e0-05192cbf8d92'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICHMCM80MMKLUCVERT');

/* 43. 
  Личинка МСМ 80 мм ключ-ключ
  Price: 795 / 689
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH80MMKLUCKLUC', 'LICH-37', 24, 'Личинка МСМ 80 мм ключ-ключ', NULL, 1, 80, NULL, NULL, 12, 1, 795, 689, 683, NULL, 1, 0, '867a7db6-c391-4479-8d3d-8efdd0b14189'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH80MMKLUCKLUC');

/* 44. 
  Личинка МСМ 90 мм ключ-ключ
  Price: 870 / 754
  Pack: 12/1
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'LICH90MMKLUCKLUC', 'LICH-38', 24, 'Личинка МСМ 90 мм ключ-ключ', NULL, 1, 90, NULL, NULL, 12, 1, 870, 754, 751, NULL, 1, 0, 'b8238af6-852e-445f-9557-fc049b43ab8a'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'LICH90MMKLUCKLUC');

/* 45. 
  Проушина 18*50 пр
  Price: 6 / 5.2 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU1850PR', 'PROU-1', 25, 'Проушина 18*50 пр', NULL, 1, 18, 50, NULL, 100, 100, 6, 5.2, 4.7, NULL, 1, 0, '4135b7da-d6b7-43b4-a008-4932963cbe78'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU1850PR');

/* 46. 
  Проушина 18х50 г-обр
  Price: 6 / 5.2 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU1850GOBR', 'PROU-2', 25, 'Проушина 18х50 г-обр', NULL, 1, 18, 50, NULL, 100, 100, 6, 5.2, 4.7, NULL, 1, 0, '7737ac85-a5af-4edd-b5d1-a9fcc59af294'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU1850GOBR');

/* 47. 
  Проушина 28*77 г-обр
  Price: 31.5 / 27.3 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU2877GOBR', 'PROU-3', 25, 'Проушина 28*77 г-обр', NULL, 1, 28, 77, NULL, 100, 100, 31.5, 27.3, 24.3, NULL, 1, 0, '542eca13-9b15-49ad-96e0-bed017764d6f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU2877GOBR');

/* 48. 
  Проушина 28х77 ПР
  Price: 30 / 26 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU2877PR', 'PROU-4', 25, 'Проушина 28х77 ПР', NULL, 1, 28, 77, NULL, 100, 100, 30, 26, 21, NULL, 1, 0, '0b21c59b-da5b-4e46-abce-ef94469b5fd0'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU2877PR');

/* 49. 
  Проушина 30х100 К
  Price: 18.75 / 16.25 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU30100K', 'PROU-5', 25, 'Проушина 30х100 К', NULL, 1, 18, 50, NULL, 100, 100, 18.75, 16.25, 15.42, NULL, 1, 0, '80a59940-2b75-45d4-b52c-d6636262cbe4'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU30100K');

/* 50. 
  Проушина 30х40 г-обр К
  Price: 20.25 / 17.55
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU3040GOBRK', 'PROU-6', 25, 'Проушина 30х40 г-обр К', NULL, 1, 30, 40, NULL, 100, 100, 20.25, 17.55, 16.47, NULL, 1, 0, '2cb636b3-c23c-465f-9750-df6626daaf3f'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU3040GOBRK');

/* 51. 
  Проушина 50*150 пр
  Price: 60 / 52 
  Pack: 50/10 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU50150PR', 'PROU-7', 25, 'Проушина 50*150 пр', NULL, 1, 50, 150, NULL, 50, 10, 60, 52, 47, NULL, 1, 0, '71a6303e-c206-4d76-9b22-f57be6caac24'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU50150PR');

/* 52. 
  Проушина 50/20 беларус
  Price: 22.5 / 19.5
  Pack: 100/10 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU5020BELA', 'PROU-8', 25, 'Проушина 50/20 беларус', NULL, 1, 50, 20, NULL, 100, 10, 22.5, 19.5, 18.07, NULL, 2, 0, '0cbe91ea-8eb2-45f4-9c9a-1b0130c95960'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU5020BELA');

/* 53. 
  Проушина 56*77 г-обр
  Price: 40.5 / 35.1 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU5677GOBR', 'PROU-9', 25, 'Проушина 56*77 г-обр', NULL, 1, 56, 77, NULL, 100, 100, 40.5, 35.1, 31.4, NULL, 1, 0, 'd90c1c78-243b-4b17-b775-f2b4b3c878f3'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU5677GOBR');

/* 54. 
  Проушина 56х77 ПР
  Price: 39 / 33.8 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU5677PR', 'PROU-10', 25, 'Проушина 56х77 ПР', NULL, 1, 56, 77, NULL, 100, 100, 39, 33.8, 31.2, NULL, 1, 0, 'ab69ed1b-c9bc-4656-a727-80132c08fa90'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU5677PR');

/* 55. 
  Проушина 70*30 Г-обр
  Price: 12 / 10.4 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7030GOBR', 'PROU-11', 25, 'Проушина 70*30 Г-обр', NULL, 1, 70, 30, NULL, 100, 100, 12, 10.4, 9.7, NULL, 1, 0, '83ed8989-d43f-49b2-97b5-30c3301a3559'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7030GOBR');

/* 56. 
  Проушина 70х30 ПР
  Price: 11.7 / 10.14 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7030PR', 'PROU-12', 25, 'Проушина 70х30 ПР', NULL, 1, 70, 30, NULL, 100, 100, 11.7, 10.14, 9.3, NULL, 1, 0, '9ff21a18-cf21-43b7-988c-011252b90a65'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7030PR');

/* 57. 
  Проушина 70\30 беларус ГН
  Price: 22.5 / 19.5 
  Pack: 100/10 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7030BELAGN', 'PROU-13', 25, 'Проушина 70\30 беларус ГН', NULL, 1, 70, 30, NULL, 100, 10, 22.5, 19.5, 17.8, NULL, 2, 0, '4761da32-8062-4857-a7d1-6efe18ff0a96'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7030BELAGN');

/* 58. 
  Проушина 70\30 беларус ПР
  Price: 22.5 / 19.5 
  Pack: 100/10 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7030BELAPR', 'PROU-14', 25, 'Проушина 70\30 беларус ПР', NULL, 1, 70, 30, NULL, 100, 10, 22.5, 19.5, 17.8, NULL, 2, 0, '2e636d2f-6ac0-471b-aa80-042612cc09dc'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7030BELAPR');

/* 59. 
  Проушина 75*40 Г-обр
  Price: 15 / 13 
  Pack: 250/250  
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7540GOBR', 'PROU-15', 25, 'Проушина 75*40 Г-обр', NULL, 1, 75, 40, NULL, 250, 250, 15, 13, 11, NULL, 1, 0, '78b3cbda-1cfb-44ec-b0e9-750252fe574c'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7540GOBR');

/* 60. 
  Проушина 75х40 ПР
  Price: 15 / 13 
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU7540PR', 'PROU-16', 25, 'Проушина 75х40 ПР', NULL, 1, 75, 40, NULL, 100, 100, 15, 13, 11, NULL, 1, 0, '50106ce0-0030-4a7c-b6fa-8abc414e81d5'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU7540PR');

/* 61. 
  Проушина 90*40 Г-обр
  Price: 22.5 / 19.5
  Pack: 150/150 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU9040GOBR', 'PROU-17', 25, 'Проушина 90*40 Г-обр', NULL, 1, 90, 40, NULL, 150, 150, 22.5, 19.5, 18.2, NULL, 1, 0, '5b1e4805-14f8-40ad-8305-f21eca841d92'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU9040GOBR');

/* 62. 
  Проушина 90х 40 ПР
  Price: 22.5 / 19.5
  Pack: 100/100 
*/
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, dimension_width_mm, dimension_height_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, has_image, uid)
SELECT 'PROU9040PR', 'PROU-18', 25, 'Проушина 90х 40 ПР', NULL, 1, 90, 40, NULL, 100, 100, 22.5, 19.2, 17.7, NULL, 1, 0, '77c8f5a0-601c-4bb8-aa8f-e3a819171c6b'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'PROU9040PR');
