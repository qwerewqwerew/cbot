from fastapi import FastAPI                         # 01
from fastapi.middleware.cors import CORSMiddleware  # 02
from pydantic import BaseModel                      # 03
import requests, os                                 # 04
from dotenv import load_dotenv                      # 05

load_dotenv()                                       # 06
app = FastAPI()                                     # 07

app.add_middleware(                                 # 08
    CORSMiddleware,                                 # 09
    allow_origins=["*"],                            # 10
    allow_methods=["*"],                            # 11
    allow_headers=["*"],                            # 12
)                                                   # 13

class Msg(BaseModel):                               # 14
    text: str                                       # 15

HF_URL = "https://router.huggingface.co/v1/chat/completions" # 16
HF_MODEL = "Qwen/Qwen2.5-72B-Instruct"             # 17

def ask_ai(q: str) -> str:                          # 18
    token = os.getenv("HF_TOKEN")                   # 19
    headers = {"Authorization": f"Bearer {token}"}  # 20
    payload = {                                     # 21
        "model": HF_MODEL,                          # 22
        "messages": [{"role": "user", "content": q}], # 23
        "max_tokens": 300                           # 24
    }                                               # 25
    res = requests.post(HF_URL, headers=headers, json=payload) # 26
    data = res.json()                               # 27
    return data["choices"][0]["message"]["content"] # 28

@app.post("/chat")                                  # 27
def chat(msg: Msg):                                 # 28
    reply = ask_ai(msg.text)                        # 29
    return {"reply": reply}                         # 30