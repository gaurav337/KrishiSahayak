// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- AUTHENTICATION UI LOGIC ---

    const registerTab = document.getElementById('register-tab');
    const loginTab = document.getElementById('login-tab');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authError = document.getElementById('auth-error');

    // Function to switch between Register and Login tabs
    const showRegisterForm = () => {
        // Style active tab
        registerTab.classList.add('text-green-600', 'border-green-600', 'font-semibold');
        registerTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        // Style inactive tab
        loginTab.classList.add('text-gray-500', 'border-transparent', 'font-medium');
        loginTab.classList.remove('text-green-600', 'border-green-600', 'font-semibold');
        // Show/hide forms
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        authError.textContent = ''; // Clear any previous errors
    };

    const showLoginForm = () => {
        // Style active tab
        loginTab.classList.add('text-green-600', 'border-green-600', 'font-semibold');
        loginTab.classList.remove('text-gray-500', 'border-transparent', 'font-medium');
        // Style inactive tab
        registerTab.classList.add('text-gray-500', 'border-transparent', 'font-medium');
        registerTab.classList.remove('text-green-600', 'border-green-600', 'font-semibold');
        // Show/hide forms
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        authError.textContent = ''; // Clear any previous errors
    };
    
    // Event listeners for tabs
    if (registerTab) registerTab.addEventListener('click', showRegisterForm);
    if (loginTab) loginTab.addEventListener('click', showLoginForm);

    
    // --- FIREBASE AUTHENTICATION LOGIC ---

    // Ensure Firebase is initialized before using
    if (typeof firebase !== 'undefined' && firebase.auth) {
        const auth = firebase.auth();

        // Registration Logic
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                authError.textContent = ''; // Clear errors

                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const name = document.getElementById('register-name').value; // For future use

                if (!name) {
                    authError.textContent = "Please enter your full name.";
                    return;
                }

                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in 
                        console.log('User registered successfully:', userCredential.user);
                        // Here you could also update the user's profile with their name
                        // userCredential.user.updateProfile({ displayName: name });
                        window.location.href = '/dashboard.html'; // Redirect to dashboard
                    })
                    .catch((error) => {
                        console.error("Registration Error:", error);
                        authError.textContent = error.message;
                    });
            });
        }

        // Login Logic
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                authError.textContent = ''; // Clear errors

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in
                        console.log('User logged in successfully:', userCredential.user);
                        window.location.href = '/dashboard.html'; // Redirect to dashboard
                    })
                    .catch((error) => {
                        console.error("Login Error:", error);
                        authError.textContent = "Failed to login. Please check your email and password.";
                    });
            });
        }

    } else {
        console.error("Firebase is not initialized. Please check your firebase-config.js file and script order.");
    }
});