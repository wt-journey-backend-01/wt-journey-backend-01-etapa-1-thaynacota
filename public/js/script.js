const menuContainer = document.getElementById("menu");

fetch('/data/lanches.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao carregar o JSON");
        }
        return response.json();
    })
    .then(lanches => {
        lanches.forEach(lanche => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${lanche.imagem}">
                <h2>${lanche.nome}</h2>
                <p>${lanche.ingredientes}</p>
            `;
            menuContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Erro:", error);
        menuContainer.innerHTML = "<p>Não foi possível carregar o cardápio.</p>";
    });
