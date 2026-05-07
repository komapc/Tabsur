CREATE TABLE refresh_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(256) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id  ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash     ON refresh_tokens(token_hash);

GRANT ALL ON TABLE    refresh_tokens            TO PUBLIC;
GRANT ALL ON SEQUENCE refresh_tokens_id_seq     TO PUBLIC;
