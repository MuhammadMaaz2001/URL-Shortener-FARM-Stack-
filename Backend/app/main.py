from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from pymongo import MongoClient
from datetime import datetime
import uuid
from fastapi.responses import RedirectResponse 
import socket


app = FastAPI()


origins = [
    "http://localhost", 
    "http://localhost:5173", 
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["link_shortener"]
urls_collection = db["urls"]

# Pydantic Models
class URLRequest(BaseModel):
    original_url: HttpUrl

class URLResponse(BaseModel):
    short_url: str

local_ip = socket.gethostbyname(socket.gethostname())


BASE_URL = f"http://{local_ip}:8000/"
print(BASE_URL)


@app.post("/shorten", response_model=URLResponse)
def shorten_url(url_request: URLRequest):
    
    short_id = str(uuid.uuid4())[:6]  
    original_url = str(url_request.original_url)  

    
    existing_url = urls_collection.find_one({"original_url": original_url})
    if existing_url:
        return {"short_url": BASE_URL + existing_url["short_id"]}

    
    urls_collection.insert_one({
        "original_url": original_url,  
        "short_id": short_id,
        "click_count": 0,
        "created_at": datetime.utcnow()
    })

    return {"short_url": BASE_URL + short_id}



@app.get("/{short_id}")
def redirect_to_url(short_id: str):
    
    url_data = urls_collection.find_one({"short_id": short_id})
    if not url_data:
        raise HTTPException(status_code=404, detail="Short URL not found")
    
    
    urls_collection.update_one(
        {"short_id": short_id},
        {"$inc": {"click_count": 1}}
    )

    
    return RedirectResponse(url=url_data["original_url"])  

@app.get("/urls")
def get_all_urls():
    urls = urls_collection.find({}, {"_id": 0})
    return list(urls)
