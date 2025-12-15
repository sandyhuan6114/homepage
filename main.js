const repoNameMapping = {
  financial_valuation: "成本計算",
  "shift-scheduler": "輪休表製作",
};

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("app-grid");
  const username = "sandyhuan6114";
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const repos = await response.json();

    // Filter for repos with pages and exclude current homepage
    const validRepos = repos.filter(
      (repo) => repo.has_pages && repo.name.toLowerCase() !== "homepage"
    );

    // Clear loading state
    grid.innerHTML = "";

    if (validRepos.length === 0) {
      grid.innerHTML = '<p class="loading-state">找不到任何工具。</p>';
      return;
    }

    // Render cards
    validRepos.forEach((repo, index) => {
      const card = createCard(repo, index);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error:", error);
    grid.innerHTML = `
            <div class="loading-state">
                <p>無法載入工具。</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--accent-color);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                ">重試</button>
            </div>
        `;
  }
});

function createCard(repo, index) {
  const card = document.createElement("a");
  card.href = `https://${repo.owner.login}.github.io/${repo.name}/`;
  card.className = "tool-card";
  card.style.animationDelay = `${index * 100}ms`; // Staggered animation

  // Use mapped name if available, otherwise format the repo name
  let displayName = repoNameMapping[repo.name];

  if (!displayName) {
    displayName = repo.name
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const description = repo.description || "點擊此處使用此工具。";

  card.innerHTML = `
        <div class="card-title">
            ${displayName}
            <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
        </div>
        <p class="card-desc">${description}</p>
        <div class="card-footer">
            開啟工具
        </div>
    `;

  return card;
}
