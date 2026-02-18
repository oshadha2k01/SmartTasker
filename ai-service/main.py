from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import PriorityPredictor, TaskGenerator
from typing import List
import uvicorn

app = FastAPI()
predictor = PriorityPredictor()
generator = TaskGenerator()

class TaskInput(BaseModel):
    description: str

class NaturalLanguageInput(BaseModel):
    text: str

class GeneratedTask(BaseModel):
    title: str
    due_date: str | None
    priority: str

@app.post("/predict-priority")
async def predict(task: TaskInput):
    prediction = predictor.predict(task.description)
    return {"priority": prediction}

@app.post("/generate-tasks", response_model=List[GeneratedTask])
async def generate_tasks_endpoint(input_data: NaturalLanguageInput):
    try:
        tasks = generator.parse_input(input_data.text)
        for task in tasks:
            task['priority'] = predictor.predict(task['title'])
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)