// Pokazuje loader
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

// Ukrywa loader
function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

// Nawigacja między widokami
function navigate(view) {
    showLoader();

    // Pobranie widoku HTML
    fetch(`/views/${view}.html`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(html => {

            // Wstawienie widoku do aplikacji
            const app = document.getElementById("app");
            app.innerHTML = `<div class="view">${html}</div>`;

            updateNavbar();
            location.hash = view;

            // Załadowanie logiki widoku
            if (view === "screenings") loadScreenings();
            if (view === "seats") loadSeats();
            if (view === "account") loadAccount();
            if (view === "admin") loadAdmin();
            if (view === "success") loadSuccess();
        })
        .finally(hideLoader);
}

// Aktualizacja linków w navbarze
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    const show = id => document.getElementById(id).style.display = "inline";
    const hide = id => document.getElementById(id).style.display = "none";

    // Widok dla gościa
    if (!user) {
        show("loginLink");
        show("registerLink");
        show("guestSearchLink");

        hide("accountLink");
        hide("adminLink");
        hide("logoutLink");
    }
    // Widok dla zalogowanego
    else {
        hide("loginLink");
        hide("registerLink");
        hide("guestSearchLink");

        show("logoutLink");

        // Widok admina
        if (user.role === "ADMIN") {
            show("adminLink");
            hide("accountLink");
        }
        // Widok użytkownika
        else {
            show("accountLink");
            hide("adminLink");
        }
    }
}

// Pokazuje loader
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

// Ukrywa loader
function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

// Nawigacja (wersja uproszczona)
function navigate(view) {
    showLoader();

    fetch(`/views/${view}.html`)
        .then(r => r.text())
        .then(html => {

            // Wstawienie widoku
            const app = document.getElementById("app");
            app.innerHTML = `<div class="view">${html}</div>`;
            location.hash = view;

            hideLoader();

            // Logika widoku
            if (view === "screenings") loadScreenings();
            if (view === "seats") loadSeats();
            if (view === "account") loadAccount();
            if (view === "admin") loadAdmin();
            if (view === "success") loadSuccess();
        });
}

// Start aplikacji
document.addEventListener("DOMContentLoaded", () => {
    let view = location.hash.replace("#", "");
    if (!view) view = "home";

    navigate(view);
    updateNavbar();
});

// Reakcja na zmianę hash
window.addEventListener("hashchange", () => {
    let view = location.hash.replace("#", "");
    if (!view) view = "home";
    navigate(view);
});

// Wyświetla komunikat toast
function toast(message) {
    const t = document.getElementById("toast");
    t.innerText = message;
    t.classList.remove("hidden");

    setTimeout(() => {
        t.classList.add("hidden");
    }, 3000);
}

// Pobiera użytkownika
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

// Sprawdza czy użytkownik jest zalogowany
function isLoggedIn() {
    return !!getUser();
}

// Sprawdza czy użytkownik jest adminem
function isAdmin() {
    const u = getUser();
    return u && u.role === "ADMIN";
}
