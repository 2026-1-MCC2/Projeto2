const API_URL = 'http://localhost:3000/api';

// --- 1. LOGIN REAL ---
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msgErro = document.getElementById('msg-erro');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        });

        const data = await response.json();

        if (response.ok) {
            // SALVA O JWT E DADOS DO USUÁRIO
            localStorage.setItem('alim_token', data.token);
            localStorage.setItem('alim_user', JSON.stringify(data.user));

            alert(data.message || "Login realizado com sucesso!");
            window.location.href = "dashboard.html";
        } else {
            if (msgErro) msgErro.textContent = data.error || "Credenciais inválidas.";
        }
    } catch (error) {
        if (msgErro) msgErro.textContent = "Erro ao conectar com o servidor.";
    }
});

// --- 2. CARREGAR PRODUTOS (VITRINE) ---
async function carregarProdutos() {
    const grid = document.querySelector('.grid-produtos');
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();

        grid.innerHTML = produtos.map(p => `
            <div class="card-produto">
                <img src="http://localhost:3000/uploads/${p.image}" alt="${p.name}" onerror="this.src='assets/placeholder.png'">
                <h3>${p.name}</h3>
                <p>R$ ${p.price}</p>
                <button onclick="adicionarAoCarrinho(${p.id})">Comprar</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Erro ao carregar produtos do banco.");
    }
}

// --- 3. BUSCAR PERFIL (Resolve o erro do /users/me) ---
async function carregarPerfil() {
    const nomeExibicao = document.getElementById('user-name-display');
    const token = localStorage.getItem('alim_token');

    if (!token || !nomeExibicao) return;

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            nomeExibicao.textContent = user.name;
            // Preenche formulários de edição se existirem
            if (document.getElementById('edit-name')) {
                document.getElementById('edit-name').value = user.name;
            }
        }
    } catch (error) {
        console.error("Erro ao carregar perfil.");
    }
}

// --- 4. DELETAR USUÁRIO (Ajustado com Token) ---
async function deletarConta(id) {
    const token = localStorage.getItem('alim_token');
    if (!confirm("Tem certeza que deseja excluir sua conta permanentemente?")) return;

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (response.ok) {
            alert("Conta removida com sucesso.");
            realizarLogout();
        } else {
            alert(data.error || "Erro ao deletar conta.");
        }
    } catch (error) {
        alert("Erro na requisição.");
    }
}

// --- 5. RESET DE SENHA ---
async function resetarSenha(email, novaSenha) {
    try {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, novaSenha })
        });
        const data = await response.json();
        alert(data.message || data.error);
    } catch (error) {
        console.error("Erro ao resetar senha");
    }
}

// --- 6. LOGOUT ---
function realizarLogout() {
    localStorage.removeItem('alim_token');
    localStorage.removeItem('alim_user');
    window.location.href = "index.html";
}

// Inicialização baseada na página carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(); // Carrega produtos se houver a grid
    carregarPerfil();   // Carrega perfil se estiver no dashboard
});