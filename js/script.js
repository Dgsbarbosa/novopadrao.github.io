
document.addEventListener('DOMContentLoaded', (event) => {

    // Seu código aqui...

// Seleciona o elemento usando o atributo href
    var element = document.querySelector('a[href="https://elfsight.com/google-reviews-widget/?utm_source=websites&utm_medium=clients&utm_content=google-reviews&utm_term=127.0.0.1&utm_campaign=free-widget"]');

   

    if (element) {
        element.style.border = "20px solid rgb(255, 0, 0)";
        element.style.backgroundColor = "#0082ca";
        element.style.display = "none";
    }


    

});


// Esconde a barra de navegação
document.querySelectorAll('.navbar-nav>li>a').forEach(function(navLink) {
    navLink.addEventListener('click', function() {
        document.querySelector('.navbar-collapse').classList.remove('show');
    });
});


// envio de emails
document.getElementById('myform').addEventListener('submit', function(e) {
    
    // Isso impede que a página seja recarregada
    e.preventDefault();

    

    // Pegar os valores dos campos do formulário
    var nome = document.getElementById('fname').value;
    var email = document.getElementById('email').value;
    var mensagem = document.getElementById('mensagem').value;

    // Verificar se os campos estão vazios
    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Verificar o padrão do email
    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    // Oculta o formulário e mostra o círculo de progresso
    document.getElementById('myform').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    var data = {
        _template: "box",
        _subject: "Novo contato de cliente",
        Nome: nome,
        Email: email,
        Mensagem: mensagem,
    }

    // Envia os dados do formulário como uma solicitação POST usando a API Fetch
    fetch('https://formsubmit.co/ajax/novopadrao.reformas@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Erro na rede!');
        }
        return response.text();
    })
    .then((data) => {
        // Oculta o círculo de progresso e mostra a mensagem de sucesso
        document.getElementById('loading').style.display = 'none';
        document.getElementById('messageSent').style.display = 'block';
        console.log("Mensagem enviada com sucesso")

        // Limpa os campos do formulário
        document.getElementById('fname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensagem').value = '';

        // Mostra o formulário novamente após um tempo
        setTimeout(function() {
            document.getElementById('messageSent').style.display = 'none';
            document.getElementById('myform').style.display = 'block';
        }, 3000); // 3000 milissegundos = 3 segundos
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});
