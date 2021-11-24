export const login = (email, password, done, error) => {
    fetch(`/auth/login`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.status === 'success') {
                done(result.data.token, result.data.name)
            } else {
                error()
            }
        });
};

export const register = (email, password, name, done, error) => {
    fetch(`/auth/register`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        })
        .then((response) => response.json())
        .then((result) => {
            if (result.status === 'success') {
                done(result.data.token, result.data.name)
            } else {
                error()
            }
        }
        );
};

export const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = "/signin";
};