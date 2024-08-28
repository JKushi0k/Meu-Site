document.addEventListener('DOMContentLoaded', () => {
    // Expansão da sidebar com svg (media quiries de 960px)
    const sidebar = document.getElementById('sidebar')
    const menuToggle = document.getElementById('menu-icon')
    

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('change');
    })

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

    

    // Aparecer vídeos do Youtube
    const apiKey    = 'AIzaSyACfwGE-Qb25AUHBp99cv4jNLuwCtYo2y4'
    const channelId = 'UCEu8sLYdIu4WRozw-Pdt4mA'
    const apiUrl    = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50` // Cararegar até 50 vídeos de uma vez para a cache

    let videos = []
    let currentIndex = 0
    const batchSize  = 10 // Número de vídeos a serem exibidos por vez

    // Verifica se o cache está presente e válido (1 hora)
    function isCacheValid() {
        const cacheTime = localStorage.getItem('cacheTime')
        if (!cacheTime) return false

        const now = new Date().getTime()
        return now - cacheTime < 60 * 60 * 1000 // 1 hora em milissegundos
    }

    // Função para buscar vídeos da API
    async function fetchVideos() {
        try {
            const response = await fetch(apiUrl)
            const data = await response.json()
            console.log('Dados da API:', data)
            videos = data.items

            // Verificar se os vídeos foram obtidos corretamente
            if (!videos || videos.length == 0) {
                console.error('Nenhum vídeo encontrado');
                return;
            }

            // Armazena os vídeos e a hora atual do cache
            localStorage.setItem('videos', JSON.stringify(videos))
            localStorage.setItem('cacheTime', new Date().getTime())

            currentIndex = 0
            displayVideos()
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error)
        }
    }

    // Função para exibir vídeos em lotes de 10
    function displayVideos() {
        const videoContainer = document.getElementById('videoContainer')

        if (!videoContainer) {
            console.error('Contêiner de vídeos não encontrado no HTML.');
            return;
        }
        console.log('Exibindo vídeos:', videos.slice(currentIndex, currentIndex + batchSize));

        // Carregar o próximo lote de vídeos
        for (let i = currentIndex; i < currentIndex + batchSize && i < videos.length; i++) {
            const video = videos[i]
            const videoId = video.id.videoId
            const videoTitle = video.snippet.title
            const videoThumbnail = video.snippet.thumbnails.medium.url // URL da imagem de pré-visualização

            const videoEmbed = `
                <div class="video">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <img src="${videoThumbnail}" alt="${videoTitle}">
                        <h3>${videoTitle}</h3>
                    </a>
                </div>
            `
            videoContainer.innerHTML += videoEmbed
        }

        currentIndex += batchSize

        // Esconder o botão "Carregar Mais" se não houver mais vídeos
        if (currentIndex >= videos.length) {
            document.getElementById('loadMore').style.display = 'none'
        }
    }

    // Verifeica o cache e decide se busca da API ou do cache
    function loadVideos() {
        if (isCacheValid()){
            videos = JSON.parse(localStorage.getItem('videos'))
            currentIndex = 0
            displayVideos()
        }else {
            fetchVideos()
        }
    }

    // Event Listener para o botão "Carregar Mais"
    document.getElementById('loadMore').addEventListener('click', displayVideos)

    // Carrega os vídeos ao carregar a página
    document.addEventListener('DOMContentLoaded', loadVideos);
})