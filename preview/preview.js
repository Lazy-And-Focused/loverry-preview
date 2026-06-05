// ======================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ========================
let scenes = {};
let currentSceneId = null;
let sceneIds = [];

let currentSceneNodes = [];
let currentNodeIndex = 0;
let waitingForChoice = false;
let currentChoiceNode = null;
let waitingForUserClick = false;

// Визуальное состояние
let currentBackground = null;
let characterElements = new Map();

// Для устранения множественных обработчиков кнопки "Далее"
let nextStepBtn = null;

// ======================== ЗАГРУЗКА СЦЕН ========================
async function loadScenes() {
  const response = await fetch("/scenes/scenes.json");
  const text = await response.text();
  let data;
  if (text[0] !== "{") {
    try {
      const decompressed = LZString.decompressFromBase64(text);
      data = JSON.parse(decompressed);
    } catch (e) {
      console.error("Ошибка распаковки", e);
      data = {};
    }
  } else {
    data = JSON.parse(text);
  }
  scenes = data;
  sceneIds = Object.keys(scenes);
  populateSelect();

  // Параметр ?scene=... из URL
  const urlParams = new URLSearchParams(window.location.search);
  const startScene = urlParams.get('scene');
  let targetScene = startScene && scenes[startScene] ? startScene : (sceneIds[0] || null);

  if (targetScene) {
    startSceneById(targetScene);
    updateNavButtons();
    updateSceneCounter();
    document.getElementById("sceneSelect").value = targetScene;
  } else {
    document.getElementById("content").innerHTML =
      '<div class="placeholder">Нет загруженных сцен</div>';
  }
}

function populateSelect() {
  const select = document.getElementById("sceneSelect");
  if (!select) return;
  select.innerHTML = "";
  for (const id of sceneIds) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => {
    startSceneById(e.target.value);
    updateNavButtons();
    updateSceneCounter();
  });
}

// ======================== УПРАВЛЕНИЕ ГРАФИКОЙ ========================
function resetVisuals() {
  const bgLayer = document.getElementById("bg-layer");
  if (bgLayer) bgLayer.style.backgroundImage = "";
  currentBackground = null;

  const charsLayer = document.getElementById("characters-layer");
  if (charsLayer) charsLayer.innerHTML = "";
  characterElements.clear();

  const effectOverlay = document.getElementById("effect-overlay");
  if (effectOverlay) {
    effectOverlay.innerHTML = "";
    effectOverlay.className = "effect-overlay";
  }
}

function setBackground(file) {
  if (!file) return;
  const bgLayer = document.getElementById("bg-layer");
  if (!bgLayer) return;
  const imagePath = `/assets/background/${file}`;
  // проверка существования (необязательно, но полезно)
  const img = new Image();
  img.onload = () => { bgLayer.style.backgroundImage = `url('${imagePath}')`; };
  img.onerror = () => console.warn(`Background not found: ${imagePath}`);
  img.src = imagePath;
  currentBackground = file;
}

function setCharacter(characterId, sprite, position, emotion, hidden = false) {
  const charsLayer = document.getElementById("characters-layer");
  if (!charsLayer) return;
  let img = characterElements.get(characterId);
  if (!img) {
    img = document.createElement("img");
    img.className = "character-sprite";
    img.alt = characterId;
    characterElements.set(characterId, img);
    charsLayer.appendChild(img);
  }
  if (hidden) {
    img.style.display = "none";
    return;
  }
  img.style.display = "block";
  const basePath = `/assets/characters/${characterId}`;
  const spriteFile = sprite || "default.png";
  const src = `${basePath}/${spriteFile}`;
  // проверка существования
  const testImg = new Image();
  testImg.onload = () => { img.src = src; };
  testImg.onerror = () => console.warn(`Character sprite not found: ${src}`);
  testImg.src = src;
  if (position) {
    img.setAttribute("data-position", position);
    img.style.margin = "0";
    if (position === "left") img.style.marginRight = "auto";
    else if (position === "right") img.style.marginLeft = "auto";
    else if (position === "center") {
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
    }
  }
  if (emotion) img.alt = `${characterId} (${emotion})`;
}

function hideCharacter(characterId) {
  const img = characterElements.get(characterId);
  if (img) img.style.display = "none";
}

function applyEffect(effectId, intensity, durationMs) {
  const overlay = document.getElementById("effect-overlay");
  if (!overlay) return;
  overlay.className = "effect-overlay";
  overlay.style.setProperty("--effect-duration", `${durationMs || 300}ms`);
  let effectClass = "";
  switch (effectId) {
    case "flash": effectClass = "effect-flash"; break;
    case "shake": effectClass = "effect-shake"; break;
    case "pulse": effectClass = "effect-pulse"; break;
    default: effectClass = "effect-flash";
  }
  overlay.classList.add(effectClass);
  setTimeout(() => {
    overlay.classList.remove(effectClass);
  }, durationMs || 300);
  console.log(`[Effect] ${effectId}, intensity=${intensity}, duration=${durationMs}ms`);
}

// ======================== ПОШАГОВЫЙ ВЫВОД ========================
function startSceneById(sceneId) {
  currentSceneId = sceneId;
  const scene = scenes[sceneId];
  if (!scene) {
    console.error(`Scene ${sceneId} not found`);
    return;
  }
  currentSceneNodes = scene.nodes;
  currentNodeIndex = 0;
  waitingForChoice = false;
  currentChoiceNode = null;
  waitingForUserClick = false;
  resetVisuals();
  updateSceneMetadata(scene);
  // очищаем контейнер перед показом
  const container = document.getElementById("content");
  if (container) container.innerHTML = "";
  showCurrentNode();
}

function updateSceneMetadata(scene) {
  let metaEl = document.getElementById("scene-metadata");
  const container = document.getElementById("content");
  if (!container) return;
  if (!metaEl) {
    metaEl = document.createElement("div");
    metaEl.id = "scene-metadata";
    metaEl.className = "scene-metadata";
    container.insertBefore(metaEl, container.firstChild);
  }
  metaEl.innerHTML = `${scene.metadata.id} — Глава ${scene.metadata.chapter}, Акт ${scene.metadata.act}, День ${scene.metadata.day} | DSL ${scene.metadata.dslVersion}`;
}

function showCurrentNode() {
  if (waitingForChoice) return;
  if (currentNodeIndex >= currentSceneNodes.length) {
    const container = document.getElementById("content");
    if (container) {
      const endMsg = document.createElement("div");
      endMsg.className = "placeholder";
      endMsg.textContent = "Конец сцены. Выберите другую сцену.";
      container.appendChild(endMsg);
    }
    return;
  }

  const node = currentSceneNodes[currentNodeIndex];
  const container = document.getElementById("content");
  if (!container) return;

  // ВИЗУАЛЬНЫЕ УЗЛЫ (background, character, effect) – не добавляем в текстовый контейнер
  if (node.type === "background") {
    if (node.file) setBackground(node.file);
    currentNodeIndex++;
    showCurrentNode();
    return;
  }
  if (node.type === "character") {
    if (node.hidden) {
      hideCharacter(node.character);
    } else {
      setCharacter(node.character, node.sprite, node.position, node.emotion);
    }
    currentNodeIndex++;
    showCurrentNode();
    return;
  }
  if (node.type === "effect") {
    if (node.effect) {
      applyEffect(node.effect, node.intensity, node.duration);
    }
    currentNodeIndex++;
    showCurrentNode();
    return;
  }

  // ТЕКСТОВЫЕ УЗЛЫ: удаляем предыдущий текстовый блок (но не визуальные слои)
  const oldBlocks = container.querySelectorAll(
    ".dialogue, .thought, .action, .choice, .transition"
  );
  oldBlocks.forEach(el => el.remove());

  const nodeDiv = document.createElement("div");
  nodeDiv.className = node.type;

  // ===== ОБРАБОТКА ТИПОВ =====
  switch (node.type) {
    case "dialogue":
      nodeDiv.innerHTML = `<strong>${escapeHtml(node.character)}</strong>${node.emotion ? ` <span style="color:#aaa;">(${escapeHtml(node.emotion)})</span>` : ""}: ${escapeHtml(node.text)}`;
      waitingForUserClick = true;
      break;
    case "thought":
      nodeDiv.innerHTML = `<em>(${escapeHtml(node.character)} мысленно): ${escapeHtml(node.text)}</em>`;
      waitingForUserClick = true;
      break;
    case "action":
      let actionText = node.text;
      if (actionText.startsWith("_") && actionText.endsWith("_"))
        actionText = actionText.slice(1, -1);
      nodeDiv.innerHTML = `<em>${escapeHtml(actionText)}</em>`;
      waitingForUserClick = true;
      break;
    case "choice": {
      waitingForChoice = true;
      waitingForUserClick = false;
      let choicesHtml = `<strong>Выбор:</strong><ul>`;
      for (const opt of node.options) {
        choicesHtml += `<li data-choice-id="${escapeHtml(opt.id)}">${escapeHtml(opt.text)}</li>`;
      }
      choicesHtml += `</ul>`;
      nodeDiv.innerHTML = choicesHtml;
      container.appendChild(nodeDiv);
      // Навешиваем обработчики
      nodeDiv.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", (e) => {
          const optionId = li.getAttribute("data-choice-id");
          const option = node.options.find(opt => opt.id === optionId);
          if (option) {
            // Переключаем на узлы выбранной опции
            currentSceneNodes = option.nodes || [];
            currentNodeIndex = 0;
            waitingForChoice = false;
            waitingForUserClick = false;
            // Удаляем все старые текстовые блоки
            const old = container.querySelectorAll(".dialogue, .thought, .action, .choice, .transition");
            old.forEach(el => el.remove());
            showCurrentNode();
          } else {
            alert(`Выбран вариант: ${li.textContent}`);
          }
        });
      });
      return; // Не переходим к следующему узлу автоматически
    }
    case "transition": {
      const targetId = escapeHtml(node.target);
      nodeDiv.innerHTML = `<span class="transition-link" data-target="${targetId}">➡ Переход к сцене: ${targetId}</span>`;
      container.appendChild(nodeDiv);
      nodeDiv.querySelector(".transition-link").addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-target");
        if (scenes[target]) {
          startSceneById(target);
          updateNavButtons();
          updateSceneCounter();
          const select = document.getElementById("sceneSelect");
          if (select) select.value = target;
        } else {
          alert(`Сцена ${target} не найдена`);
        }
      });
      return;
    }
    default:
      nodeDiv.textContent = JSON.stringify(node);
      waitingForUserClick = true;
  }

  container.appendChild(nodeDiv);
  // Прокрутка к новому блоку
  nodeDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ======================== ПРОДОЛЖЕНИЕ (кнопка / клик) ========================
function onUserAdvance() {
  if (waitingForChoice) return;
  if (waitingForUserClick) {
    waitingForUserClick = false;
    currentNodeIndex++;
    if (currentNodeIndex < currentSceneNodes.length) {
      showCurrentNode();
    } else {
      const container = document.getElementById("content");
      if (container && !container.querySelector(".placeholder")) {
        const endMsg = document.createElement("div");
        endMsg.className = "placeholder";
        endMsg.textContent = "Конец сцены. Выберите другую сцену.";
        container.appendChild(endMsg);
      }
    }
  }
}

// ======================== НАВИГАЦИЯ ========================
function getCurrentIndex() {
  return sceneIds.indexOf(currentSceneId);
}

function updateNavButtons() {
  const idx = getCurrentIndex();
  const prevBtn = document.getElementById("prevSceneBtn");
  const nextBtn = document.getElementById("nextSceneBtn");
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= sceneIds.length - 1;
}

function updateSceneCounter() {
  const idx = getCurrentIndex();
  const counterSpan = document.getElementById("sceneCounter");
  if (counterSpan) counterSpan.textContent = `Сцена ${idx + 1} из ${sceneIds.length}`;
}

function prevScene() {
  const idx = getCurrentIndex();
  if (idx > 0) {
    startSceneById(sceneIds[idx - 1]);
    updateNavButtons();
    updateSceneCounter();
    const select = document.getElementById("sceneSelect");
    if (select) select.value = sceneIds[idx - 1];
  }
}

function nextScene() {
  const idx = getCurrentIndex();
  if (idx < sceneIds.length - 1) {
    startSceneById(sceneIds[idx + 1]);
    updateNavButtons();
    updateSceneCounter();
    const select = document.getElementById("sceneSelect");
    if (select) select.value = sceneIds[idx + 1];
  }
}

// ======================== КНОПКА "ДАЛЕЕ" ========================
function addNextButton() {
  const footer = document.querySelector(".panel-footer");
  if (!footer) return;
  // Удаляем старую кнопку, если есть
  if (nextStepBtn) nextStepBtn.remove();
  nextStepBtn = document.createElement("button");
  nextStepBtn.id = "nextStepBtn";
  nextStepBtn.textContent = "▶ Далее";
  nextStepBtn.style.marginLeft = "auto";
  nextStepBtn.style.marginRight = "0.5rem";
  nextStepBtn.addEventListener("click", onUserAdvance);
  footer.insertBefore(nextStepBtn, footer.lastChild);
}

// ======================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ========================
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    if (m === '"') return "&quot;";
    if (m === "'") return "&#039;";
    return m;
  });
}

// ======================== ИНИЦИАЛИЗАЦИЯ ========================
document.addEventListener("DOMContentLoaded", () => {
  addNextButton();
  const prevBtn = document.getElementById("prevSceneBtn");
  const nextBtn = document.getElementById("nextSceneBtn");
  if (prevBtn) prevBtn.addEventListener("click", prevScene);
  if (nextBtn) nextBtn.addEventListener("click", nextScene);
  const content = document.getElementById("content");
  if (content) content.addEventListener("click", onUserAdvance);
  loadScenes();
});