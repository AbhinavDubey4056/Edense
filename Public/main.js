document.addEventListener('DOMContentLoaded', () => {
    const domainList = document.getElementById('domain-list');
    const contentTitle = document.getElementById('content-title');
    const linksContainer = document.getElementById('links-container');

    // Fetch domains and links from the backend
    async function fetchDomainsAndLinks() {
        try {
            const response = await fetch('/api/domains');
            const data = await response.json();
            renderDomains(data);
            if (Object.keys(data).length > 0) {
                // Automatically display links for the first domain on load
                const firstDomainKey = Object.keys(data)[0];
                renderLinks(data, firstDomainKey);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            contentTitle.textContent = 'Error Loading Data';
            linksContainer.innerHTML = '<p class="text-gray-500">Could not connect to the server. Please try again later.</p>';
        }
    }

    // Function to render the domain list
    function renderDomains(data) {
        domainList.innerHTML = '';
        for (const key in data) {
            const domain = data[key];
            const li = document.createElement('li');
            li.innerHTML = `
                <button data-domain="${key}" class="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span class="font-medium text-gray-700">${domain.name}</span>
                </button>
            `;
            domainList.appendChild(li);
        }

        // Attach event listeners to the new buttons
        domainList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const domainKey = button.getAttribute('data-domain');
                renderLinks(data, domainKey);
            });
        });
    }

    // Function to render links for a specific domain
    function renderLinks(data, domainKey) {
        const domain = data[domainKey];
        if (!domain) {
            contentTitle.textContent = 'Domain Not Found';
            linksContainer.innerHTML = `<p class="text-gray-500">The selected domain does not exist.</p>`;
            return;
        }

        contentTitle.textContent = domain.name;
        linksContainer.innerHTML = '';

        if (domain.links.length === 0) {
            linksContainer.innerHTML = `<p class="text-gray-500">No links available for this domain yet.</p>`;
        } else {
            domain.links.forEach(link => {
                const linkItem = document.createElement('div');
                linkItem.className = 'bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow';
                linkItem.innerHTML = `
                    <a href="${link.url}" target="_blank" class="text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition-colors block">
                        ${link.title}
                    </a>
                    <p class="text-sm text-gray-500 truncate mt-1">${link.url}</p>
                `;
                linksContainer.appendChild(linkItem);
            });
        }
    }

    fetchDomainsAndLinks();
});

