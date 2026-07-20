const form = document.querySelector("#job-form");
const submitBtn = document.querySelector("#submit-demo");
const previewGrid = document.querySelector("#preview-grid");
const results = document.querySelector("#results");
const animationComparison = document.querySelector("#animation-comparison");
const detections = document.querySelector("#detections");
const resultTitle = document.querySelector("#result-title");

const VIEWS = ["data104", "data76", "data29", "data51"];

// Intersection Observer for lazy-loading detection images
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute("data-src");
      }
      io.unobserve(img);
    });
  },
  { rootMargin: "300px" },
);

function assetPath(palette, res, file) {
  return `assets/${palette}_${res}/${file}`;
}

function makePreviewCard(index) {
  const card = document.createElement("div");
  card.className = "preview-card";
  const img = document.createElement("img");
  img.src = `assets/preview/${String(index).padStart(2, "0")}.jpg`;
  img.alt = `训练视角 ${index}`;
  img.loading = "lazy";
  const label = document.createElement("span");
  label.textContent = `#${index}`;
  card.append(img, label);
  return card;
}

function loadPreviews() {
  const cards = [];
  for (let i = 0; i < 16; i++) {
    cards.push(makePreviewCard(i));
  }
  previewGrid.replaceChildren(...cards);
}

function makeDetectionCard(dataSrc, texture, view) {
  const card = document.createElement("article");
  card.className = "card detection-card";
  const img = document.createElement("img");
  img.dataset.src = dataSrc;
  img.alt = `${texture}纹理 · 视角 ${view}`;
  // Placeholder until lazy-loaded
  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640' fill='%23141815'/%3E";
  io.observe(img);
  const heading = document.createElement("h3");
  heading.textContent = `${texture}纹理 · 视角 ${view}`;
  card.append(img, heading);
  return card;
}

function loadResults() {
  const palette = form.querySelector("input[name=palette_type]:checked").value;
  const res = form.querySelector("select[name=block_resolution]").value;

  const stamp = `?t=${Date.now()}`;

  // Turntable animation — show spinner then load
  animationComparison.classList.add("loading");
  animationComparison.src = "";
  const webpUrl = assetPath(palette, res, "vehicle_comparison.webp") + stamp;
  const preload = new Image();
  preload.onload = () => {
    animationComparison.src = webpUrl;
    animationComparison.classList.remove("loading");
  };
  preload.src = webpUrl;

  // Detection comparisons — lazy loaded via Intersection Observer
  const pairs = VIEWS.map((view) => {
    const pair = document.createElement("div");
    pair.className = "comparison-pair";
    const origUrl = assetPath(palette, res, `detection_original_${view}.jpg`) + stamp;
    const atfUrl = assetPath(palette, res, `detection_atf_${view}.jpg`) + stamp;
    pair.append(
      makeDetectionCard(origUrl, "原始", view),
      makeDetectionCard(atfUrl, "ATF", view),
    );
    return pair;
  });
  detections.replaceChildren(...pairs);

  resultTitle.textContent = `已读取现有 TT3D 训练结果 · ${palette}_${res}`;

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth" });
}

submitBtn.addEventListener("click", loadResults);

// Load previews on page load
loadPreviews();
