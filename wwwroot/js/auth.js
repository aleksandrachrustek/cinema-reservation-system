function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        toast("Uzupełnij wszystkie pola");
        return;
    }

    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })

    })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(user => {
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role
            }));

            updateNavbar();
            navigate("home");
            toast("Zalogowano 🎉");
        })
        .catch(() => {
            toast("Błędny email lub hasło");
        });
}


function logout() {
    localStorage.removeItem("user");
    updateNavbar();
    navigate("home");
}


function register() {
    const email = regEmail.value;
    const pass1 = regPassword.value;
    const pass2 = regPassword2.value;

    if (!email || !pass1 || !pass2) {
        toast("Uzupełnij wszystkie pola");
        return;
    }

    if (pass1 !== pass2) {
        toast("Hasła nie są takie same");
        return;
    }

    fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: pass1
        })

    })
        .then(r => {
            if (!r.ok) throw new Error();
            toast("Konto utworzone 🎉");
            navigate("login");
        })
        .catch(() => toast("Błąd rejestracji"));
}

