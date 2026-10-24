/* Small, dependency-free interactions for the storefront demonstration. */
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const bagCount = document.querySelector(".bag-count");
  const bagLink = document.querySelector(".bag-link");
  const productCards = [...document.querySelectorAll(".product-card")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const searchInput = document.querySelector("#product-search");
  const emptyResults = document.querySelector("#empty-results");
  const resultsMessage = document.querySelector("#results-message");
  const toast = document.querySelector("#toast");
  const form = document.querySelector("#newsletter-form");
  const emailInput = document.querySelector("#email");
  const formStatus = document.querySelector("#newsletter-status");
  let activeFilter = "all";
  let itemCount = 0;
  let toastTimeout;

  document.querySelector("#current-year").textContent = new Date().getFullYear();
  navigation.inert = window.innerWidth <= 820;

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    navigation.inert = window.innerWidth <= 820;
    document.body.classList.remove("menu-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
    navigation.inert = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    const filter = filterButtons.find((button) => button.dataset.filter === link.dataset.shopFilter);
    if (filter) filter.click();
    closeMenu();
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      itemCount += 1;
      bagCount.textContent = String(itemCount);
      bagLink.setAttribute("aria-label", `Shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
      showToast(`${button.dataset.add} added to your bag. This demo does not place orders.`);
    });
  });

  function updateProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;
    productCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const matchesCategory = activeFilter === "all" || categories.includes(activeFilter);
      const searchableText = `${card.dataset.name} ${card.dataset.description} ${card.dataset.category}`.toLocaleLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      const visible = matchesCategory && matchesSearch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    emptyResults.hidden = visibleCount !== 0;
    resultsMessage.textContent = query && visibleCount ? `${visibleCount} ${visibleCount === 1 ? "piece" : "pieces"} found` : "";
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("is-active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      updateProducts();
    });
  });
  document.querySelectorAll(".footer-main [data-shop-filter]").forEach((link) => {
    link.addEventListener("click", () => {
      const filter = filterButtons.find((button) => button.dataset.filter === link.dataset.shopFilter);
      if (filter) filter.click();
    });
  });
  searchInput.addEventListener("input", updateProducts);
  document.querySelector(".search-shortcut").addEventListener("click", () => {
    window.setTimeout(() => searchInput.focus(), 250);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    formStatus.textContent = "";
    if (!email || !emailInput.validity.valid) {
      formStatus.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }
    emailInput.removeAttribute("aria-invalid");
    formStatus.textContent = "Thank you — this demo does not create a real subscription.";
    form.reset();
  });

  emailInput.addEventListener("input", () => {
    emailInput.removeAttribute("aria-invalid");
    if (formStatus.textContent === "Please enter a valid email address.") formStatus.textContent = "";
  });

  // Collection cards take shoppers to the product list with the matching filter selected.
  document.querySelectorAll("[data-collection]").forEach((link) => {
    link.addEventListener("click", () => {
      const matchingFilter = filterButtons.find((button) => button.dataset.filter === link.dataset.collection);
      if (matchingFilter) matchingFilter.click();
    });
  });
});
