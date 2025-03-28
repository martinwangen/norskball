    const mockData = {
        "totalCount": 1,
        "totalPages": 1,
        "currentPage": 1,
        "pageSize": 10,
        "items": [
            {
                "id": "56bba049-b152-42cc-80a3-a739e9197ce4",
                "homeTeamId": "13",
                "awayTeamId": "10",
                "homeTeamLineupId": "0b30c5dc-9f01-42d7-8b7a-888cd8ee1a10",
                "awayTeamLineupId": "5d706f16-8ba9-472f-882b-b45714022fac",
                "refereeId": null,
                "scheduledDate": "2025-03-29T16:00:00Z",
                "status": 1,
                "score": {
                    "homeTeamScore": 0,
                    "awayTeamScore": 0
                },
                "rating": null,
                "createdAt": "2025-03-24T07:44:11.256Z",
                "updatedAt": "2025-03-29T06:44:35.415123Z",
                "homeTeam": {
                    "id": "13",
                    "name": "Strømsgodset",
                    "shortName": "SIF",
                    "logo": "https://www.eliteserien.no/klubbene/_/image/1ff07bfb-13d5-4caf-8428-36ac65f56500:5ecbcd9d19e9c1e2f291acc2f3378771052092da/height-300/Stromsgodset%20ny.jpg",
                    "website": "http://www.godset.no/",
                    "stadium": {
                        "name": "Marienlyst Stadion",
                        "city": "Drammen",
                        "surface": "Grass"
                    },
                    "createdAt": "2025-03-23T21:11:21.319223Z",
                    "updatedAt": "2025-03-23T21:11:21.319223Z",
                    "players": []
                },
                "awayTeam": {
                    "id": "10",
                    "name": "Rosenborg",
                    "shortName": "RBK",
                    "logo": "https://www.eliteserien.no/klubbene/_/image/ee847d17-0d59-42fe-b990-6832786dd363:bff439a6e67a9c57a36e872ee2dbe6770910bb1e/height-300/RBK-logo.png",
                    "website": "http://www.rbk.no/",
                    "stadium": {
                        "name": "Lerkendal Stadion",
                        "city": "Trondheim",
                        "surface": "Grass"
                    },
                    "createdAt": "2025-03-23T21:11:21.327646Z",
                    "updatedAt": "2025-03-23T21:11:21.327646Z",
                    "players": []
                },
                "events": [],
                "homeTeamLineup": {
                    "id": "0b30c5dc-9f01-42d7-8b7a-888cd8ee1a10",
                    "teamId": "13",
                    "matchId": "56bba049-b152-42cc-80a3-a739e9197ce4",
                    "formation": 1,
                    "isStarting": true,
                    "players": [
                        {
                            "id": "096df1ca-6710-4343-be0b-ff463e236dbf",
                            "lineupId": "0b30c5dc-9f01-42d7-8b7a-888cd8ee1a10",
                            "playerId": "player_herman_stengel_20250327113530",
                            "teamId": "13",
                            "isStarter": true,
                            "position": "9",
                            "substitutedInAt": null,
                            "substitutedOutAt": null,
                            "player": null,
                            "lineup": null,
                            "team": null,
                            "ratings": [
                                {
                                    "id": "5890a08e-b88a-48b9-91f0-9f9a55351a45",
                                    "matchPlayerId": "096df1ca-6710-4343-be0b-ff463e236dbf",
                                    "userId": "wangen93@gmail.com",
                                    "score": 8,
                                    "createdAt": "2025-03-29T06:44:05.616043Z",
                                    "matchPlayer": null
                                }
                            ],
                            "averageRating": 8
                        }
                    ],
                    "createdAt": "2025-03-29T06:43:56.28404Z",
                    "updatedAt": "2025-03-29T06:43:56.28404Z",
                    "team": null,
                    "match": null
                },
                "awayTeamLineup": {
                    "id": "5d706f16-8ba9-472f-882b-b45714022fac",
                    "teamId": "10",
                    "matchId": "56bba049-b152-42cc-80a3-a739e9197ce4",
                    "formation": 1,
                    "isStarting": true,
                    "players": [
                        {
                            "id": "093b27d6-88d6-48b2-986f-577e1bb3aca4",
                            "lineupId": "5d706f16-8ba9-472f-882b-b45714022fac",
                            "playerId": "player_henry_sletsjøe_20250327113529",
                            "teamId": "10",
                            "isStarter": true,
                            "position": "6",
                            "substitutedInAt": null,
                            "substitutedOutAt": null,
                            "player": null,
                            "lineup": null,
                            "team": null,
                            "ratings": [
                                {
                                    "id": "deefe0d6-13a1-4ee0-9666-300b820fad97",
                                    "matchPlayerId": "093b27d6-88d6-48b2-986f-577e1bb3aca4",
                                    "userId": "wangen93@gmail.com",
                                    "score": 4,
                                    "createdAt": "2025-03-29T06:44:04.817627Z",
                                    "matchPlayer": null
                                }
                            ],
                            "averageRating": 4
                        }
                    ],
                    "createdAt": "2025-03-29T06:44:02.21772Z",
                    "updatedAt": "2025-03-29T06:44:02.21772Z",
                    "team": null,
                    "match": null
                },
                "referee": null
            }
        ]
    };

    export async function fetchMatchRatings() {
        try {
            const response = await fetch('https://norskball-backend.onrender.com/api/matches/ratings');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Return mock data if the response is empty or has no items
            if (!data || !data.items || data.items.length === 0) {
                return mockData;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching match ratings:', error);
            return mockData;
        }
    } 