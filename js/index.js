document.addEventListener('DOMContentLoaded', () => {
    // Expansão com sidebar com svg
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-icon');
    

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('change');
    });
})