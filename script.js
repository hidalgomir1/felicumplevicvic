const canvas = document.getElementById('birthdayCanvas');
const ctx = canvas.getContext('2d');

// Configuración del canvas (pantalla completa centrada)
const targetWidth = 400; // Ancho virtual para el diseño
const targetHeight = 600; // Alto virtual para el diseño
let scale = 1;

function resize() {
  // Ajusta el canvas al tamaño de la ventana manteniendo la proporción
  scale = Math.min(window.innerWidth / targetWidth, window.innerHeight / targetHeight);
  canvas.width = targetWidth * scale;
  canvas.height = targetHeight * scale;
  ctx.scale(scale, scale); // Escala todo el dibujo
  draw(); // Redibuja al cambiar el tamaño
}
window.addEventListener('resize', resize);

// --- ESTADO DEL JUEGO ---
let currentStage = 1; // 1: Inicio, 2: Sorpresa

// --- CARGA DE IMÁGENES ---
const img7c0 = document.getElementById('img7c0');
const img2xb = document.getElementById('img2xb');

let imagesLoaded = 0;
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    resize(); // Inicia una vez que las imágenes están listas
  }
}
img7c0.onload = imageLoaded;
img2xb.onload = imageLoaded;
// Por si acaso ya estaban en caché
if (img7c0.complete) imageLoaded();
if (img2xb.complete) imageLoaded();

// --- SISTEMA DE PARTÍCULAS (para la etapa 2) ---
let particles = [];
function createParticles() {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * targetWidth,
      y: Math.random() * -targetHeight, // Comienzan fuera de la pantalla
      size: Math.random() * 10 + 5,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      type: Math.random() > 0.5 ? 'heart' : 'bat'
    });
  }
}

// --- FUNCIÓN DE DIBUJO PRINCIPAL ---
function draw() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, targetWidth, targetHeight);

  if (currentStage === 1) {
    drawStage1();
  } else if (currentStage === 2) {
    drawStage2();
  }
}

// --- DIBUJO ETAPA 1: INICIO ---
function drawStage1() {
  // Personaje 1 (7c0LdR9.png - 227x719) - Escalado para que quepa
  const p1W = 120;
  const p1H = p1W * (719 / 227);
  ctx.drawImage(img7c0, (targetWidth - p1W) / 2, (targetHeight - p1H) / 2 + 50, p1W, p1H);

  // Texto 1: "TOQUE PARA LLEGAR AL 20 INNING"
  ctx.fillStyle = '#FFD700'; // Dorado
  ctx.font = 'bold 30px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TOQUE PARA LLEGAR AL', targetWidth / 2, 100);
  ctx.fillText('20 INNING', targetWidth / 2, 140);
  
  // Pequeña instrucción inferior
  ctx.fillStyle = 'white';
  ctx.font = '16px "Courier New", monospace';
  ctx.fillText('(¡TOCA!)', targetWidth / 2, 550);
}

// --- DIBUJO ETAPA 2: SORPRESA ---
function drawStage2() {
  // Texto 2: "¡FELIZ CUMPLEAÑOS, VÍCTOR!"
  ctx.fillStyle = '#FFD700'; // Dorado
  ctx.font = 'bold 30px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('¡FELIZ', targetWidth / 2, 80);
  ctx.fillText('CUMPLEAÑOS,', targetWidth / 2, 120);
  ctx.fillText('VÍCTOR YUJUUU!', targetWidth / 2, 160);

  // Personaje 2 LANZANDO (2xb1427.png - 83x120)
  const p2W = 100;
  const p2H = p2W * (120 / 83);
  const p2X = (targetWidth - p2W) / 2;
  const p2Y = (targetHeight - p2H) / 2 + 50;
  ctx.drawImage(img2xb, p2X, p2Y, p2W, p2H);

  // Dibujar y actualizar partículas (lluvia pixelada)
  particles.forEach(p => {
    ctx.font = `${p.size}px monospace`;
    ctx.fillText(p.type === 'heart' ? '💙' : '⚾', p.x, p.y);
    
    // Actualizar posición
    p.y += p.speedY;
    p.x += p.speedX;

    // Reiniciar partícula si sale de la pantalla
    if (p.y > targetHeight) {
      p.y = -p.size;
      p.x = Math.random() * targetWidth;
    }
  });
}

// --- BUCLE DE ANIMACIÓN (solo para la etapa 2) ---
function animationLoop() {
  if (currentStage === 2) {
    draw();
    requestAnimationFrame(animationLoop);
  }
}

// --- GESTIÓN DE INTERACCIÓN ---
function handleInteraction() {
  if (currentStage === 1) {
    currentStage = 2; // Cambia a la etapa 2
    createParticles(); // Crea la lluvia
    animationLoop(); // Inicia la animación
  }
}

// Escuchar clics del ratón y toques de pantalla
canvas.addEventListener('click', handleInteraction);
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault(); // Evita el comportamiento predeterminado del tacto
  handleInteraction();
});

// Iniciar
resize();