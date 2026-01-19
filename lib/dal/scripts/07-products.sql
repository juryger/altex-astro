/* 1. VESHALKA NA POLKE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, uid)
SELECT 'VESHNAPLAN3KRUCSERINATA', 'CHOZ-1', 6, 'Вешалка на планке 3 крючка серия Наташа', NULL, 2, 3, 3, 120.01, 115, 110.11, 1, 2, 'fab7dd52-b231-4ed0-b81e-c908a77b34f5'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'VESHNAPLAN3KRUCSERINATA');

/* 2. VESHALKA NA PLANKE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, make_country_id, uid)
SELECT 'VESHNAPLAN4KRUCSERINATA', 'CHOZ-2', 6, 'Вешалка на планке 4 крючка серия Наташа', NULL, 3, 6, 6, 125.42, 118, 111.33, 3, '87da923c-da7e-465e-8a97-6eaad396db6e'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'VESHNAPLAN4KRUCSERINATA');

/* 3. ZAMOK FERRE */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, dimension_length_mm, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, uid)
SELECT 'ZAMOFERR1323MEJO', 'ZAMO-1', 8, 'Замок FERRE 1323 межос 80 мм', NULL, 1, 80, 1, 1, 120.01, 115, 110.11, 1, 1, 'f0eced48-627b-49d4-8cc6-f2a90452c9a8'
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'ZAMOFERR1323MEJO');

/* 4. ZAMOK APEKS */
INSERT INTO products(slug, product_code, category_id, title, description, unit_id, quantity_in_pack, min_quantity_to_buy, price, whs_price1, whs_price2, maker_id, make_country_id, uid)
SELECT 'ZAMOAPEKPD38PERFOKLUC', 'ZAMO-2', 8, 'Замок АПЕКС PD-38 перфо-ключ', NULL, 1, 1, 1, 20.13, 15, 10.07, 2, 2, '6416c021-2212-488b-90aa-edaa174258e0'  
WHERE NOT EXISTS (SELECT * FROM products WHERE slug = 'ZAMOAPEKPD38PERFOKLUC');