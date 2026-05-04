document.querySelectorAll('.options').forEach(group => {
    group.querySelectorAll('.opt').forEach(opt => {
        opt.onclick = () => {
            group.querySelectorAll('.opt').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        }
    });
});

async function recommend() {
    const plateforme = document.querySelector('#plateforme .active')?.dataset.val;
    const preference = document.querySelector('#preference .active')?.dataset.val;
    const age = parseInt(document.getElementById('age').value);
    const heures = parseInt(document.getElementById('heures').value);
    const err = document.getElementById('err');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    if (!plateforme || !preference) {
        err.classList.add('show');
        return;
    }
    err.classList.remove('show');
    result.classList.remove('show');
    loading.classList.add('show');

    try {
        const res = await fetch('http://localhost:3000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plateforme, preference, age, heures_par_semaine: heures })
        });
        const data = await res.json();
        const config = data.config || {};
        document.getElementById('genre-out').textContent = config.genre || config.genre_ia || '—';
        document.getElementById('exemple-out').textContent = config.exemple ? 'Ex: ' + config.exemple : '';
        document.getElementById('tag-rules').textContent = 'RÈGLES: ' + (config.genre || '—');
        document.getElementById('tag-ia').textContent = 'IA: ' + (config.genre_ia || '—');
        result.classList.add('show');
    } catch (e) {
        err.textContent = 'Serveur non disponible. Lance node index.js et model_api.py.';
        err.classList.add('show');
    } finally {
        loading.classList.remove('show');
    }
}