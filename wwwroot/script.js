(function () {

  var sidebarEl = document.getElementById('sidebar');
  var overlayEl = document.getElementById('overlay');
  var mainWrapperEl = document.getElementById('mainWrapper');
  var isMobile = function () { return window.innerWidth <= 768; };
  var sidebarCollapsed = false;

  function openSidebar() {
    sidebarEl.classList.add('sidebar-open');
    overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebarEl.classList.remove('sidebar-open');
    overlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (isMobile()) {
      if (sidebarEl.classList.contains('sidebar-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    } else {
      sidebarCollapsed = !sidebarCollapsed;
      if (sidebarCollapsed) {
        sidebarEl.classList.add('collapsed');
        mainWrapperEl.classList.add('expanded');
        document.querySelectorAll('.nav-item.open').forEach(function (el) {
          el.classList.remove('open');
        });
      } else {
        sidebarEl.classList.remove('collapsed');
        mainWrapperEl.classList.remove('expanded');
      }
    }
  }

  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;
  window.toggleSidebar = toggleSidebar;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      closeSidebar();
    }
  });


    window.toggleDropdown = function (itemId, event) {
        if (event) event.stopPropagation();
        if (sidebarCollapsed && !isMobile()) return;
        var item = document.getElementById(itemId);
        item.classList.toggle('open');
        let openMenus = JSON.parse(localStorage.getItem('openMenus')) || [];
        if (item.classList.contains('open')) {
            if (!openMenus.includes(itemId)) {
                openMenus.push(itemId);
            }
        } else {
            openMenus = openMenus.filter(id => id !== itemId);
        }
        localStorage.setItem('openMenus', JSON.stringify(openMenus));
    };
    document.addEventListener("DOMContentLoaded", function () {
        let openMenus = JSON.parse(localStorage.getItem('openMenus')) || [];

        openMenus.forEach(function (id) {
            let el = document.getElementById(id);
            if (el) {
                el.classList.add('open');
            }
        });
    });

    window.setActive = function (itemId, event) {
        if (event) event.preventDefault();

        localStorage.setItem("activeMenu", itemId);

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.getElementById(itemId).classList.add('active');
    };

    document.addEventListener("DOMContentLoaded", function () {
        let activeMenu = localStorage.getItem("activeMenu");
        if (activeMenu) {
            let el = document.getElementById(activeMenu);
            if (el) el.classList.add("active");
        }
    });


  window.handleLogout = function () {
    if (confirm('Are you sure you want to log out?')) {      
        window.location.href ="/Account/Login"
    }
  };
   document.getElementById('nav-dashboard').classList.add('active');


})();
