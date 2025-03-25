package rest

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	ports "github.com/martinwangen/norskball/apps/backend/internal/core/ports/match"
)

type MatchHandler struct {
	service ports.MatchService
}

func NewMatchHandler(service ports.MatchService) *MatchHandler {
	return &MatchHandler{
		service: service,
	}
}

func (h *MatchHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/matches", h.ListMatches).Methods("GET")
	router.HandleFunc("/api/matches/{id}", h.GetMatch).Methods("GET")
	router.HandleFunc("/api/matches", h.CreateMatch).Methods("POST")
	router.HandleFunc("/api/matches/{id}", h.UpdateMatch).Methods("PUT")
	router.HandleFunc("/api/matches/{id}", h.DeleteMatch).Methods("DELETE")
	router.HandleFunc("/api/matches/{id}/lineups/{teamId}", h.UpdateMatchLineup).Methods("PUT")
}

type MatchResponse struct {
	*match.Match
}

func (h *MatchHandler) ListMatches(w http.ResponseWriter, r *http.Request) {
	pageSize := int32(10)
	pageToken := r.URL.Query().Get("pageToken")

	// Service now returns matches with lineups populated
	matches, nextPageToken, err := h.service.ListMatches(r.Context(), pageSize, pageToken)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	matchResponses := make([]*MatchResponse, len(matches))
	for i, m := range matches {
		matchResponses[i] = &MatchResponse{
			Match: m,
		}
	}

	response := struct {
		Matches       []*MatchResponse `json:"matches"`
		NextPageToken string           `json:"next_page_token,omitempty"`
	}{
		Matches:       matchResponses,
		NextPageToken: nextPageToken,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}

func (h *MatchHandler) GetMatch(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Service now returns match with lineups populated
	match, err := h.service.GetMatch(r.Context(), id)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	if match == nil {
		RespondWithError(w, http.StatusNotFound, ErrCodeNotFound, "Match not found")
		return
	}

	response := &MatchResponse{
		Match: match,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}

func (h *MatchHandler) CreateMatch(w http.ResponseWriter, r *http.Request) {
	var match match.Match
	if err := json.NewDecoder(r.Body).Decode(&match); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body")
		return
	}

	createdMatch, err := h.service.CreateMatch(r.Context(), &match)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	response := &MatchResponse{
		Match: createdMatch,
	}

	RespondWithJSON(w, http.StatusCreated, NewSuccessResponse(response))
}

func (h *MatchHandler) UpdateMatch(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var match match.Match
	if err := json.NewDecoder(r.Body).Decode(&match); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body")
		return
	}

	match.ID = id
	updatedMatch, err := h.service.UpdateMatch(r.Context(), &match)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	response := &MatchResponse{
		Match: updatedMatch,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}

func (h *MatchHandler) DeleteMatch(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := h.service.DeleteMatch(r.Context(), id); err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *MatchHandler) UpdateMatchLineup(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	matchID := vars["id"]
	teamID := vars["teamId"]

	var lineup match.Lineup
	if err := json.NewDecoder(r.Body).Decode(&lineup); err != nil {
		RespondWithError(w, http.StatusBadRequest, ErrCodeBadRequest, "Invalid request body")
		return
	}

	lineup.MatchID = matchID
	lineup.TeamID = teamID

	updatedMatch, err := h.service.UpdateMatchLineup(r.Context(), matchID, teamID, &lineup)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, ErrCodeInternalError, err.Error())
		return
	}

	response := &MatchResponse{
		Match: updatedMatch,
	}

	RespondWithJSON(w, http.StatusOK, NewSuccessResponse(response))
}
