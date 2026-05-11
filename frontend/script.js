const API_URL = 'http://localhost:3000/api';
const BASE_URL = 'http://localhost:3000';

// --- 1. LOGIN (Envia JSON) ---
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
            localStorage.setItem('alim_token', data.token);
            localStorage.setItem('alim_user', JSON.stringify(data.user));
            alert("Bem-vindo ao AlimConnect!");
            window.location.href = "dashboard.html";
        } else {
            if (msgErro) msgErro.textContent = data.error || "E-mail ou senha incorretos.";
        }
    } catch (error) {
        if (msgErro) msgErro.textContent = "Erro ao conectar com o servidor.";
    }
});

// --- 2. CADASTRO (Envia FormData para aceitar FOTO) ---
document.getElementById('register-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const msgErro = document.getElementById('msg-erro-register');
    const formData = new FormData(this); // Pega todos os campos e a imagem automaticamente

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            // DICA: Não defina Headers aqui! O FormData faz isso sozinho.
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Conta criada com sucesso! Faça seu login.");
            window.location.href = "login.html";
        } else {
            if (msgErro) msgErro.textContent = data.error || "Erro ao cadastrar.";
        }
    } catch (error) {
        if (msgErro) msgErro.textContent = "Erro ao conectar com o servidor.";
    }
});

// --- 3. VITRINE DE PRODUTOS ---
async function carregarProdutos() {
    const grid = document.querySelector('.grid-produtos');
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/products`);
        const produtos = await response.json();

        grid.innerHTML = produtos.map(p => {
            const foto = p.img || p.image || 'placeholder.png';
            const urlImagem = foto.startsWith('uploads') ? `${BASE_URL}/${foto}` : `${BASE_URL}/uploads/${foto}`;
            
            return `
                <div class="card-produto">
                    <img src="${urlImagem}" alt="${p.name}" onerror="this.src='assets/placeholder.png'">
                    <h3>${p.name}</h3>
                    <p class="preco">R$ ${p.price}</p>
                    <button onclick="adicionarAoCarrinho(${p.id})">Comprar</button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error("Erro ao carregar produtos.");
    }
}

// --- 4. PERFIL DO USUÁRIO ---
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
        } else if (response.status === 401 || response.status === 403) {
            realizarLogout();
        }
    } catch (error) {
        console.error("Erro ao carregar perfil.");
    }
}

// --- 5. LOGOUT ---
async function realizarLogout() {
    const token = localStorage.getItem('alim_token');
    if (token) {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {});
    }
    localStorage.clear();
    window.location.href = "index.html";
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    carregarPerfil();
});