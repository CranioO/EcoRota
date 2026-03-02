const map = L.map('map').setView([-7.1465795897827835, -34.87337279882474], 13); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const SUPABASE_URL = "https://dmjmkbonnzxahaeiivpc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtam1rYm9ubnp4YWhhZWlpdnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzc5OTcsImV4cCI6MjA4NzYxMzk5N30.Zvju4nY30eK4jMRY0_3tE0C9DJRlRU04PbqvlAw1YT0";


let ListaDePontos = [];

async function buscarPontos() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/pontos_coleta?select=*`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        ListaDePontos = await response.json();
        console.log("Dados carregados com sucesso:", ListaDePontos);
        exibirPontos(ListaDePontos);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

function exibirPontos(pontos) {
    map.eachLayer((layer) => {
        if (layer instanceof L.marker) {
            map.removeLayer(layer);
        }
    });

    const bounds = L.latLngBounds();

    pontos.forEach(ponto => {
        if (ponto.latitude && ponto.longitude) {
            const marcador = L.marker([ponto.latitude, ponto.longitude])
                .addTo(map)
                .bindPopup(`<b>${ponto.nome}</b><br>${ponto.tipo_residuo}`);
            
            bounds.extend([ponto.latitude, ponto.longitude]);
        }
    });

    if (pontos.length > 0) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
}


function filtrar(tipo) {
    if (tipo === 'todos') {
        exibirPontos(ListaDePontos);
    } else {
        const filtrados = ListaDePontos.filter(ponto => {
            const residuo = ponto.tipo_residuo ? ponto.tipo_residuo.toLowerCase() : "";
            return residuo.includes(tipo.toLowerCase());
        });
        exibirPontos(filtrados);
    }
    document.querySelectorAll('.filtros button').forEach(btn => {
        btn.style.backgroundColor = "#2d5a27";
    });
    event.target.style.backgroundColor = "#45a049";
}

buscarPontos();