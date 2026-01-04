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
    const nav = document.getElementById("navLinks");
    const user = JSON.parse(localStorage.getItem("user"));

    nav.innerHTML = `
        <a onclick="navigate('home')">Home</a>
        <a onclick="navigate('screenings')">Seanse</a>

        ${!user
            ? `
                    <a onclick="navigate('login')">Zaloguj</a>
                    <a onclick="navigate('guest')">Znajdź rezerwację</a>
                  `
            : `
                    <a onclick="navigate('account')">Konto</a>
                    <a onclick="logout()">Wyloguj</a>
                  `
        }
    `;
}

/* ================= START ================= */
window.onload = () => {
    let view = location.hash.replace("#", "");

    // ✅ DOMYŚLNIE HOME
    if (!view) {
        view = "home";
    }

    navigate(view);
};

/* ================= COFANIE ================= */
window.onpopstate = () => {
    let view = location.hash.replace("#", "");
    if (!view) view = "home";
    navigate(view);
};

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
