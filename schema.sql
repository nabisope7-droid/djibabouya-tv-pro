CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO app_state (id, state_json, updated_at)
VALUES (1, '{"home":"DJIBABOUYA","away":"KANSIDI","sh":0,"sa":0,"status":"DIRECT","extra":0,"message":"","running":false,"elapsed":0,"startedAt":0,"extraMode":false,"extraElapsed":0,"extraStartedAt":0,"scoreVisible":true,"scoreScale":100,"scoreWidth":100,"scoreHeight":100,"scoreX":0,"scoreY":12,"scoreAttached":true,"adImage":"","adVideo":"","adVideoDuration":0,"adPublicationId":"","replayVideo":"","replayStartedAt":0,"replayDuration":0,"replayClipStart":0,"replayClipEnd":0,"replaySpeed":0.5,"replayPublicationId":"","adTitle":"","adText":"","adTextColor":"#ffffff","adBgColor":"#1a1a1a","adStartedAt":0,"adDuration":0,"posterImage":"","posterStartedAt":0,"posterPublicationId":"","subOutPhoto":"","subOutName":"","subOutNumber":"","subOutTeam":"","subInPhoto":"","subInName":"","subInNumber":"","subInTeam":"","subStartedAt":0,"subDuration":0,"goalEvents":[],"goalReminderVisible":true,"goalReminderDuration":12,"compositionVisible":false,"compositionFormation":"4-4-2","compositionTeam":"home","compositionPlayers":[],"compositionPublicationId":"","homeColor":"#ffffff","homeOutline":"#000000","homeBg":"#0964e8","awayColor":"#ffffff","awayOutline":"#000000","awayBg":"#f4c400","scoreColor":"#111111","scoreBg":"#ffffff","clockColor":"#ffffff","extraColor":"#ffffff","updatedAt":0}', 0);

CREATE TABLE IF NOT EXISTS media_files (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  chunk_count INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS media_chunks (
  media_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  data BLOB NOT NULL,
  PRIMARY KEY (media_id, chunk_index),
  FOREIGN KEY (media_id) REFERENCES media_files(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_media_chunks_media_id ON media_chunks(media_id, chunk_index);
