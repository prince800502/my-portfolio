const progressBar = document.querySelector(".progress-bar");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const themeToggle = document.querySelector(".theme-toggle");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Active navigation highlighting
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("main section[id]");

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();
document.querySelector("#year").textContent = new Date().getFullYear();

// Theme Toggle
const THEME_KEY = "portfolio-theme";

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  }
}

function initTheme() {
  const theme = getInitialTheme();
  applyTheme(theme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

initTheme();

// Certificate data
const certificates = [
  {
    id: 1,
    title: "Full Stack Web Development",
    issuer: "Meta",
    date: "2024-10-20",
    file: "certificate-1.pdf",
    type: "pdf"
  },
  {
    id: 2,
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "2024-06-17",
    file: "certificate-2.pdf",
    type: "pdf"
  },
  {
    id: 3,
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "2024-06-21",
    file: "certificate-3.pdf",
    type: "pdf"
  },
  {
    id: 4,
    title: "Frontend Development Libraries",
    issuer: "freeCodeCamp",
    date: "2024-06-21",
    file: "certificate-4.pdf",
    type: "pdf"
  },
  {
    id: 5,
    title: "Data Visualization",
    issuer: "freeCodeCamp",
    date: "2024-06-18",
    file: "certificate-5.pdf",
    type: "pdf"
  },
  {
    id: 6,
    title: "Python for Everybody",
    issuer: "University of Michigan",
    date: "2024-04-14",
    file: "certificate-6.jpeg",
    type: "image"
  },
  {
    id: 7,
    title: "Database Design and SQL",
    issuer: "University of Colorado",
    date: "2024-04-14",
    file: "certificate-7.jpeg",
    type: "image"
  },
  {
    id: 8,
    title: "Networking Academy Learn-A-Thon 2026",
    issuer: "Cisco Networking Academy",
    date: "2026-06-30",
    file: "certificate-8.pdf",
    type: "pdf"
  },
  {
    id: 9,
    title: "Learn-A-Thon 2025",
    issuer: "Cisco Networking Academy",
    date: "2026-06-30",
    file: "certificate-9.pdf",
    type: "pdf"
  }
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function renderCertifications() {
  const grid = document.getElementById("certifications-grid");
  if (!grid) return;

  grid.innerHTML = certificates.map(cert => {
    const isPDF = cert.type === "pdf";
    const filePath = `assets/certificates/${cert.file}`;
    const viewUrl = isPDF ? filePath : filePath;
    const downloadAttr = isPDF ? `download="${cert.file}"` : "";

    return `
      <article class="certification-card reveal">
        <div class="certification-thumb">
          ${isPDF ? `
            <div class="pdf-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>PDF Certificate</span>
            </div>
          ` : `
            <img src="assets/certificates/${cert.file}" alt="${cert.title} certificate" loading="lazy">
          `}
        </div>
        <div class="certification-info">
          <h3 class="certification-title">${cert.title}</h3>
          <div class="certification-meta">
            <span class="certification-issuer">${cert.issuer}</span>
            <span class="certification-date">${formatDate(cert.date)}</span>
          </div>
          <div class="certification-actions">
            <a class="button button-dark" href="assets/certificates/${cert.file}" target="_blank" rel="noopener noreferrer" ${downloadAttr}>
              View Certificate <span>↗</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Re-observe reveal animations for new elements
  const newRevealItems = grid.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    newRevealItems.forEach(item => observer.observe(item));
  } else {
    newRevealItems.forEach(item => item.classList.add("visible"));
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Initialize certifications after DOM is ready
document.addEventListener("DOMContentLoaded", renderCertifications);
