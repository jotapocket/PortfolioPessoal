
/* ========================================
   JP.dev — FUNCIONALIDADES
   ======================================== */


/* 1. MENU RESPONSIVO */

const menu = document.getElementById('menu');
const botaoMenu = document.getElementById('menu-toggle');

function fecharMenu() {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    botaoMenu.textContent = '☰';
}

botaoMenu.addEventListener('click', () => {
    const menuAberto = menu.classList.toggle('aberto');

    botaoMenu.setAttribute('aria-expanded', String(menuAberto));
    botaoMenu.setAttribute(
        'aria-label',
        menuAberto ? 'Fechar menu' : 'Abrir menu'
    );

    botaoMenu.textContent = menuAberto ? '✕' : '☰';
});

// Fecha o menu depois que um link é selecionado.
menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
});

// Fecha o menu ao pressionar a tecla Esc.
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        fecharMenu();
        botaoMenu.focus();
    }
});


/* 2. SAUDAÇÃO AUTOMÁTICA */

const saudacao = document.getElementById('saudacao');

function atualizarSaudacao() {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) {
        saudacao.textContent = 'Bom dia! Seja bem-vindo.';
    } else if (hora >= 12 && hora < 18) {
        saudacao.textContent = 'Boa tarde! Seja bem-vindo.';
    } else {
        saudacao.textContent = 'Boa noite! Seja bem-vindo.';
    }
}

atualizarSaudacao();


/* 3. ANO AUTOMÁTICO NO RODAPÉ */

const anoAtual = document.getElementById('ano-atual');

anoAtual.textContent = new Date().getFullYear();


/* 4. VALIDAÇÃO DO FORMULÁRIO */

const formulario = document.getElementById('form-contato');

const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoMensagem = document.getElementById('mensagem');
const campoConsentimento = document.getElementById('consentimento');

const mensagemSucesso = document.getElementById('mensagem-sucesso');

const campos = [
    {
        campo: campoNome,
        erro: document.getElementById('erro-nome')
    },
    {
        campo: campoEmail,
        erro: document.getElementById('erro-email')
    },
    {
        campo: campoMensagem,
        erro: document.getElementById('erro-mensagem')
    },
    {
        campo: campoConsentimento,
        erro: document.getElementById('erro-consentimento')
    }
];

// Relaciona cada campo à sua mensagem de erro.
campos.forEach(({ campo, erro }) => {
    campo.setAttribute('aria-describedby', erro.id);
});

function validarFormulario() {
    let formularioValido = true;
    let primeiroCampoInvalido = null;

    // Limpa os erros da tentativa anterior.
    campos.forEach(({ campo, erro }) => {
        erro.textContent = '';
        campo.removeAttribute('aria-invalid');
    });

    mensagemSucesso.textContent = '';

    // Valida o nome.
    if (campoNome.value.trim() === '') {
        mostrarErro(campoNome, 'erro-nome', 'Digite seu nome.');
    }

    // Valida o e-mail.
    if (campoEmail.value.trim() === '') {
        mostrarErro(campoEmail, 'erro-email', 'Digite seu e-mail.');
    } else if (!campoEmail.validity.valid) {
        mostrarErro(
            campoEmail,
            'erro-email',
            'Digite um endereço de e-mail válido.'
        );
    }

    // Valida o tamanho da mensagem.
    if (campoMensagem.value.trim() === '') {
        mostrarErro(
            campoMensagem,
            'erro-mensagem',
            'Escreva uma mensagem.'
        );
    } else if (campoMensagem.value.trim().length < 20) {
        mostrarErro(
            campoMensagem,
            'erro-mensagem',
            'A mensagem precisa ter pelo menos 20 caracteres.'
        );
    }

    // Verifica o consentimento.
    if (!campoConsentimento.checked) {
        mostrarErro(
            campoConsentimento,
            'erro-consentimento',
            'É necessário concordar para continuar.'
        );
    }

    // Verifica se algum campo recebeu um erro.
    campos.forEach(({ campo, erro }) => {
        if (erro.textContent !== '') {
            formularioValido = false;

            if (!primeiroCampoInvalido) {
                primeiroCampoInvalido = campo;
            }
        }
    });

    // Leva o foco ao primeiro campo que precisa ser corrigido.
    if (!formularioValido) {
        primeiroCampoInvalido.focus();
    }

    return formularioValido;
}

function mostrarErro(campo, idErro, mensagem) {
    const elementoErro = document.getElementById(idErro);

    elementoErro.textContent = mensagem;
    campo.setAttribute('aria-invalid', 'true');
}


/* Envia o formulário ao FormSubmit */

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    const botaoEnviar = formulario.querySelector(
        'button[type="submit"]'
    );

    const textoOriginal = botaoEnviar.textContent;

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = 'Enviando...';
    mensagemSucesso.textContent = '';

    try {
        const resposta = await fetch(formulario.action, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: new FormData(formulario)
        });

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.ok) {
            throw new Error('Não foi possível enviar a mensagem.');
        }

        mensagemSucesso.textContent =
            'Mensagem enviada com sucesso! Obrigado pelo contato.';

        mensagemSucesso.focus();
        formulario.reset();

        campos.forEach(({ campo, erro }) => {
            erro.textContent = '';
            campo.removeAttribute('aria-invalid');
        });

    } catch (erro) {
        mensagemSucesso.textContent =
            'Não foi possível enviar a mensagem. Verifique sua conexão e tente novamente.';
        
        mensagemSucesso.focus();

    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginal;
    }
});

// Limpa o erro de um campo quando o usuário começa a corrigi-lo.
campos.forEach(({ campo, erro }) => {
    campo.addEventListener('input', () => {
        erro.textContent = '';
        campo.removeAttribute('aria-invalid');
        mensagemSucesso.textContent = '';
    });

    campo.addEventListener('change', () => {
        erro.textContent = '';
        campo.removeAttribute('aria-invalid');
        mensagemSucesso.textContent = '';
    });
});
