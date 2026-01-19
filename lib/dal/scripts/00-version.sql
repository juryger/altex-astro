UPDATE "__version"
SET value=DATETIME('now')
WHERE EXISTS (SELECT * FROM "__version" WHERE ID = 1);

INSERT INTO "__version"
(id, value)
SELECT 1, DATETIME('now')
WHERE NOT EXISTS (SELECT * FROM "__version" WHERE id = 1);
