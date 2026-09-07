document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        window.location.href = "main.html";
    });
});