function markCurrentNav() {
  const page = document.body.dataset.page || "";
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.dataset.page === page) link.setAttribute("aria-current", "page");
  });
}

document.addEventListener("DOMContentLoaded", markCurrentNav);
