package rest

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	ports "github.com/martinwangen/norskball/apps/backend/internal/core/ports/player"
)

type PlayerHandler struct {
	playerService ports.PlayerService
}

func NewPlayerHandler(playerService ports.PlayerService) *PlayerHandler {
	return &PlayerHandler{
		playerService: playerService,
	}
}

func (h *PlayerHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/players", h.ListPlayers).Methods("GET")
	router.HandleFunc("/api/players/{id}", h.GetPlayer).Methods("GET")
	router.HandleFunc("/api/players/team/{id}", h.GetPlayersByTeamId).Methods("GET")
	router.HandleFunc("/api/players", h.CreatePlayer).Methods("POST")
	router.HandleFunc("/api/players/{id}", h.UpdatePlayer).Methods("PUT")
	router.HandleFunc("/api/players/{id}", h.DeletePlayer).Methods("DELETE")
}

func (h *PlayerHandler) GetPlayer(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	player, err := h.playerService.GetPlayer(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if player == nil {
		http.Error(w, "Player not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(player)
}

func (h *PlayerHandler) GetPlayersByTeamId(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	players, err := h.playerService.GetPlayersByTeamId(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(players)
}

func (h *PlayerHandler) ListPlayers(w http.ResponseWriter, r *http.Request) {
	pageSize := int32(10)
	if pageSizeStr := r.URL.Query().Get("page_size"); pageSizeStr != "" {
		if size, err := strconv.Atoi(pageSizeStr); err == nil && size > 0 {
			pageSize = int32(size)
		}
	}

	pageToken := r.URL.Query().Get("page_token")

	players, nextPageToken, err := h.playerService.ListPlayers(r.Context(), pageSize, pageToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Players       []*player.Player `json:"players"`
		NextPageToken string           `json:"next_page_token,omitempty"`
	}{
		Players:       players,
		NextPageToken: nextPageToken,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *PlayerHandler) CreatePlayer(w http.ResponseWriter, r *http.Request) {
	var player player.Player
	if err := json.NewDecoder(r.Body).Decode(&player); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	createdPlayer, err := h.playerService.CreatePlayer(r.Context(), &player)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(createdPlayer)
}

func (h *PlayerHandler) UpdatePlayer(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var player player.Player
	if err := json.NewDecoder(r.Body).Decode(&player); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	player.ID = id

	updatedPlayer, err := h.playerService.UpdatePlayer(r.Context(), &player)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedPlayer)
}

func (h *PlayerHandler) DeletePlayer(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.playerService.DeletePlayer(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
