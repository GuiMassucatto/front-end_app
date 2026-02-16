const API_URL = "https://back-end-app-five.vercel.app/agendamentos";
const tbody = document.getElementById("tbody");

let semanaAtual = 0;

function mudarSemana(numero) {
    semanaAtual = numero;
    carregarAgendamentos();
}

function formatarDiaSemana(dataString) {
    const data = new Date(dataString);
    const dias = [
        "Domingo", "Segunda", "Terça", "Quarta",
        "Quinta", "Sexta", "Sábado"
    ];
    return dias[data.getDay()];
}

function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
}

async function carregarAgendamentos() {
    try {
        const response = await fetch(`${API_URL}?semana=${semanaAtual}`);
        const agendamentos = await response.json();

        tbody.innerHTML = "";

        agendamentos.forEach(ag => {
            const tr = document.createElement("tr");
            const diaSemana = formatarDiaSemana(ag.data);
            const dataFormatada = formatarData(ag.data);

            tr.innerHTML = `
                <td>${diaSemana}</td>
                <td>${dataFormatada}</td>
                <td>${ag.horario}</td>
                <td>
                    <span class="${ag.ocupado ? 'ocupado' : 'disponivel'}">
                        ${ag.ocupado ? 'Ocupado' : 'Disponível'}
                    </span>
                </td>
                <td>
                    ${ag.ocupado
                        ? `
                            <div style="margin-bottom: 0.5rem; font-weight:600;">${ag.nome}</div>
                            <button onclick="liberar(${ag.id})" class="btn-liberar">Liberar</button>
                          `
                        : `
                            <input type="text" placeholder="Seu nome" id="nome-${ag.id}">
                            <button onclick="reservar(${ag.id})" class="btn-reservar">Reservar</button>
                          `
                    }
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:red;">
                    Erro ao carregar dados
                </td>
            </tr>
        `;
    }
}

async function reservar(id) {
    const input = document.getElementById(`nome-${id}`);
    const nome = input.value.trim();

    if (!nome) {
        alert("Digite seu nome!");
        return;
    }

    try {
        await fetch(`${API_URL}/${id}/reservar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome })
        });

        carregarAgendamentos();
    } catch (error) {
        alert("Erro ao reservar.");
    }
}

async function liberar(id) {
    if (!confirm("Deseja realmente liberar este horário?")) return;

    try {
        await fetch(`${API_URL}/${id}/liberar`, {
            method: "PUT"
        });

        carregarAgendamentos();
    } catch (error) {
        alert("Erro ao liberar.");
    }
}

carregarAgendamentos();
