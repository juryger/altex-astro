/* 1. ZAMKI */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMK', 'Замки', NULL, 'a514f2f2-7d2e-434a-97e3-f3b2637663c2'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMK');

/* 2. ZAMKI FURNITURA */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKFURN', 'Замочная фурнитура', NULL, '5155a71f-9bdb-4bb8-992e-7c98f42e95fe'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKFURN');

/* 3. INSTRUMENTI */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'INST', 'Инструменты', NULL, '5292c9ef-3431-43fa-9f67-a8620d0f19b4'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'INST');

/* 4. CARABINI */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CARA', 'Карабины', NULL, '910b2ab8-7ab8-4109-8e56-f356d9bb3be4'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CARA');

/* 5. FURNITURA */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'FURN', 'Фурнитура', NULL, '47bf883f-35cf-43a7-a7d8-0595f7d98ea9'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'FURN');

/* 6. CHOZTOVARI */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CHOZ', 'Хозтовары', NULL, '78f32743-14f3-4c84-8aff-d6c2dcd7db7c'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CHOZ');

/* 7. CHOMUTI */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CHOM', 'Хомуты', NULL, 'e34e530a-813b-4918-9450-4af81a374673'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CHOM');

/* ---------------------------------------------------- */
/* -> ZAMKI: SUB-CATEGORIES */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKFERR', 'Замки FERRE', 1, '5890dad1-bf87-4899-aca1-54619af41ed1'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKFERR');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKAPEK', 'Замки АПЕКС', 1, '5beb372c-5b88-48d2-be1d-d29ac9cdbcae'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKAPEK');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKVITR', 'Замки витрина', 1, '7a62161f-ad5b-490d-8f42-5da3bcd6258c'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKVITR');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKVREZ', 'Замки врезные', 1, '12fbe5c9-544d-4b6a-be98-2f7a1b058132'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKVREZ');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKVC', 'Замки ВС', 1, 'f9afd569-2311-4dd2-9f2c-398c338bd5e6'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKVC');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKGARA', 'Замки Гарант', 1, '8903c620-5e4c-482a-b65a-b4c5f69966e0'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKGARA');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKOKON', 'Замки оконные', 1, 'af5f0db0-6078-4fa3-965f-cf8ecf557939'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKOKON');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKNAKL', 'Замки накладные', 1, 'a6e90a30-516c-444d-95a8-c6f82353a0e1'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKNAKL');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKPOCH', 'Замки почтовые', 1, 'ebaa0e12-a886-4917-8807-98ac43564fb4'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKPOCH');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKSTOLSDUJK', 'Замки с толстой душкой', 1, '33646e1c-6bae-43b8-acbe-aa89cf800066'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKSTOLSDUJK');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKTROS', 'Замки трос', 1, 'b18c841e-7ab1-4ae4-9f7c-5d01ba0752cc'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKTROS');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKCHEB', 'Замки Чебоксары', 1, '6740b848-3e52-4268-bead-0304397d172f'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKCHEB');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKEKST', 'Замки Экстра', 1, '664f33a3-4ffd-4600-aa90-08602556e0b4'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKEKST');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZAMKMECH', 'Замки Механизм', 1, 'cc490c99-746b-4ce2-b635-7e683e6b28bb'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZAMKMECH');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'RUCHDLYAZAMK', 'Ручки для замков', 1, '3f8bfc8d-f642-4e3e-a0b1-529b1fba7ce5'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'RUCHDLYAZAMK');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PROCZAMK', 'Прочие замки', 1, '85a4f47f-d8b0-4db7-8043-8f9f9302e0e3'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PROCZAMK');

/* ---------------------------------------------------- */
/* -> ZAMKI FURNITURA: SUB-CATEGORIES */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'LICH', 'Личинки', 2, 'b9f6bd11-026d-4184-ad46-ca78d1f2f583'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'LICH');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PROU', 'Проушины', 2, 'ceccc7c2-ab09-4d4a-9179-00a559798261'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PROU');

/* ---------------------------------------------------- */
/* -> INSTRUMENTI: SUB-CATEGORIES */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'OTVE', 'Отвертки', 3, '6da455ab-917b-4556-869d-2667d8b36847'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'OTVE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PASSKUSAIPROC', 'Пассатижи, кусачки и прочее', 3, '14555459-8e20-4927-afeb-42c30f034d9b'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PASSKUSAIPROC');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CHERDLYAINST', 'Черенки для инструментов', 3, '5146ddd9-2c9b-4d5e-9944-d94336ef102c'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CHERDLYAINST');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PROCINST', 'Прочие инструменты', 3, 'bba642e3-8475-4486-bde6-428f947b05cf'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PROCINST');

/* ---------------------------------------------------- */
/* -> FURNITURA: SUB-CATEGORIES */
INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'GVOZOBIV', 'Гвозди обивочные', 5, '99b3baf2-bdfc-4c87-b5be-e2feacdcfe13'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'GVOZOBIV');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'DOVO', 'Доводчики', 5, 'fb5ff3be-4832-4ec1-9bbc-4c9945829ca1'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'DOVO');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ZERKDERZ', 'Зеркало-держатели', 5, 'a1a7c471-69a8-47da-8cdd-9a8b6d9d23df'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ZERKDERZ');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'POLKDERZ', 'Полко-держатели', 5, '7c32ec42-1393-430e-86b2-26f44c6a29ac'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'POLKDERZ');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLMEBE', 'Петли мебельные', 5, 'b4bf80a0-3bdf-473b-9840-2b873489dddf'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLMEBE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLBARN', 'Петли барные', 5, '89734db8-41f0-4c8d-8770-db21a655aaa3'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLBARN');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'ROLI', 'Ролики', 5, '5a982236-2fe1-45b8-9ac1-e69b6a4053d3'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'ROLI');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PODP', 'Подпятники', 5, '114a3a12-e9c0-49dc-a95b-6ef8ee8a8d29'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PODP');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CEPODVER', 'Цепочки дверные', 5, '7865e2cb-658f-41a2-a59b-70bd28b05a3f'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CEPODVER');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'CIFRNADVER', 'Цифры на дверь', 5, '2f355890-ff3e-4848-80b2-331d615bce72'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'CIFRNADVER');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'RUCHDLYAPOGR', 'Ручки для погреба', 5, 'ff100038-0b35-4ee4-879b-553a37f38619'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'RUCHDLYAPOGR');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'UTYA', 'Утяжки', 5, 'd094aeb9-e35d-4b36-9a4d-6b86032ff315'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'UTYA');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'KRON', 'Кронштейны', 5, 'b40d2e9c-fcfa-4a23-a9e3-70414d8c5c6b'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'KRON');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'KRUC', 'Крючки', 5, '9a206c3f-7f53-40e4-8055-6abb47995193'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'KRUC');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'MEBEZACH', 'Мебельные защелки', 5, '86e845d0-1410-4f5d-b920-0af1181179ec'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'MEBEZACH');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'MEBENAPR', 'Мебельные направляющие', 5, '6162dda4-5faa-408d-a99a-8b324ee23f36'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'MEBENAPR');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'OKONFURN', 'Оконная фурнитура', 5, '009e6d52-0c31-4241-9053-55d6928ab34d'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'OKONFURN');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'OPORMEBE', 'Опоры мебельные', 5, '9ff585c0-4f29-4c6d-bb95-9a7aad26d236'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'OPORMEBE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'OPORPROM', 'Опоры промышленные', 5, '7d320533-8709-48b3-8a50-e3fb57ee1b80'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'OPORPROM');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLVVE', 'Петли ввертные', 5, '158cc139-a756-4458-a53f-664521745546'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLVVE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLGARA', 'Петли гаражные', 5, '50df3333-59ca-4998-854c-6a7e2c1ed338'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLGARA');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLKART', 'Петли карточные', 5, '67a39736-8780-438d-82b0-4876741ef084'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLKART');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLNAKL', 'Петли накладные', 5, '6e1bab42-0f07-45d8-82ae-a3c9342a7e72'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLNAKL');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLROYA', 'Петли рояльные', 5, '2cbb7ef5-07f7-428b-b24c-3febf08550d5'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLROYA');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLSTRE', 'Петли стрелы', 5, '30f50ff2-4e3c-43e4-9d44-472452db9ae8'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLSTRE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLCHETSHAR', 'Петли четырех-шарнирные', 5, '3341e91a-4974-4af6-bf47-47fc1a2c7a0d'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLCHETSHAR');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PETLKREP', 'Петли крепежные', 5, '9dcb11e6-eb2a-4da6-836f-4b1a5cb2b0dc'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PETLKREP');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PODV', 'Подвесы', 5, '1a38cb23-db0a-41c7-bdda-aa99cc2a25c5'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PODV');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'RUCHDVER', 'Ручки дверные', 5, '47aaf13b-8d4b-4b0d-90fe-750b96459f0e'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'RUCHDVER');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'RUCHMEBE', 'Ручки мебельные', 5, '0f03f57c-2e0f-418a-b080-a5a7f2854da5'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'RUCHMEBE');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'TRUBIVLAN', 'Трубы и фланцы', 5, '56bdb90f-d234-4ab6-a5a0-3340d8cd8b56'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'TRUBIVLAN');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'UGOL', 'Уголки', 5, '2bd207c7-748b-4239-a4be-1268426e96fa'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'UGOL');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'UPORDVER', 'Упоры дверные', 5, '3eb5f61a-9829-4537-a5f5-98499c6efa88'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'UPORDVER');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'SHPI', 'Шпингалеты', 5, 'e2f38949-b0aa-43e2-9e4b-08cbd23e1f15'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'SHPI');

INSERT INTO categories
(slug, title, parent_id, uid)
SELECT 'PROCFURN', 'Прочая фурнитура', 5, '519fa740-4490-4503-85d0-0813f1c16d8b'
WHERE NOT EXISTS (SELECT * FROM categories WHERE slug = 'PROCFURN');