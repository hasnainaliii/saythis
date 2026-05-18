# Backend Updates for DAF & FAF Tools

The frontend has been updated to integrate the DAF and FAF tools. Below are the required backend updates for your Go API and PostgreSQL database.

## 1. PostgreSQL Migrations

Run the following SQL to create the `tool_sessions` table and its indexes:

```sql
CREATE TABLE tool_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_type       VARCHAR(10) NOT NULL CHECK (tool_type IN ('DAF','FAF')),
  started_at      TIMESTAMPTZ NOT NULL,
  ended_at        TIMESTAMPTZ NOT NULL,
  duration_seconds INT NOT NULL,
  settings        JSONB NOT NULL,
  mode            VARCHAR(20),
  estimated_words INT DEFAULT 0,
  self_rating     SMALLINT CHECK (self_rating BETWEEN 1 AND 5),
  adjustments     SMALLINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tool_sessions_user_type ON tool_sessions(user_id, tool_type);
CREATE INDEX idx_tool_sessions_user_date ON tool_sessions(user_id, started_at DESC);
```

## 2. Go API Routes and Handlers

You need to add the following endpoints to your Go backend:
- `POST /api/tool-sessions`
- `GET /api/tool-sessions`
- `GET /api/tool-sessions/stats/summary`

Here is a reference implementation for the Go handlers:

```go
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ToolSessionPayload struct {
	ToolType         string                 `json:"toolType"`
	StartedAt        time.Time              `json:"startedAt"`
	EndedAt          time.Time              `json:"endedAt"`
	DurationSeconds  int                    `json:"durationSeconds"`
	Mode             *string                `json:"mode"`
	EstimatedWords   int                    `json:"estimatedWords"`
	SelfRating       *int                   `json:"selfRating"`
	DelayMs          *int                   `json:"delayMs"`           // DAF specific
	VolumePercent    *float64               `json:"volumePercent"`     // DAF specific
	PassageIndex     *int                   `json:"passageIndex"`      // DAF specific
	DelayAdjustments *int                   `json:"delayAdjustments"`  // DAF specific
	PitchDirection   *string                `json:"pitchDirection"`    // FAF specific
	PitchSemitones   *int                   `json:"pitchSemitones"`    // FAF specific
	PitchAdjustments *int                   `json:"pitchAdjustments"`  // FAF specific
}

// POST /api/tool-sessions
func CreateToolSession(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id") // Assuming user_id is set by auth middleware
		var payload ToolSessionPayload
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		settings := make(map[string]interface{})
		var adjustments int

		if payload.ToolType == "DAF" {
			if payload.DelayMs != nil { settings["delay_ms"] = *payload.DelayMs }
			if payload.VolumePercent != nil { settings["volume_percent"] = *payload.VolumePercent }
			if payload.PassageIndex != nil { settings["passage_index"] = *payload.PassageIndex }
			if payload.DelayAdjustments != nil { adjustments = *payload.DelayAdjustments }
		} else if payload.ToolType == "FAF" {
			if payload.PitchDirection != nil { settings["pitch_direction"] = *payload.PitchDirection }
			if payload.PitchSemitones != nil { settings["pitch_semitones"] = *payload.PitchSemitones }
			if payload.PitchAdjustments != nil { adjustments = *payload.PitchAdjustments }
		}

		settingsJSON, _ := json.Marshal(settings)

		var id string
		query := \`
			INSERT INTO tool_sessions 
			(user_id, tool_type, started_at, ended_at, duration_seconds, settings, mode, estimated_words, self_rating, adjustments)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			RETURNING id
		\`
		err := db.QueryRow(query, userID, payload.ToolType, payload.StartedAt, payload.EndedAt, 
			payload.DurationSeconds, settingsJSON, payload.Mode, payload.EstimatedWords, payload.SelfRating, adjustments).Scan(&id)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"id": id, "createdAt": time.Now()})
	}
}

// Implement GET /api/tool-sessions and GET /api/tool-sessions/stats/summary similarly 
// to query the tool_sessions table and return the requested aggregations.
```
