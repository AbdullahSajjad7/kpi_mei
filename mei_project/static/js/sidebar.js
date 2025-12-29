// Sidebar toggle functionality for responsive design
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Toggle sidebar when hamburger menu is clicked
    hamburgerMenu.addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Close sidebar when overlay is clicked
    sidebarOverlay.addEventListener('click', function() {
        closeSidebar();
    });
    
    // Close sidebar when a menu item is clicked (on mobile)
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
        
        // Prevent body scroll when sidebar is open
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
    
    // Close sidebar when window is resized above 1000px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1000) {
            closeSidebar();
        }
    });
});
