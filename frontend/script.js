const API_URL = 'http://localhost:3000/api';
const BASE_URL = 'http://localhost:3000';

// Variáveis globais carregadas do navegador
let token = localStorage.getItem('alim_token');
let currentUser = JSON.parse(localStorage.getItem('alim_user'));

// --- FUNÇÃO DE VERIFICAÇÃO GLOBAL ---
function verificarEstadoLogin() {
    const btnPortal = document.getElementById('btn-portal');
    const dashName = document.getElementById('dash-name');
    const dashEmail = document.getElementById('dash-email');
    const painelFornecedor = document.getElementById('painel-fornecedor');

    // 1. CASO: USUÁRIO LOGADO
    if (token && currentUser) {
        if (btnPortal) {
            btnPortal.textContent = 'Meu Perfil';
            
            // Se estiver em páginas externas, prepara o redirecionamento para o PERFIL
            if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('frontend/')) {
                btnPortal.href = "index.html";
                btnPortal.onclick = () => {
                    localStorage.setItem('comando_abrir_perfil', 'true');
                };
            }
        }

        if (dashName) dashName.textContent = currentUser.name;
        if (dashEmail) dashEmail.textContent = currentUser.email;

        if (currentUser.role === 'fornecedor' && painelFornecedor) {
            painelFornecedor.classList.remove('hidden');
        }
    } 
    // 2. CASO: USUÁRIO DESLOGADO
    else {
        if (btnPortal) {
            btnPortal.textContent = 'Acessar Portal';
            
            // Se estiver fora, prepara o redirecionamento para o LOGIN
            if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('frontend/')) {
                btnPortal.href = "index.html";
                btnPortal.onclick = () => {
                    localStorage.setItem('comando_abrir_login', 'true');
                };
            }
        }
    }
}

// --- LOGIN ---
async function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-password').value; 
    
    if(!email || !senha) return alert('Preencha todos os campos.');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Importante: use o token real vindo do banco (data.token) se já tiver, 
            // ou mantenha o mock se for teste.
            localStorage.setItem('alim_token', data.token || 'mock-token-jwt'); 
            localStorage.setItem('alim_user', JSON.stringify(data.user));
            window.location.href = "index.html"; 
        } else {
            alert(data.error || 'Erro ao entrar.');
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor.');
    }
}

// --- LOGOUT ---
function doLogout() {
    localStorage.removeItem('alim_token');
    localStorage.removeItem('alim_user');
    window.location.href = "index.html";
}

// --- FAVORITOS ---
function atualizarContadorHeader() {
    const favs = JSON.parse(localStorage.getItem('favoritosAlim')) || [];
    const cont = document.getElementById('contador-favoritos');
    if(cont) {
        cont.innerText = favs.length;
        cont.style.display = favs.length > 0 ? 'flex' : 'none';
    }
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    verificarEstadoLogin();
    atualizarContadorHeader();
});

// Tornar funções disponíveis para os botões do HTML
window.doLogin = doLogin;
window.doLogout = doLogout;