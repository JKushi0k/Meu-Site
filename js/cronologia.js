document.addEventListener("DOMContentLoaded", () => {
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

    // Cronologia dos Jogos
    const apiKey = ''
    const channelId = 'UCEu8sLYdIu4WRozw-Pdt4mA'

    const cacheKey = 'youtubePlaylistCache'
    const cacheExpiratonMs = 60 * 60 * 1000 // 1 hora

    // Função para buscar as playlists do canal
    async function obterPlaylistsDoCanal() {
        const cachedData = localStorage.getItem(cacheKey)
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)

        // Verifica se o cache está disponível e ainda é válido
        if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < cacheExpiratonMs)) {
            console.log('Usando dados do cache.')
            return JSON.parse(cachedData);
        }

        try {
            const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=50&key=${apiKey}`

            const response = await fetch(url)
            const data = await response.json()

            if(data.items){
                localStorage.setItem(cacheKey, JSON.stringify(data.items))
                localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())

                return data.items.map(item => ({
                    title: item.snippet.title,
                    id: item.id,
                    thumbnailUrl: item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url :
                                    item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url :
                                    item.snippet.thumbnails.default.url
                }))
            } else {
                console.error("Nenhuma playlist foi obtida")
                return []
            }
        } catch (error) {
            console.error("Erro ao obter playlists:", error)
            return []
        }
    }

    // Ordens cronológicas para os jogos
    const ordensCronologicas = {
        "GTA": ["Gta III"],

        "HOLLOWKNIGHT": ["Hollow Knight"],

        "BATMANARKHAM": ["Batman Arkham Origins"],

        "FARCRY": ["Far Cry Primal"],

        "ASSASSINSCREED": ["Assassin's Creed Odyssey"] 
    }

    // Função para ordens playslists
    function ordenarPlaylists(playlists, ordemCronologica){
        return playlists.sort((a, b) => ordemCronologica.indexOf(a.title) - ordemCronologica.indexOf(b.title))
    }

    // Função para rederizar playslists na página
    function renderizarPlaylists(jogo, playlists) {
        const container = document.getElementById(`${jogo}-playlistsContainer`)

        playlists.forEach(playlist => {
            const div = document.createElement('div')
            div.className = 'playlistItem'
            container.appendChild(div)

            // Cria um link para a playlist
            const link = document.createElement('a')
            link.href = `https://www.youtube.com/embed/videoseries?list=${playlist.id}`
            link.target = '_blank'
            div.appendChild(link)

            // Adiciona o título da playlist
            const title = document.createElement('div')
            title.className = 'playlistTitle'
            title.textContent = playlist.title
            link.appendChild(title)

            // Adiciona a miniatura ao link
            const thumbnail = document.createElement('img')
            thumbnail.src = playlist.thumbnailUrl || 'hqdefault-thumbnail.jpg'
            thumbnail.alt = `Miniatura da playlist ${playlist.title}`
            thumbnail.className = 'playlistThumbnail'
            link.appendChild(thumbnail)
        })
    }

    // Função principal para buscar e renderizar as playlists organizadas
    async function renderizarPlaylistsDoCanal() {
        const playlists = await obterPlaylistsDoCanal()

        for (const jogo in ordensCronologicas) {
            const jogoPlaylists = playlists.filter(playlist => ordensCronologicas[jogo].some(nome => playlist.title.includes(nome)))
            const jogoPlaylistsOrdenadas = ordenarPlaylists(jogoPlaylists, ordensCronologicas[jogo])
            renderizarPlaylists(jogo, jogoPlaylistsOrdenadas)
        }
    }

    // Chama a função principal ao carregar a página
    renderizarPlaylistsDoCanal()
})