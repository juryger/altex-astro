
/* 1. Цвета: хром/зол/медь, Product: "VESHALKA NA POLKE" */
INSERT INTO product_colors (product_id, color_id)
SELECT 1, 3
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 1 AND color_id = 3);

INSERT INTO product_colors (product_id, color_id)
SELECT 1, 1
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 1 AND color_id = 1);

INSERT INTO product_colors (product_id, color_id)
SELECT 1, 2
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 1 AND color_id = 2);

/* 2. Цвета: AC/AB/CP/PB, Product: "VESHALKA NA PLANKE" */
INSERT INTO product_colors (product_id, color_id)
SELECT 2, 2
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 2  AND color_id = 2);

INSERT INTO product_colors (product_id, color_id)
SELECT 2, 1
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 2  AND color_id = 1);

INSERT INTO product_colors (product_id, color_id)
SELECT 2, 4
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 2  AND color_id = 4);

/* 3. Цвета: ALL, Product : "ZAMOK FERRE" */
INSERT INTO product_colors (product_id, color_id)
SELECT 3, 1
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 1);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 2
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 2);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 3
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 3);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 4
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 4);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 5
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 5);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 6
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 6);

INSERT INTO product_colors (product_id, color_id)
SELECT 3, 7
WHERE NOT EXISTS (SELECT * FROM product_colors WHERE product_id = 3 AND color_id = 7);

/* 4. Цвета: -, Product : "ZAMOK APEKS" */