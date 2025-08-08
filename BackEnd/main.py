from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import os
import re

app = FastAPI(
    title="Yu-Gi-Oh! Deck Builder API",
    description="A FastAPI backend for Yu-Gi-Oh! Deck Builder that interacts with YGOPRODeck API",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



YGOPRODECK_API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php"


# Model for Card data
class Card(BaseModel):
    id: int
    name: str
    fname: Optional[str] = None
    type: str
    desc: str
    atk: Optional[int] = None
    def_: Optional[int] = None
    level: Optional[int] = None
    race: str
    attribute: Optional[str] = None
    card_prices: Optional[List[Dict[str, Any]]] = None 
    link: Optional[int] = None
    scale: Optional[int] = None
    banlist: Optional[str] = None
    staple: Optional[bool] = None
    card_images: List[Dict[str, Any]]
    archetype: Optional[str] = None

# Model for Deck data
class Deck(BaseModel):
    id: Optional[str] = None 
    name: str
    description: Optional[str] = None
    cards: List[int] 
    main_deck: List[int] = []  
    extra_deck: List[int] = [] 
    side_deck: List[int] = [] 
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# Helper function to fetch data from YGOPRODeck API
async def fetch_from_ygoprodeck(endpoint: str = "cardinfo.php", params: Dict = None) -> Dict:
   if params is None:
        params = {}
   async with httpx.AsyncClient() as client:
        try:
            url = f"https://db.ygoprodeck.com/api/v7/{endpoint}"
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=e.response.status_code, 
                               detail=f"Error fetching data from YGOPRODeck API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/cards/{card_id}")
async def get_card_by_id(card_id: str):
    """Get details for a specific Yu-Gi-Oh card by ID"""
    params = {"id": card_id}
    result = await fetch_from_ygoprodeck("cardinfo.php", params)
    if "data" not in result or not result["data"]:
        raise HTTPException(status_code=404, detail=f"Card with ID {card_id} not found")
    return result["data"][0]

@app.get("/cards/name/{card_name}")
async def get_card_by_name(card_name: str):
    """Get details for a specific Yu-Gi-Oh card by name"""
    params = {"name": card_name}
    result = await fetch_from_ygoprodeck("cardinfo.php", params)
    if "data" not in result or not result["data"]:
        raise HTTPException(status_code=404, detail=f"Card with name {card_name} not found")
    return result["data"][0]

@app.get("/cards")
async def get_cards(
    offset: int = Query(0, description="Number of cards to skip"),
    limit: int = Query(20, description="Maximum number of cards to return"),
    sort: Optional[str] = Query(None, description="Sort by field"),
    name: Optional[str] = Query(None, description="Filter cards by name"),
    type: Optional[str] = Query(None, description="Filter cards by type")
):
    """Get a list of Yu-Gi-Oh cards with pagination, sorting, and filtering"""
    params = {
        "offset": offset,
        "num": limit,
    }
    if sort:
        params["sort"] = sort
    if name:
        params["fname"] = name  # Using fname for partial name matching
    if type:
        params["type"] = type
        
    result = await fetch_from_ygoprodeck("cardinfo.php", params)
    if "data" not in result or not result["data"]:
        raise HTTPException(status_code=404, detail="No cards found")
    return result["data"]
