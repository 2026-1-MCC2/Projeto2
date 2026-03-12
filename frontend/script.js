const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Tentando logar com:", email);

    // Futuramente, você fará o fetch() para o seu backend aqui:
    // const resposta = await fetch('http://localhost:3000/login', { ... });
    
    alert("Botão funcionando! Agora falta integrar com seu backend.");
});

