document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    hamburgerMenu.addEventListener('click', function() {
        toggleSidebar();
    });
    
    sidebarOverlay.addEventListener('click', function() {
        closeSidebar();
    });
    
    const menuItems = document.querySelectorAll('.sidebar-menu-item-link');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 1000) {
                closeSidebar();
            }
        });
    });
    
    function toggleSidebar() {
        hamburgerMenu.classList.toggle('active');
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    function closeSidebar() {
        hamburgerMenu.classList.remove('active');
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1000) {
            closeSidebar();
        }
    });
});
