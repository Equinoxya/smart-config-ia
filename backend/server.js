const express = require("express")
const app = express()
app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})
const rules = require("./data/configRules.json")

function findConfig(input) {
    let bestScore = 0;
    let bestResult = null;

    for (let rule of rules) {
        let score = 0;
        for (let key of Object.keys(rule.conditions)) {
            if (input[key] === rule.conditions[key]) {
                score++;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestResult = rule.result;
        }
    }
    return bestResult;
}

app.post("/recommend", async (req, res) => {
    const input = req.body;

    // Normalisation
    const plateformeMap = { "pc": "PC", "mobile": "mobile", "console": "console" };
    const preferenceMap = { "solo": "solo", "multijoueur": "multijoueur" };
    input.plateforme = plateformeMap[input.plateforme?.toLowerCase()] || input.plateforme;
    input.preference = preferenceMap[input.preference?.toLowerCase()] || input.preference;

    // 1. Règles métier
    const config = findConfig(input);

    // 2. Prédiction IA
    const aiResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            age: input.age || 20,
            heures_par_semaine: input.heures_par_semaine || 5,
            preference: input.preference || "solo",
            plateforme: input.plateforme || "PC"
        })
    });
    const aiResult = await aiResponse.json();

    // 3. Fusion
    res.json({
        config: { ...config, ...aiResult },
        explication: "Configuration hybride : règles métier + prédiction IA"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000")
})