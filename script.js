const screens = {
  inicio: document.getElementById("inicio"),
  carta: document.getElementById("carta"),
  final: document.getElementById("final")
};

function mostrar(nombre) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[nombre].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Si regresamos a la carta, dejamos el botón "No" en su sitio original.
  if (nombre === "carta") {
    restaurarBotonNo();
  }
}

document.getElementById("descubrir").addEventListener("click", () => {
  mostrar("carta");
  lluviaCorazones(8);
});

document.getElementById("aceptar").addEventListener("click", () => {
  mostrar("final");
  lluviaCorazones(22);
});

document.getElementById("volver").addEventListener("click", () => {
  mostrar("inicio");
});

const botonNo = document.getElementById("rechazar");
let moviendoNo = false;
let ultimoMovimiento = 0;

function obtenerPosicionSegura() {
  const rect = botonNo.getBoundingClientRect();

  const margen = 12;
  const maxX = Math.max(margen, window.innerWidth - rect.width - margen);
  const maxY = Math.max(margen, window.innerHeight - rect.height - margen);

  // Evitamos colocar el botón demasiado cerca del centro,
  // donde normalmente estará el cursor/touch.
  const centroX = window.innerWidth / 2;
  const centroY = window.innerHeight / 2;

  let x;
  let y;
  let intentos = 0;

  do {
    x = margen + Math.random() * (maxX - margen);
    y = margen + Math.random() * (maxY - margen);
    intentos++;
  } while (
    Math.hypot((x + rect.width / 2) - centroX, (y + rect.height / 2) - centroY) < 130 &&
    intentos < 30
  );

  return { x, y };
}

function moverBotonNo() {
  const ahora = Date.now();

  // Evita que varios eventos consecutivos lo hagan vibrar demasiado.
  if (ahora - ultimoMovimiento < 120) return;
  ultimoMovimiento = ahora;

  if (!moviendoNo) {
    moviendoNo = true;
    botonNo.classList.add("is-running");
  }

  const { x, y } = obtenerPosicionSegura();

  botonNo.style.left = `${x}px`;
  botonNo.style.top = `${y}px`;
  botonNo.style.transform =
    `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg) scale(${(0.96 + Math.random() * 0.08).toFixed(2)})`;
}

// PC: huye cuando el cursor se aproxima al botón.
botonNo.addEventListener("mouseenter", moverBotonNo);

// También detectamos proximidad para que no sea necesario acertar exactamente al botón.
document.addEventListener("mousemove", (event) => {
  if (!screens.carta.classList.contains("active")) return;

  const rect = botonNo.getBoundingClientRect();

  if (
    event.clientX > rect.left - 45 &&
    event.clientX < rect.right + 45 &&
    event.clientY > rect.top - 45 &&
    event.clientY < rect.bottom + 45
  ) {
    moverBotonNo();
  }
});

// Móvil: antes de que el toque llegue al botón, se mueve.
botonNo.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moverBotonNo();
}, { passive: false });

// Si por alguna razón consigue hacer click/tap, también escapará.
botonNo.addEventListener("click", (event) => {
  event.preventDefault();
  moverBotonNo();
});

function restaurarBotonNo() {
  moviendoNo = false;
  botonNo.classList.remove("is-running");
  botonNo.style.left = "";
  botonNo.style.top = "";
  botonNo.style.transform = "";
}

window.addEventListener("resize", () => {
  if (!moviendoNo) return;

  const rect = botonNo.getBoundingClientRect();
  const margen = 12;

  const maxX = Math.max(margen, window.innerWidth - rect.width - margen);
  const maxY = Math.max(margen, window.innerHeight - rect.height - margen);

  const x = Math.min(Math.max(rect.left, margen), maxX);
  const y = Math.min(Math.max(rect.top, margen), maxY);

  botonNo.style.left = `${x}px`;
  botonNo.style.top = `${y}px`;
});

function lluviaCorazones(cantidad) {
  const contenedor = document.getElementById("hearts");

  for (let i = 0; i < cantidad; i++) {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = Math.random() > .25 ? "♥" : "♡";
    h.style.left = `${Math.random() * 100}%`;
    h.style.animationDelay = `${Math.random() * 1.2}s`;
    h.style.fontSize = `${14 + Math.random() * 22}px`;
    contenedor.appendChild(h);

    setTimeout(() => h.remove(), 5200);
  }
}

/*
  PERSONALIZACIÓN RÁPIDA:
  Puedes cambiar los nombres desde HTML:
  <span id="nombre1">Greg</span>
  <span id="nombre2">Cris</span>

  También puedes editar directamente el texto de la carta.
*/
