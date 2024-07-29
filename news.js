const tabsBox = document.querySelector(".tabBar"),
    allTabs = tabsBox.querySelectorAll(".tab"),
    arrowIcons = document.querySelectorAll(".icon i");
const key = 'd5d552d001f646db866b00b801d278c3';
const baseUrl = 'https://api.worldnewsapi.com/search-news?language=en';

const handleIcons = (scrollVal) => {
    let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
    arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
    arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
}

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

async function fetchData(query, retryCount = 0) {
    const url = `${baseUrl}&text=${query}`;
    const maxRetries = 5; // Set a maximum number of retries
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': key
            }
        });

        if (response.status === 429) {
            if (retryCount < maxRetries) {
                console.log(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return fetchData(query, retryCount + 1);
            } else {
                throw new Error('Maximum retry limit reached');
            }
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        fillData(data.news);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function fillData(allData) {
    let container = document.getElementById('main');
    container.innerHTML = "";
    allData.forEach((data) => {
        if (!data.image) return;
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-image">
                <img src="${data.image}" alt="">
            </div>
            <div class="card-content">
                <h3>${data.title}</h3>
                <div class="source"><span>${data.source_country}</span> - ${new Date(data.publish_date).toLocaleString()}</div>
                <div class="description">${data.summary}</div>
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
