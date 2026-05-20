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

// =========================================================================
// NOVO: GERENCIAMENTO DE CATÁLOGO COMPLETO (SISTEMA DO FORNECEDOR)
// =========================================================================

// Carrega os produtos criados pelo próprio fornecedor logado (pendentes e oficiais)
async function carregarMeusProdutos() {
    const container = document.getElementById('grid-meus-produtos');
    if (!container || !currentUser) return;

    try {
        const response = await fetch(`${API_URL}/fornecedor/produtos/${currentUser.id}`);
        const produtos = await response.json();

        if (response.ok && produtos.length > 0) {
            container.innerHTML = produtos.map(prod => {
                // Define uma identificação visual para itens pendentes ou publicados
                const isPendente = prod.status_atual === 'pendente';
                const badgeStatus = isPendente 
                    ? `<span class="bg-amber-100 text-amber-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Em Análise</span>`
                    : `<span class="bg-green-100 text-green-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Publicado</span>`;

                return `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div class="h-36 bg-slate-100 rounded-xl mb-3 overflow-hidden">
                                <img src="${BASE_URL}/uploads/${prod.img}" class="w-full h-full object-cover" onerror="this.src='assets/placeholder.png'">
                            </div>
                            <div class="mb-2">${badgeStatus}</div>
                            <h4 class="font-bold text-slate-800 text-base line-clamp-1">${prod.name}</h4>
                            <p class="text-xs text-slate-500 mt-0.5">R$ ${parseFloat(prod.price).toFixed(2)} | Estoque: ${prod.stock}</p>
                        </div>
                        <button onclick="deletarProduto(${prod.id}, ${isPendente})" class="mt-4 w-full bg-red-50 text-red-600 hover:bg-red-100 text-xs py-2 rounded-xl font-bold transition flex items-center justify-center gap-1">
                            <span class="material-symbols-outlined text-sm">delete</span> Excluir Produto
                        </button>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = `<p class="text-slate-400 text-sm italic py-8 text-center col-span-full">Nenhum produto enviado para este catálogo ainda.</p>`;
        }
    } catch (err) {
        console.error("Erro ao carregar lista de produtos do fornecedor:", err);
    }
}

// Remove o produto selecionado diretamente do site
// Remove o produto selecionado diretamente do site (Individual)
async function deletarProduto(id) {
    if (!confirm("Tem certeza de que deseja deletar permanentemente este snack do sistema?")) return;

    try {
        // Corrigido para bater certinho na rota do backend
        const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Produto excluído do banco com sucesso!");
            if (typeof carregarMeusProdutos === 'function') {
                carregarMeusProdutos(); // Atualiza a aba na hora
            } else {
                window.location.reload();
            }
        } else {
            alert("Ocorreu um problema ao tentar remover o produto.");
        }
    } catch (error) {
        alert("Erro de comunicação com o servidor.");
    }
}
window.deletarProduto = deletarProduto;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    verificarEstadoLogin();
    atualizarContadorHeader();
    carregarMeusProdutos(); // Dispara o carregamento automático da lista do fornecedor
});

// Tornar funções disponíveis para os botões do HTML
window.doLogin = doLogin;
window.doLogout = doLogout;
window.carregarMeusProdutos = carregarMeusProdutos;
window.deletarProduto = deletarProduto;