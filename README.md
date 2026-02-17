# SmartTasker Setup & Running Guide

## Prerequisites
- Node.js & npm
- Python 3.10+

## 1. AI Service (Python)
The AI service runs on port **8000**.

1. Navigate to the directory:
   ```powershell
   cd ai-service
   ```
2. Activate Virtual Environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Install Dependencies (if not already done):
   ```powershell
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```
4. **Start the Service:**
   (Use `python -m` to avoid path issues)
   ```powershell
   python -m uvicorn main:app --reload --port 8000
   ```
   *You should see: `Uvicorn running on http://127.0.0.1:8000`*

## 2. Backend Server (Node.js)
The Express server runs on port **5000**.

1. Navigate to the directory:
   ```powershell
   cd server
   ```
2. Install Dependencies (if not already done):
   ```powershell
   npm install
   ```
3. **Start the Server:**
   ```powershell
   npm run dev
   ```
   *You should see: `Server running in development mode on port 5000`*
   *And: `MongoDB Connected successfully`*

## 3. Testing the Integration
You can test the AI Task Generation feature using PowerShell:

```powershell
$body = @{ text = "Buy milk tomorrow and finish the report by Friday" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/tasks/generate" -Method Post -Body $body -ContentType "application/json"
```

Expected Output:
```json
{
    "tasks": [
        {
            "title": "Buy milk",
            "due_date": "2026-02-18T...",
            "priority": "Low"
        },
        {
            "title": "finish the report",
            "due_date": "2026-02-21T...",
            "priority": "High"
        }
    ]
}
```
