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
            videos = data.items

            // Verificar se os vídeos foram obtidos corretamente
            if (!data || data.items.length == 0) {
                return
            }

            videos = await Promise.all(data.items.map(async (video) => {
                const videoId = video.id.videoId
                if (!videoId) return null

                try {
                    const duration = await fetchVideoDetails(videoId);
                    const durationInSeconds = parseDuration(duration);
                    return durationInSeconds > 0 && durationInSeconds >= 60 ? video : null;
                } catch (error) {
                    console.error(`Erro ao obter detalhes do vídeo ${videoId}:`, error)
                    return null
                }
            }))

            videos = videos.filter(video => video != null)

            // Armazena os vídeos e a hora atual do cache
            localStorage.setItem('videos', JSON.stringify(videos));
            localStorage.setItem('cacheTime', new Date().getTime());
        
            currentIndex = 0
            displayVideos()
        } catch (error) {
            console.error('Erro ao buscar vídeos:', error)
        }
    } 

    async function fetchVideoDetails(videoId) {
        try {
            const videoDetailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=contentDetails`)
            const videoDetailsData = await videoDetailsResponse.json()
            if (videoDetailsData.items.length == 0) {
                console.error(`Nenhum detalhe encontrado para o vídeo ${videoId}`)
                return 'PT0S';
            }
            return videoDetailsData.items[0]?.contentDetails?.duration || 'PT0S'
        } catch (error) {
            console.error(`Erro ao obter detalhes do vídeo ${videoId}:`, error)
            return 'PT0S'
        }
    }

    function parseDuration(duration) {
        if (!duration) return 0; // Garante que tenha um valor
    
        const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!matches) return 0; // Retorna 0 se não corresponder ao formato esperado
    
        const hours = parseInt(matches[1], 10) || 0;
        const minutes = parseInt(matches[2], 10) || 0;
        const seconds = parseInt(matches[3], 10) || 0;
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    // Função para exibir vídeos em lotes de 10
    function displayVideos() {
        const videoContainer = document.getElementById('videoContainer')

        // Limpar o container antes de adicionar novos vídeos
        videoContainer.innerHTML = ''

        // Carregar o próximo lote de vídeos
        for (let i = currentIndex; i < currentIndex + batchSize && i < videos.length; i++) {
            const video = videos[i]
            const videoId = video.id.videoId
            const videoTitle = video.snippet.title
            const videoThumbnail = video.snippet.thumbnails.high.url // URL da imagem de pré-visualização

            const videoEmbed = `
                <div class="video">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                        <h3>${videoTitle}</h3>
                        <img src="${videoThumbnail}" alt="${videoTitle}">
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
    loadVideos()

    // Criando link Mailto
    document.getElementById('emailSpan').addEventListener('click', function() {
        window.location.href = 'mailto:asta56221@gmail.com'
    })

    document.getElementById('emailSvg').addEventListener('click', function() {
        window.location.href = 'mailto:asta56221@gmail.com'
    })

    // Aparecer redes sociais
    const share = document.getElementById('share')
    let isClicked = false

    // Quando clicar aparecer os links
    function clicked() {
        document.querySelectorAll('.none').forEach(link => {
            link.style.display = "block"
        })
    }

    // Quando clicar sumir os links
    function noClicked() {
        document.querySelectorAll('.none').forEach(link => {
            link.style.display = "none"
        })
    }

    // verifica se foi clicado ou não
    share.addEventListener('click', function() {
        if (isClicked) {
            noClicked()
        } else {
            clicked()
        }
        isClicked = !isClicked 
    })

    // Colocando links na divs
    const youtube = document.getElementById('youtube');

    // Adiciona um evento de clique que redireciona para a URL
    youtube.addEventListener('click', function() {
        window.location.href = 'https://www.youtube.com/channel/UCEu8sLYdIu4WRozw-Pdt4mA'
    })
    
    const discord = document.getElementById('discord')
    discord.addEventListener('click', function() {
        window.location.href = 'https://discord.gg/YxkdseCaQt'
    })

    const instagram = document.getElementById('instagram')
    instagram.addEventListener('click', function() {
        window.location.href = 'https://www.instagram.com/ph.pablogiyuu/'
    })

    const tiktok = document.getElementById('tiktok')
    tiktok.addEventListener('click', function() {
        window.location.href = 'https://www.tiktok.com/@jus_kushi'
    })

    const twitch = document.getElementById('twitch')
    twitch.addEventListener('click', function() {
        window.location.href = 'https://www.twitch.tv/jus_kushi'
    })
})