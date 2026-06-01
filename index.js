let scenes = {};
let currentSceneId = null;
let sceneIds = [];

async function loadScenes() {
  const response = await fetch("./scenes/scenes.json");
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    // если строка начинается не с '{', считаем её сжатой
    if (text[0] !== "{") {
      try {
        const decompressed = LZString.decompress(text);
        data = JSON.parse(decompressed);
      } catch (e) {
        console.error("Ошибка распаковки", e);
        data = {};
      }
    } else {
      data = JSON.parse(text);
    }
  }
  scenes = data;
  sceneIds = Object.keys(scenes);
  populateSelect();
  if (sceneIds.length > 0) {
    renderScene(sceneIds[0]);
    updateNavButtons();
    updateSceneCounter();
  } else {
    document.getElementById("content").innerHTML =
      '<div class="placeholder">Нет загруженных сцен</div>';
  }
}

function populateSelect() {
  const select = document.getElementById("sceneSelect");
  select.innerHTML = "";
  for (const id of sceneIds) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => {
    renderScene(e.target.value);
    updateNavButtons();
    updateSceneCounter();
  });
}

function renderScene(sceneId) {
  currentSceneId = sceneId;
  const scene = scenes[sceneId];
  const container = document.getElementById("content");
  const fragment = document.createDocumentFragment();

  // метаданные
  const metaDiv = document.createElement("div");
  metaDiv.className = "scene-metadata";
  metaDiv.innerHTML = `${scene.metadata.id} — Глава ${scene.metadata.chapter}, Акт ${scene.metadata.act}, День ${scene.metadata.day} | DSL ${scene.metadata.dslVersion}`;
  fragment.appendChild(metaDiv);

  for (const node of scene.nodes) {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = node.type;

    switch (node.type) {
      case "dialogue":
        nodeDiv.innerHTML = `<strong>${escapeHtml(node.speaker)}</strong>${node.emotion ? ` <span style="color:#aaa;">(${escapeHtml(node.emotion)})</span>` : ""}: ${escapeHtml(node.text)}`;
        break;
      case "thought":
        nodeDiv.innerHTML = `<em>(${escapeHtml(node.speaker)} мысленно): ${escapeHtml(node.text)}</em>`;
        break;
      case "action":
        nodeDiv.innerHTML = `<em>${escapeHtml(node.text.slice(1, node.text.length-1))}</em>`;
        break;
      case "choice":
        let choicesHtml = `<strong>Выбор:</strong><ul>`;
        for (const opt of node.options) {
          choicesHtml += `<li data-choice-id="${escapeHtml(opt.id)}">${escapeHtml(opt.text)}</li>`;
        }
        choicesHtml += `</ul>`;
        nodeDiv.innerHTML = choicesHtml;
        nodeDiv.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", () => {
            alert(`Выбран вариант: ${li.textContent}. (Выбор в разработке)`);
          });
        });
        break;
      case "transition":
        const targetId = escapeHtml(node.target);
        nodeDiv.innerHTML = `<span class="transition-link" data-target="${targetId}">➡ Переход к сцене: ${targetId}</span>`;
        nodeDiv
          .querySelector(".transition-link")
          .addEventListener("click", (e) => {
            const target = e.currentTarget.getAttribute("data-target");
            if (scenes[target]) {
              renderScene(target);
              updateNavButtons();
              updateSceneCounter();
              document.getElementById("sceneSelect").value = target;
              container.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              alert(`Сцена ${target} не найдена`);
            }
          });
        break;
      default:
        nodeDiv.textContent = JSON.stringify(node);
    }
    fragment.appendChild(nodeDiv);
  }

  container.innerHTML = "";
  container.appendChild(fragment);
  container.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("sceneSelect").value = sceneId;
  updateSceneCounter();
}

function getCurrentIndex() {
  return sceneIds.indexOf(currentSceneId);
}

function updateNavButtons() {
  const idx = getCurrentIndex();
  document.getElementById("prevSceneBtn").disabled = idx <= 0;
  document.getElementById("nextSceneBtn").disabled = idx >= sceneIds.length - 1;
}

function updateSceneCounter() {
  const idx = getCurrentIndex();
  document.getElementById("sceneCounter").textContent =
    `Сцена ${idx + 1} из ${sceneIds.length}`;
}

function prevScene() {
  const idx = getCurrentIndex();
  if (idx > 0) {
    renderScene(sceneIds[idx - 1]);
    updateNavButtons();
  }
}

function nextScene() {
  const idx = getCurrentIndex();
  if (idx < sceneIds.length - 1) {
    renderScene(sceneIds[idx + 1]);
    updateNavButtons();
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    if (m === '"') return "&quot;";
    if (m === "'") return "&#039;";
    return m;
  });
}

document.getElementById("prevSceneBtn").addEventListener("click", prevScene);
document.getElementById("nextSceneBtn").addEventListener("click", nextScene);

loadScenes();
