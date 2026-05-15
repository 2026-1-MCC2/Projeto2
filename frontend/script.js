const API_URL = 'http://localhost:3000/api';
const BASE_URL = 'http://localhost:3000';

// Variáveis globais carregadas do navegador
let token = localStorage.getItem('alim_token');
let currentUser = JSON.parse(localStorage.getItem('alim_user'));

// --- FUNÇÃO DE VERIFICAÇÃO GLOBAL ---
// Essa função roda em TODAS as páginas para manter o usuário logado visualmente
function verificarEstadoLogin() {
    const btnPortal = document.getElementById('btn-portal');
    const dashName = document.getElementById('dash-name');
    const dashEmail = document.getElementById('dash-email');
    const painelFornecedor = document.getElementById('painel-fornecedor');

    if (token && currentUser) {
        // Se houver token, altera o botão do cabeçalho em qualquer página
        if (btnPortal) {
            btnPortal.textContent = 'Meu Perfil';
            // Se estiver na index (que usa goToPage), manda para o dashboard
            // Se estiver em páginas externas, o link natural do HTML já resolve
        }

        // Se estiver na página de Dashboard (Perfil)
        if (dashName) dashName.textContent = currentUser.name;
        if (dashEmail) dashEmail.textContent = currentUser.email;

        // Se for fornecedor, mostra as ferramentas de venda
        if (currentUser.role === 'fornecedor' && painelFornecedor) {
            painelFornecedor.classList.remove('hidden');
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
            localStorage.setItem('alim_token', 'mock-token-jwt'); // Simulação de token
            localStorage.setItem('alim_user', JSON.stringify(data.user));
            
            // Recarrega para aplicar as mudanças
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