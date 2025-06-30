document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("clickBtn");
    const output = document.getElementById("factOutput");

    const facts = [
        "A dog's nose is like a fingerprint — no two are alike!",
        "Cats sleep for around 70% of their lives!",
        "Rabbits can see behind them without turning their heads!",
        "Goats have rectangular pupils!",
        "Cows have best friends and get stressed when separated!"
    ];

    if (button && output) {
        button.addEventListener("click", function () {
            const randomIndex = Math.floor(Math.random() * facts.length);
            output.textContent = facts[randomIndex];
        });
    }
});
