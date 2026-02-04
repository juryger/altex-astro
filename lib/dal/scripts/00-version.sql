UPDATE "__version"
SET value=unixepoch()
WHERE EXISTS (SELECT * FROM "__version" WHERE ID = 1);

INSERT INTO "__version"
(id, value)
SELECT 1, unixepoch()
WHERE NOT EXISTS (SELECT * FROM "__version" WHERE id = 1);
