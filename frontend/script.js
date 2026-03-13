document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const msgErro = document.getElementById('msg-erro');

    // Simulação de autenticação
    if (email === "admin@alimconect.com" && password === "123456") {
        alert("Login realizado com sucesso! Redirecionando para o Dashboard...");
        msgErro.textContent = "";
        // window.location.href = "dashboard.html"; // Exemplo de redirecionamento
    } else {
        msgErro.textContent = "Usuário ou senha inválidos. Tente novamente.";
    }
});