const tabsBox = document.querySelector(".tabBar"),
    allTabs = tabsBox.querySelectorAll(".tab"),
    arrowIcons = document.querySelectorAll(".icon i");
const key = '6c37f50dbe8d4a019b7f8727215bcad4';
const url = 'https://newsapi.org/v2/everything?q=';

const handleIcons = (scrollVal) => {
    let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
    arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
    arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
};

// Initialize scroll position handling
handleIcons(tabsBox.scrollLeft);

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let scrollWidth = tabsBox.scrollLeft += icon.id === "left" ? -340 : 340;
        handleIcons(scrollWidth);
    });
});

allTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const activeTab = tabsBox.querySelector(".active");
        if (activeTab) activeTab.classList.remove("active");
        tab.classList.add("active");
        fetchData(tab.dataset.query);
    });
});

async function fetchData(query) {
    try {
        console.log(`Fetching data for query: ${query}`);
        const response = await fetch(`${url}${query}&apiKey=${key}`);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        console.log(data);
        fillData(data.articles);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function fillData(allData) {
    let container = document.getElementById('main');
    container.innerHTML = "";
    allData.forEach((data) => {
        if (!data.urlToImage) return;
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-image">
                <img src="${data.urlToImage}" alt="">
            </div>
            <div class="card-content">
                <h3>${data.title}</h3>
                <div class="source"><span>${data.source.name}</span> - ${new Date(data.publishedAt).toLocaleString()}</div>
                <div class="description">${data.description}</div>
                <button class="read-button" onclick="openlink('${data.url}')">Read more</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openlink(urlink) {
    window.open(urlink, '_blank');
}

window.addEventListener('load', () => {
    fetchData('India');
});

document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    const activeTab = tabsBox.querySelector(".active");
    if (activeTab) activeTab.classList.remove("active");
    const searchValue = document.getElementById('search-input').value.trim();
    if (!searchValue) return;
    fetchData(searchValue);
});
