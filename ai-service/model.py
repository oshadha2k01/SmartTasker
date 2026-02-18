import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import spacy
import dateparser
from datetime import datetime

class PriorityPredictor:
    def __init__(self):
        self.texts = [
            "urgent bug fix", "meeting at 5", "low priority task", "critical server issue", "update docs",
            "exam tomorrow", "buy groceries", "submit project report", "call client immediately", "read book"
        ]
        self.labels = ["High", "Medium", "Low", "High", "Low", "High", "Low", "High", "High", "Low"]
        
        self.vectorizer = CountVectorizer()
        self.model = MultinomialNB()
        X = self.vectorizer.fit_transform(self.texts)
        self.model.fit(X, self.labels)

    def predict(self, description: str):
        if not description: return "Low"
        try:
            X_new = self.vectorizer.transform([description])
            return self.model.predict(X_new)[0]
        except Exception:
            return "Medium" 

class TaskGenerator:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")

    def parse_input(self, text: str):
        doc = self.nlp(text)
        tasks = []
        splits = [sent.text.strip() for sent in doc.sents]
        if len(splits) == 1:
             splits = text.split(' and ')
        
        for part in splits:
            if not part.strip(): continue
            parsed_date = dateparser.parse(part, settings={'PREFER_DATES_FROM': 'future'})
            due_date = parsed_date.isoformat() if parsed_date else None
            title = part.strip()
            
            tasks.append({
                "title": title,
                "due_date": due_date
            })
            
        return tasks