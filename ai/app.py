from flask import Flask, request, jsonify
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)
# [age, heures_par_semaine, preference (1=solo, 2=multi), plateforme (1=mobile, 2=PC, 3=console)]
X = [
    [16, 20, 2, 2],  # FPS
    [20, 15, 2, 2],  # FPS
    [25, 10, 2, 3],  # Sport
    [30, 5,  2, 3],  # Sport
    [25, 20, 1, 2],  # RPG
    [30, 15, 1, 2],  # RPG
    [35, 10, 1, 2],  # Stratégie
    [40, 8,  1, 2],  # Stratégie
    [32, 45, 1, 2],  # Stratégie ← nouveau
    [35, 40, 1, 2],  # Stratégie ← nouveau
    [20, 5,  1, 1],  # Casual
    [35, 3,  1, 1],  # Casual
    [18, 25, 1, 3],  # Aventure
    [22, 20, 1, 3],  # Aventure
]
y = [
    "FPS", "FPS",
    "Sport", "Sport",
    "RPG", "RPG",
    "Stratégie", "Stratégie",
    "Stratégie", "Stratégie",  # ← nouveau
    "Casual", "Casual",
    "Aventure", "Aventure"
]

model = DecisionTreeClassifier()
model.fit(X, y)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    age = data.get("age", 20)
    heures = data.get("heures_par_semaine", 5)
    preference = 1 if data.get("preference") == "solo" else 2
    plateforme = {"mobile": 1, "PC": 2, "console": 3}.get(data.get("plateforme"), 2)
    proba = model.predict([[age, heures, preference, plateforme]])
    return jsonify({"genre_ia": proba[0],
                    "confiance": max(proba[0])
                    })
if __name__ == "__main__":
    app.run(port=5000)