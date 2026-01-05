/* ================= LOADER ================= */
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

/* ================= NAVIGACJA ================= */
function navigate(view) {
    showLoader();

    fetch(`/views/${view}.html`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.text();
        })
        .then(html => {
            const app = document.getElementById("app");
            app.innerHTML = `<div class="view">${html}</div>`;
            updateNavbar();
            location.hash = view;

            if (view === "screenings") loadScreenings();
            if (view === "seats") loadSeats();
            if (view === "account") loadAccount();
            if (view === "admin") loadAdmin();
            if (view === "success") loadSuccess();

        })
        .finally(hideLoader);
}

/* ================= NAVBAR LOGIKA ================= */
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    const show = id => document.getElementById(id).style.display = "inline";
    const hide = id => document.getElementById(id).style.display = "none";

    if (!user) {
        show("loginLink");
        show("registerLink");
        show("guestSearchLink");

        hide("accountLink");
        hide("adminLink");
        hide("logoutLink");
    } else {
        hide("loginLink");
        hide("registerLink");
        hide("guestSearchLink");

        show("logoutLink");

        if (user.role === "ADMIN") {
            show("adminLink");
            hide("accountLink");
        } else {
            show("accountLink");
            hide("adminLink");
        }
    }
}



function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

function navigate(view) {
    showLoader();

    fetch(`/views/${view}.html`)
        .then(r => r.text())
        .then(html => {
            const app = document.getElementById("app");
            app.innerHTML = `<div class="view">${html}</div>`;
            location.hash = view;

            hideLoader();

            if (view === "screenings") loadScreenings();
            if (view === "seats") loadSeats();
            if (view === "account") loadAccount();
            if (view === "admin") loadAdmin();
            if (view === "success") loadSuccess();
        });
}

/* ===== START APLIKACJI ===== */
document.addEventListener("DOMContentLoaded", () => {
    let view = location.hash.replace("#", "");

    // ✅ DOMYŚLNIE HOME
    if (!view) view = "home";

    navigate(view);
    updateNavbar();
});

/* ===== OBSŁUGA BACK ===== */
window.addEventListener("hashchange", () => {
    let view = location.hash.replace("#", "");
    if (!view) view = "home";
    navigate(view);
});

/* ===== TOAST ===== */
function toast(message) {
    const t = document.getElementById("toast");
    t.innerText = message;
    t.classList.remove("hidden");

    setTimeout(() => {
        t.classList.add("hidden");
    }, 3000);
}


/* ================= TOAST ================= */
function toast(message) {
    const t = document.getElementById("toast");
    t.innerText = message;
    t.classList.remove("hidden");

    setTimeout(() => {
        t.classList.add("hidden");
    }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function isLoggedIn() {
    return !!getUser();
}

function isAdmin() {
    const u = getUser();
    return u && u.role === "ADMIN";
}
