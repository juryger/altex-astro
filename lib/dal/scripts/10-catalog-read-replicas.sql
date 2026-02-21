INSERT INTO read_replicas
(name, file_name, created_at, is_failed, sync_log)
VALUES('catalog', 'catalog-initial.db', unixepoch(), 0, '');