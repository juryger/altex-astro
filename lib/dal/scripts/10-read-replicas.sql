INSERT INTO read_replicas
(type, file_name, created_at)
VALUES('catalog', 'catalog-initial.db', unixepoch());

INSERT INTO read_replicas
(type, file_name, created_at)
VALUES('catalog', 'catalog-1234567.db', unixepoch());