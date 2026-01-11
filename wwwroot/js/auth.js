// Logowanie użytkownika
function login() {

    // Dane z formularza
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Walidacja pól
    if (!email || !password) {
        toast("Uzupełnij email i hasło");
        return;
    }

    // Wysłanie danych logowania
    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(user => {

            // Zapis użytkownika
            localStorage.setItem("user", JSON.stringify(user));

            updateNavbar();
            toast("Zalogowano 🎉");
            navigate("home");
        })
        .catch(() => toast("Błędny email lub hasło"));
}

// Wylogowanie użytkownika
function logout() {

    // Usunięcie użytkownika
    localStorage.removeItem("user");

    updateNavbar();
    toast("Wylogowano");
    navigate("home");
}

// Rejestracja nowego użytkownika
function register() {

    // Dane z formularza
    const email = document.getElementById("regEmail").value.trim();
    const pass1 = document.getElementById("regPassword").value;
    const pass2 = document.getElementById("regPassword2").value;

    // Sprawdzenie pól
    if (!email || !pass1 || !pass2) {
        toast("Uzupełnij wszystkie pola");
        return;
    }

    // Minimalna długość hasła
    if (pass1.length < 6) {
        toast("Hasło musi mieć min. 6 znaków");
        return;
    }

    // Sprawdzenie zgodności haseł
    if (pass1 !== pass2) {
        toast("Hasła nie są takie same");
        return;
    }

    // Wysłanie danych rejestracji
    fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass1 })
    })
        .then(r => {
            if (!r.ok) throw new Error();
            toast("Konto utworzone 🎉");
            navigate("login");
        })
        .catch(() => toast("Email już istnieje lub błąd rejestracji"));
}
