function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        toast("Uzupełnij email i hasło");
        return;
    }

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
            localStorage.setItem("user", JSON.stringify(user));
            updateNavbar();
            toast("Zalogowano 🎉");
            navigate("home");
        })
        .catch(() => toast("Błędny email lub hasło"));
}


function logout() {
    localStorage.removeItem("user");
    updateNavbar();
    toast("Wylogowano");
    navigate("home");
}



function register() {
    const email = document.getElementById("regEmail").value.trim();
    const pass1 = document.getElementById("regPassword").value;
    const pass2 = document.getElementById("regPassword2").value;

    if (!email || !pass1 || !pass2) {
        toast("Uzupełnij wszystkie pola");
        return;
    }

    if (pass1.length < 6) {
        toast("Hasło musi mieć min. 6 znaków");
        return;
    }

    if (pass1 !== pass2) {
        toast("Hasła nie są takie same");
        return;
    }

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


