const form = document.querySelector("#job-form");
const submitBtn = document.querySelector("#submit-demo");
const previewGrid = document.querySelector("#preview-grid");
const results = document.querySelector("#results");
const animationComparison = document.querySelector("#animation-comparison");
const detections = document.querySelector("#detections");
const resultTitle = document.querySelector("#result-title");

const VIEWS = ["data104", "data76", "data29", "data51"];

// Choose quality tier based on screen width
const isDesktop = window.innerWidth > 768;
const QUALITY = isDesktop ? "desktop" : "mobile";

function assetPath(palette, res, file) {
  return `assets/${QUALITY}/${palette}_${res}/${file}`;
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

function makeDetectionCard(url, texture, view) {
  const card = document.createElement("article");
  card.className = "card";
  const img = document.createElement("img");
  img.src = url;
  img.alt = `${texture}纹理 · 视角 ${view}`;
  img.loading = "lazy";
  const heading = document.createElement("h3");
  heading.textContent = `${texture}纹理 · 视角 ${view}`;
  card.append(img, heading);
  return card;
}

function loadResults() {
  const palette = form.querySelector("input[name=palette_type]:checked").value;
  const res = form.querySelector("select[name=block_resolution]").value;

  const stamp = `?t=${Date.now()}`;

  // Turntable animation
  animationComparison.src = assetPath(palette, res, "vehicle_comparison.webp") + stamp;

  // Detection comparisons
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
