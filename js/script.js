
document.addEventListener('DOMContentLoaded', (event) => {

    escondeBarraDeNavegacao();
    configuraEnvioDeEmails();
    configuraDivDeAtendimento();



});

// Cria uma nova instância do observador
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // Verifica se foi adicionado algum nó
        if (mutation.addedNodes.length) {
            // Tenta selecionar o elemento
            var divToolbar = document.querySelector('.eapps-widget-toolbar');
            var elementoA = document.querySelector('a[href="https://elfsight.com/google-reviews-widget/?utm_source=websites&utm_medium=clients&utm_content=google-reviews&utm_term=127.0.0.1&utm_campaign=free-widget"]');



            // Se o elemento existir, remove
            if (divToolbar) {
                divToolbar.remove();
                // Seleciona os elementos filhos
                var elementoSvg = elementoA.querySelector('svg');
                var divTitle = elementoA.querySelector('[title="Remove Elfsight logo"]');

                // Remove os elementos
                if (elementoSvg) {
                    elementoSvg.remove();
                }

                if (divTitle) {
                    divTitle.remove();
                }
                if (elementoA) {
                    // Muda o href
                    elementoA.href = "#contact"; // substitua "novoLink" pelo seu novo href
                    elementoA.target = "";

                    // Remove todos os estilos


                    // Apaga o texto "Free Google Reviews widget"
                    elementoA.innerHTML = elementoA.innerHTML.replace('Free Google Reviews widget', '<button class="btn btn-primary assessment-button">Solicite um orçamento</button>');

                    elementoA.style.backgroundColor = "black";

                }
            }


        }
    });
});
// Configura o observador
var config = { childList: true, subtree: true };

// Passa o nó alvo e as opções para o observador
observer.observe(document.body, config);





function escondeBarraDeNavegacao() {
    document.querySelectorAll('.navbar-nav>li>a').forEach(function (navLink) {
        navLink.addEventListener('click', function () {
            document.querySelector('.navbar-collapse').classList.remove('show');
        });
    });
}

function configuraEnvioDeEmails() {
    document.getElementById('myform').addEventListener('submit', function (e) {
        e.preventDefault();
        enviaEmail();
    });
}

function enviaEmail() {
    var nome = document.getElementById('fname').value;
    var email = document.getElementById('email-form').value;
    var mensagem = document.getElementById('mensagem').value;

    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    var emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    document.getElementById('myform').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';

    var data = {
        _template: "box",
        _subject: "Novo contato de cliente",
        Nome: nome,
        Email: email,
        Mensagem: mensagem,
    }

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
            var jsonData = JSON.parse(data);
           

            if (jsonData.success == "true") {               

                document.getElementById('loading').style.display = 'none';
                document.getElementById('messageSent').style.display = 'block';
                console.log("Mensagem enviada com sucesso")

                document.getElementById('fname').value = '';
                document.getElementById('email-form').value = '';
                document.getElementById('mensagem').value = '';

                
            }else{
                
                document.getElementById('loading').style.display = 'none';
                document.getElementById('messageNotSent').style.display = 'block';
                console.log("Erro no envio da mensagem")

                document.getElementById('fname').value = '';
                document.getElementById('email-form').value = '';
                document.getElementById('mensagem').value = '';
            }
            setTimeout(function () {
                document.getElementById('messageSent').style.display = 'none';
                document.getElementById('messageNotSent').style.display = 'none';
                document.getElementById('myform').style.display = 'flex';
            }, 3000);
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

function configuraDivDeAtendimento() {
    const atendimento = document.getElementById("atendimento-text");
    const atendimentoHidden = document.getElementById("atendimento-hidden");

    atendimento.addEventListener('click', function (e) {
        e.preventDefault()
        atendimento.style.display = "none"
        atendimentoHidden.style.display = "block"

        setTimeout(function () {
            atendimento.style.display = "block"
            atendimentoHidden.style.display = "none"
        }, 3000);
    });
}

// function verificaElementosForaDaView() {
//     var docWidth = document.documentElement.offsetWidth;
//     [].forEach.call(document.querySelectorAll('*'), function (el) {
//         if (el.offsetWidth > docWidth) {
//             console.log(el);
//         }
//         else {
//             console.log("Nenhum elemento ultrapassando a view");
//         }
//     });
// }