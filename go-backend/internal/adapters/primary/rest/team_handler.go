package rest

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	teamports "github.com/martinwangen/norskball/apps/backend/internal/core/ports/team"
)

type TeamHandler struct {
	teamService teamports.Service
}

func NewTeamHandler(teamService teamports.Service) *TeamHandler {
	return &TeamHandler{
		teamService: teamService,
	}
}

func (h *TeamHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/teams", h.CreateTeam).Methods(http.MethodPost)
	router.HandleFunc("/api/teams", h.ListTeams).Methods(http.MethodGet)
	router.HandleFunc("/api/teams/{id}", h.GetTeam).Methods(http.MethodGet)
	router.HandleFunc("/api/teams/{id}", h.UpdateTeam).Methods(http.MethodPut)
	router.HandleFunc("/api/teams/{id}", h.DeleteTeam).Methods(http.MethodDelete)
	router.HandleFunc("/api/teams/{id}/players", h.ListTeamPlayers).Methods(http.MethodGet)
	router.HandleFunc("/api/teams/{id}/last_lineup", h.GetLastLineup).Methods(http.MethodGet)
}

func (h *TeamHandler) CreateTeam(w http.ResponseWriter, r *http.Request) {
	var team team.Team
	if err := json.NewDecoder(r.Body).Decode(&team); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body")
		return
	}

	createdTeam, err := h.teamService.CreateTeam(r.Context(), &team)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusCreated, NewSuccessResponse(createdTeam))
}

func (h *TeamHandler) GetTeam(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	team, err := h.teamService.GetTeam(r.Context(), id)
	if err != nil {
		if err.Error() == "team not found" {
			RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, err.Error())
			return
		}
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(team))
}

func (h *TeamHandler) ListTeams(w http.ResponseWriter, r *http.Request) {
	pageSize := int32(10) // Default page size
	pageSizeStr := r.URL.Query().Get("page_size")
	if pageSizeStr != "" {
		if size, err := strconv.ParseInt(pageSizeStr, 10, 32); err == nil {
			pageSize = int32(size)
		}
	}

	pageToken := r.URL.Query().Get("pageToken")

	teams, nextPageToken, err := h.teamService.ListTeams(r.Context(), pageSize, pageToken)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	response := struct {
		Teams         []*team.Team `json:"teams"`
		NextPageToken string       `json:"nextPageToken,omitempty"`
	}{
		Teams:         teams,
		NextPageToken: nextPageToken,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}

func (h *TeamHandler) UpdateTeam(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var team team.Team
	if err := json.NewDecoder(r.Body).Decode(&team); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body")
		return
	}

	// Ensure ID in path matches ID in body
	team.ID = id

	updatedTeam, err := h.teamService.UpdateTeam(r.Context(), &team)
	if err != nil {
		if err.Error() == "team not found" {
			RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, err.Error())
			return
		}
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(updatedTeam))
}

func (h *TeamHandler) DeleteTeam(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.teamService.DeleteTeam(r.Context(), id)
	if err != nil {
		if err.Error() == "team not found" {
			RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, err.Error())
			return
		}
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	RespondWithJSON(w, http.StatusNoContent, NewSuccessResponse(nil))
}

func (h *TeamHandler) ListTeamPlayers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	teamID := vars["id"]

	pageSize := int32(10) // Default page size
	pageSizeStr := r.URL.Query().Get("pageSize")
	if pageSizeStr != "" {
		if size, err := strconv.ParseInt(pageSizeStr, 10, 32); err == nil {
			pageSize = int32(size)
		}
	}

	pageToken := r.URL.Query().Get("pageToken")

	players, nextPageToken, err := h.teamService.ListTeamPlayers(r.Context(), teamID, pageSize, pageToken)
	if err != nil {
		if err.Error() == "team not found" {
			RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, err.Error())
			return
		}
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	response := struct {
		Players       []*player.Player `json:"players"`
		NextPageToken string           `json:"nextPageToken,omitempty"`
	}{
		Players:       players,
		NextPageToken: nextPageToken,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}

func (h *TeamHandler) GetLastLineup(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	teamID := vars["id"]

	lineup, err := h.teamService.GetLastLineup(r.Context(), teamID)
	if err != nil {
		if err.Error() == "team not found" {
			RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, err.Error())
			return
		}
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	if lineup == nil {
		RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, "No lineup found for team")
		return
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(lineup))
}
