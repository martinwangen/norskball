package domain

import (
	// Import all domain models
	_ "github.com/martinwangen/norskball/apps/backend/internal/core/domain/common"
	_ "github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	_ "github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	_ "github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	_ "github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
)

// This file serves as a central point to import all domain models
// It helps ensure that all domain models are properly loaded
// It also helps prevent import cycles
