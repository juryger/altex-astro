UPDATE "__version"
SET name = "initial", createdAt=unixepoch()
WHERE EXISTS (SELECT * FROM "__version" WHERE ID = 1);

INSERT INTO "__version"
(id, name, createdAt)
SELECT 1, 'inital', unixepoch()
WHERE NOT EXISTS (SELECT * FROM "__version" WHERE id = 1);