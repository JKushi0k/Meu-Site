document.addEventListener('DOMContentLoaded', () => {
    // Expansão da sidebar com svg (media quiries de 960px)
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-icon');
    

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('change');
    });

    // Aparecer e desaparecer a div
    document.getElementById('userImage').addEventListener('click', function(){
        let userInfo = document.getElementById('userInfo')
        if (userInfo.classList.contains('hidden')) {
            userInfo.classList.remove('hidden')
            userInfo.classList.remove('hide')
            userInfo.classList.add('show')
        } else {
            userInfo.classList.remove('show')
            userInfo.classList.add('hide')

            // Aguarda o término da animação para esconder a div
            userInfo.addEventListener('animationend', function(){
                userInfo.classList.add('hidden')
            }, {once: true})
        }
    })

    // Expansão da sidebar com svg (tela completa)
    // Seleciona os itens clicado 
    let menuItem = document.querySelectorAll('.item-menu')

    function selectLink() {
        menuItem.forEach((item) => 
            item.classList.remove('ativo')
        )
        this.classList.add('ativo')
    }

    menuItem.forEach((item) =>
        item.addEventListener('click', selectLink)
    )

    // Expandir a sidebar
    let btnExpandir = document.getElementById('btn-expandir')
    
    btnExpandir.addEventListener('click', function() {
        sidebar.classList.toggle('expandir')
    })

    // Verificar a quantidade de inscritos
    const API_KEY           = ''
    const CHANNEL_ID        = 'UCEu8sLYdIu4WRozw-Pdt4mA'

    async function getSubscribers() {
        try {
            const response    = await fetch (`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`)
            const data        = await response.json()

            if (data.items && data.items.length > 0) {
                const subscribers = parseInt(data.items[0].statistics.subscriberCount, 10)
                return subscribers
            } else {
                throw new Error('Não foi possível obter os incritos.');
            }
            
        } catch (error) {
            return null
        }
    }

    async function upadateTextColor() {
        const subscribers = await getSubscribers()
        const textElement = document.querySelectorAll('.subscriber-text')

        if (subscribers == null) {
            textElement.forEach(element => {
                element.style.color = 'gray'
                element.innerHTML   = 'Erro ao obter inscritos'
            })            
            return
        }

        let nextTarget = null

        // Itera sobre cada elemento de texto
        textElement.forEach(element => {
            // Extrai o número de inscritos mencionado no HTML
            const textContent          = element.textContent || element.innerHTML
            const mentionedSubscribers = parseInt(textContent.match(/\d+/)[0], 10) // Extrai o primeiro número que aparecer

            if (mentionedSubscribers > subscribers && (nextTarget == null || mentionedSubscribers < nextTarget)) {
                nextTarget = mentionedSubscribers // Define o próximo alvo de inscritos
            }

            if (mentionedSubscribers > subscribers) {
                element.style.color = '#FF3131'
            }else if (mentionedSubscribers == subscribers) {
                element.style.color = '#5271FF'
            }else {
                element.style.color = '#C1FF72'
            }
        })

        // Aplica a cor azul ao próximo alvo de inscritos
        if (nextTarget !== null) {
            textElement.forEach(element => {
                const textContent = element.textContent || element.innerHTML
                const mentionedSubscribers = parseInt(textContent.match(/\d+/)[0], 10)

                if (mentionedSubscribers == nextTarget) {
                    element.style.color = '#5271FF'
                }
            })
        }
    }

    upadateTextColor()

    // Adicionar comentario da input no div
    function toAddCommentary() {
        let commentary = document.getElementById('commentary').value

        // Verifica se o input não está vazio
        if (commentary.trim() !== '') {  
            // Atualiza o conteúdo da div com o comentário
            document.getElementById('divCommentary').textContent = commentary

            // Limpa o input após adicionar o comentário
            document.getElementById('commentary').value = ''
        }
    }

    // Adicionar o evento de clique ao botão
    document.getElementById('addCommentary').addEventListener('click', toAddCommentary)

    // Adicionar o envento de pressionar a tecla Enter no input
    document.getElementById('divCommentary').addEventListener('keypress', function(event){
        if (event.key == 'Enter') {
            event.preventDefault() // Impede o comportamento padrão de envio do formulário
            toAddCommentary() // Chama a função para adicionar o comentário
        }
    })
})