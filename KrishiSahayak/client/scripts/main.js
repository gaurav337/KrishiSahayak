document.addEventListener('DOMContentLoaded', () => {

    // ---------- HTML Partial Loading Logic ----------
    const loadHTML = (filePath, elementId) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                document.getElementById(elementId).innerHTML = `<p class="text-red-500 text-center">Error loading content.</p>`;
            });
    };

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.remove('text-gray-600', 'font-medium');
                link.classList.add('text-green-600', 'font-bold');
            }
        });
    };

    loadHTML('components/navbar.html', 'navbar-placeholder')
        .then(() => {
            setActiveNavLink();
        })
        .then(() => {
            return loadHTML('components/footer.html', 'footer-placeholder');
        });

    // ---------- Authentication UI Logic ----------
    const registerTab = document.getElementById('register-tab');
    const loginTab = document.getElementById('login-tab');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authError = document.getElementById('auth-error');

    const showRegisterForm = () => {
        registerTab.classList.add('text-green-600', 'border-green-600', 'font-semibold');
        registerTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        loginTab.classList.add('text-gray-500', 'border-transparent', 'font-medium');
        loginTab.classList.remove('text-green-600', 'border-green-600', 'font-semibold');

        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        authError.textContent = '';
    };

    const showLoginForm = () => {
        loginTab.classList.add('text-green-600', 'border-green-600', 'font-semibold');
        loginTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        registerTab.classList.add('text-gray-500', 'border-transparent', 'font-medium');
        registerTab.classList.remove('text-green-600', 'border-green-600', 'font-semibold');

        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authError.textContent = '';
    };

    if (registerTab) registerTab.addEventListener('click', showRegisterForm);
    if (loginTab) loginTab.addEventListener('click', showLoginForm);

    // ---------- Firebase Authentication Logic ----------
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const auth = firebase.auth();

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                authError.textContent = '';

                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const name = document.getElementById('register-name').value;

                if (!name) {
                    authError.textContent = "Please enter your full name.";
                    return;
                }

                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('User registered:', userCredential.user);
                        window.location.href = '/dashboard.html';
                    })
                    .catch((error) => {
                        console.error('Registration Error:', error);
                        authError.textContent = error.message;
                    });
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                authError.textContent = '';

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log('User logged in:', userCredential.user);
                        window.location.href = '/dashboard.html';
                    })
                    .catch((error) => {
                        console.error('Login Error:', error);
                        authError.textContent = "Failed to login. Please check your email and password.";
                    });
            });
        }

    } else {
        console.error("Firebase is not initialized. Please check your config.");
    }

});
