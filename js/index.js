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
    const API_KEY           = 'AIzaSyBsSV6moIikzN5vvB_lhPrFW0b_8x2O4f0'
    const CHANNEL_ID        = 'UCEu8sLYdIu4WRozw-Pdt4mA'
    const targetSubscribers = 1000 // número alvo de inscritos

    async function getSubscribers() {
        const response    = await fetch ('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}')
        const data        = await response.json()
        const subscribers = parseInt(data.items[0].statistics.subscriberCount)
        return subscribers
    }

    async function upadateTextColor() {
        const subscribers = await getSubscribers()
        const textElement = document.getElementById('subscriber-text')

        if (subscribers < targetSubscribers) {
            textElement.style.color = 'red'
        }else if (subscribers == targetSubscribers) {
            textElement.style.color = 'blue'
        }else {
            textElement.style.color = 'green'
        }
    }

    upadateTextColor()
})