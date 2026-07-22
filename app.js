const form = document.querySelector("#job-form");
const submitBtn = document.querySelector("#submit-demo");
const previewGrid = document.querySelector("#preview-grid");
const results = document.querySelector("#results");
const animationComparison = document.querySelector("#animation-comparison");
const turntableSpinner = document.querySelector("#turntable-spinner");
const designSheet = document.querySelector("#design-sheet");
const designSheetSpinner = document.querySelector("#design-sheet-spinner");
const designSheetTitle = document.querySelector("#design-sheet-title");
const designSheetDownload = document.querySelector("#design-sheet-download");
const designSheetMissing = document.querySelector("#design-sheet-missing");
const detections = document.querySelector("#detections");
const resultTitle = document.querySelector("#result-title");

const VIEWS = ["data104", "data76", "data29", "data51"];
const PALETTE_LABELS = {
  jungle: "丛林迷彩",
  desert: "沙漠迷彩",
  snow: "雪地迷彩",
};

// Choose quality tier based on screen width
const isDesktop = window.innerWidth > 768;
const QUALITY = isDesktop ? "desktop" : "mobile";

function assetPath(palette, res, file) {
  return `assets/${QUALITY}/${palette}_${res}/${file}`;
}

function designSheetPath(palette, res) {
  return `assets/desktop/${palette}_${res}/atf_five_view_design.png`;
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
  // Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "加载中...";
  animationComparison.style.opacity = "0";
  turntableSpinner.style.display = "";
  results.hidden = false;
  resultTitle.textContent = "正在加载，请稍候...";
  detections.innerHTML = '<p class="loading-text">正在加载检测结果...</p>';

  const palette = form.querySelector("input[name=palette_type]:checked").value;
  const res = form.querySelector("select[name=block_resolution]").value;
  const stamp = `?t=${Date.now()}`;
  const paletteLabel = PALETTE_LABELS[palette] || palette;

  // Collapse preview to save scroll distance
  previewGrid.closest(".dataset-preview").classList.add("collapsed");

  // Preload turntable, show when ready
  const webpUrl = assetPath(palette, res, "vehicle_comparison.webp") + stamp;
  const preloader = new Image();
  const showTurntable = () => {
    turntableSpinner.style.display = "none";
    animationComparison.src = webpUrl;
    animationComparison.style.opacity = "1";
    animationComparison.style.transition = "opacity .3s";
  };
  const t0 = Date.now();
  preloader.onload = () => {
    const elapsed = Date.now() - t0;
    setTimeout(showTurntable, elapsed < 500 ? 500 - elapsed : 0);
  };
  preloader.onerror = () => {
    const elapsed = Date.now() - t0;
    setTimeout(showTurntable, elapsed < 500 ? 500 - elapsed : 0);
  };
  preloader.src = webpUrl;

  // Orthographic five-view design sheet
  const designSheetUrl = designSheetPath(palette, res);
  designSheet.style.opacity = "0";
  designSheet.removeAttribute("src");
  designSheet.closest(".design-sheet-stage").classList.add("is-loading");
  designSheetSpinner.style.display = "";
  designSheetTitle.textContent = `${paletteLabel} ${res} 五视图设计总图`;
  designSheet.alt = `${paletteLabel} ${res} 正交五视图设计总图`;
  designSheetDownload.href = designSheetUrl;
  designSheetDownload.download = `${palette}_${res}_atf_five_view_design.png`;
  designSheetDownload.hidden = true;
  designSheetMissing.hidden = true;
  designSheet.onload = () => {
    designSheet.closest(".design-sheet-stage").classList.remove("is-loading");
    designSheetSpinner.style.display = "none";
    designSheetMissing.hidden = true;
    designSheetDownload.hidden = false;
    designSheet.style.opacity = "1";
  };
  designSheet.onerror = () => {
    designSheet.closest(".design-sheet-stage").classList.remove("is-loading");
    designSheetSpinner.style.display = "none";
    designSheet.style.opacity = "0";
    designSheetDownload.hidden = true;
    designSheetMissing.hidden = false;
  };
  designSheet.src = designSheetUrl + stamp;

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
  submitBtn.disabled = false;
  submitBtn.textContent = "开始重建与检测";

  results.scrollIntoView({ behavior: "smooth" });
}

submitBtn.addEventListener("click", loadResults);

// Load previews on page load
loadPreviews();
