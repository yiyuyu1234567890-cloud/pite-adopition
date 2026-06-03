const pets = [
  {
    id: 1,
    name: "吴狗",
    type: "cat",
    city: "北京",
    age: "2岁",
    size: "小型",
    trait: "calm",
    gender: "女孩",
    image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=900&q=82",
    tags: ["安静", "亲人", "已绝育"],
    intro: "喜欢窗台和软毯，适合节奏稳定、能给她慢慢熟悉时间的家庭。",
    health: "疫苗完整，体检良好",
  },
  {
    id: 2,
    name: "房旺",
    type: "dog",
    city: "上海",
    age: "1岁",
    size: "中型",
    trait: "playful",
    gender: "男孩",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=82",
    tags: ["活泼", "会坐下", "爱散步"],
    intro: "精力充沛，喜欢球和户外，适合有规律遛狗时间的家庭。",
    health: "已驱虫，疫苗完整",
  },
  {
    id: 3,
    name: "扎牛",
    type: "cat",
    city: "杭州",
    age: "7岁",
    size: "小型",
    trait: "senior",
    gender: "男孩",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=82",
    tags: ["熟龄", "黏人", "稳定"],
    intro: "性格成熟，会主动贴贴，喜欢安静的成人家庭。",
    health: "慢性鼻炎稳定观察中",
  },
  {
    id: 4,
    name: "大王",
    type: "dog",
    city: "北京",
    age: "4岁",
    size: "小型",
    trait: "calm",
    gender: "女孩",
    image: "https://images.unsplash.com/photo-1589137152951-42a9e0b3d8b3?auto=format&fit=crop&w=900&q=82",
    tags: ["安静", "亲狗", "适合公寓"],
    intro: "不爱吵闹，牵引表现好，适合想要温和陪伴的收养人。",
    health: "已绝育，牙齿护理中",
  },
  {
    id: 5,
    name: "小黄",
    type: "cat",
    city: "上海",
    age: "8个月",
    size: "小型",
    trait: "playful",
    gender: "男孩",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=82",
    tags: ["活泼", "好奇", "可二猫"],
    intro: "对玩具和纸箱充满热情，适合愿意陪玩的家庭。",
    health: "疫苗进行中，已驱虫",
  },
  {
    id: 6,
    name: "小满",
    type: "dog",
    city: "杭州",
    age: "6岁",
    size: "大型",
    trait: "senior",
    gender: "女孩",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=82",
    tags: ["熟龄", "温顺", "亲人"],
    intro: "曾经流浪，格外珍惜陪伴，适合有大狗照护经验的家庭。",
    health: "关节需定期保养",
  },
];

const petGrid = document.querySelector("#petGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter");
const favoriteCount = document.querySelector("#favoriteCount");
const petDialog = document.querySelector("#petDialog");
const dialogBody = document.querySelector("#dialogBody");
const favoritesDialog = document.querySelector("#favoritesDialog");
const favoritesList = document.querySelector("#favoritesList");

let activeFilter = "all";
let favorites = new Set(JSON.parse(localStorage.getItem("warmpaw-favorites") || "[]"));

function saveFavorites() {
  localStorage.setItem("warmpaw-favorites", JSON.stringify([...favorites]));
  favoriteCount.textContent = favorites.size;
}

function getFilteredPets() {
  const query = searchInput.value.trim().toLowerCase();
  return pets.filter((pet) => {
    const matchesFilter = activeFilter === "all" || pet.type === activeFilter || pet.trait === activeFilter;
    const haystack = `${pet.name} ${pet.city} ${pet.tags.join(" ")} ${pet.intro}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });
}

function renderPets() {
  const visiblePets = getFilteredPets();
  petGrid.innerHTML = visiblePets
    .map(
      (pet) => `
        <article class="pet-card">
          <div class="pet-photo" style="background-image: url('${pet.image}')">
            <button class="favorite-button" type="button" data-favorite="${pet.id}" aria-label="收藏${pet.name}">
              ${favorites.has(pet.id) ? "♥" : "♡"}
            </button>
          </div>
          <div class="pet-content">
            <div class="pet-meta">
              <span>${pet.city}</span>
              <span>${pet.age} · ${pet.gender}</span>
            </div>
            <h3>${pet.name}</h3>
            <p>${pet.intro}</p>
            <div class="tags">${pet.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
            <button class="card-button" type="button" data-open="${pet.id}">申请收养</button>
          </div>
        </article>
      `,
    )
    .join("");

  if (!visiblePets.length) {
    petGrid.innerHTML = `<div class="empty-state">没有找到匹配的小伙伴</div>`;
  }
}

function openPet(id) {
  const pet = pets.find((item) => item.id === id);
  dialogBody.innerHTML = `
    <div class="dialog-layout">
      <div class="dialog-image" style="background-image: url('${pet.image}')"></div>
      <div class="dialog-copy">
        <p class="eyebrow">${pet.city} · ${pet.type === "cat" ? "猫咪" : "狗狗"}</p>
        <h2>${pet.name}</h2>
        <p>${pet.intro}</p>
        <div class="info-list">
          <div><span>年龄</span><strong>${pet.age}</strong></div>
          <div><span>体型</span><strong>${pet.size}</strong></div>
          <div><span>性别</span><strong>${pet.gender}</strong></div>
          <div><span>健康</span><strong>${pet.health}</strong></div>
        </div>
        <form class="adoption-form">
          <input type="text" placeholder="姓名" required />
          <input type="tel" placeholder="联系方式" required />
          <textarea placeholder="简单说说你的家庭和陪伴时间" required></textarea>
          <button class="card-button" type="submit">提交申请</button>
        </form>
      </div>
    </div>
  `;
  petDialog.showModal();
}

function renderFavorites() {
  const favoritePets = pets.filter((pet) => favorites.has(pet.id));
  favoritesList.innerHTML = favoritePets.length
    ? favoritePets
        .map(
          (pet) => `
            <button class="favorite-row" type="button" data-open="${pet.id}">
              <img src="${pet.image}" alt="${pet.name}" />
              <span><strong>${pet.name}</strong><br />${pet.city} · ${pet.age}</span>
            </button>
          `,
        )
        .join("")
    : `<div class="empty-state">还没有收藏的小伙伴</div>`;
}

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const openButton = event.target.closest("[data-open]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    saveFavorites();
    renderPets();
  }

  if (openButton) {
    openPet(Number(openButton.dataset.open));
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderPets();
  });
});

searchInput.addEventListener("input", renderPets);

document.querySelector("#closeDialog").addEventListener("click", () => petDialog.close());
document.querySelector("#openFavorites").addEventListener("click", () => {
  renderFavorites();
  favoritesDialog.showModal();
});
document.querySelector("#closeFavorites").addEventListener("click", () => favoritesDialog.close());

document.addEventListener("submit", (event) => {
  if (!event.target.matches(".adoption-form")) return;
  event.preventDefault();
  event.target.innerHTML = `<div class="empty-state">申请已收到，救助人会尽快联系你。</div>`;
});

saveFavorites();
renderPets();
