const { fechaDeHoyStr } = require("./fecha.service");
const sharp = require("sharp");
const axios = require("axios");

async function comprimirImagen(url, anchoMax = 800, calidad = 70) {
  try {
    // Descargar la imagen desde la URL
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Comprimir con sharp
    const comprimido = await sharp(buffer)
      .resize({ width: anchoMax }) // ancho máximo (mantiene proporción)
      .png({ quality: calidad }) // calidad JPEG 70%
      .toBuffer();

    // Convertir a base64 para usarlo en HTML
    return `data:image/png;base64,${comprimido.toString("base64")}`;
  } catch (error) {
    console.error("Error comprimiendo imagen:", error);
    return url; // fallback si falla
  }
}

async function generateHTML(instrumentos, tipos, marcas) {
  let paginasHTML = "";
  const itemsPorPagina = 9;

  // 1. Agrupar instrumentos por tipo
  const instrumentosPorTipo = instrumentos.reduce((acc, inst) => {
    const typeId = inst.type;
    if (!acc[typeId]) acc[typeId] = [];
    acc[typeId].push(inst);
    return acc;
  }, {});

  // 2. Crear tarjeta
  const crearTarjeta = async (producto) => {
    if (!producto)
      return `<div class="card" style="visibility:hidden;border:none;"></div>`;

    const marcaObj = marcas.find((m) => m.id === producto.brand);
    const marcaNombre = marcaObj ? marcaObj.nombre : "Sin Marca";

    const nombre = producto.name || "";
    const accesorios = producto.accesories || "";
    const color = producto.color || "";

    let imagenHTML;

    if (producto.photo) {
      const imagenComprimida = await comprimirImagen(producto.photo, 800, 70);
      imagenHTML = `<img src="${imagenComprimida}" alt="${nombre}">`;
    } else {
      imagenHTML = `<div class="img-placeholder-text">Sin imagen</div>`;
    }

    return `
      <div class="card">
        <div class="brand-tag">${nombre}</div>

        <div class="card-header">
          ${
            accesorios.length > 0
              ? `<div>
            <span class="label-red">Accesorios:</span>
            <div class="accessories-list">${accesorios
              .map((a) => `<li class="accessory">${a}</li>`)
              .join("")}</div>
          </div>`
              : ""
          }
          <div class="product-name">Marca: ${marcaNombre}</div>
        </div>

        <div class="image-container">
          ${imagenHTML}
        </div>

        <div class="card-footer">
          Color: ${color}
        </div>

        <div class="corner-triangle"></div>
      </div>
    `;
  };

  // 3. Generar páginas por tipo
  for (const typeId of Object.keys(instrumentosPorTipo)) {
    const listaInstrumentos = instrumentosPorTipo[typeId];
    const tipoObj = tipos.find((t) => t.id == typeId);
    const nombreTipo = tipoObj ? tipoObj.name : "General";

    const totalPaginasPorTipo = Math.ceil(
      listaInstrumentos.length / itemsPorPagina
    );

    for (let i = 0; i < totalPaginasPorTipo; i++) {
      const inicio = i * itemsPorPagina;
      const grupo = listaInstrumentos.slice(inicio, inicio + itemsPorPagina);

      let gridContent = await Promise.all(grupo.map((inst) => crearTarjeta(inst)));
      gridContent = gridContent.join("");

      const faltantes = itemsPorPagina - grupo.length;
      const placeholders = await Promise.all(
        Array.from({ length: faltantes }, () => crearTarjeta(null))
      );
      gridContent += placeholders.join("");

      paginasHTML += `
        <div class="page">
          <header>
  <div class="header-text">
    <h1 style="font-weight:bold; font-size:26pt;   font-family: 'Archivo Black', sans-serif;
  font-weight: 400;
  font-style: normal;">Catálogo CLN</h1><br>
    <h2 style="color: #c3edffff;">${nombreTipo}</h2>
    <div class="subtitle-badge">
      Instrumentos Musicales CLN
    </div>
  </div>

  <div class="header-logo">
    <img
      src="https://cln-clazoni.github.io/shop/_next/static/media/tiendaCLN.a5d4118c.png"
      alt="Logo CLN"
    />
  </div>
</header>

          <div class="catalog-grid">
            ${gridContent}
          </div>

          <footer>
            <div class="footer-line">
              Pedidos WhatsApp: 78859999 - 77729222 - 78856666
            </div>
            <div class="footer-line small">
              Fecha de emisión: ${fechaDeHoyStr()}
            </div>
          </footer>
        </div>
      `;
    }
  }

  // 4. HTML completo
  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Catálogo de Instrumentos Musicales y Accesorios - CLN</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bree+Serif&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Mea+Culpa&display=swap" rel="stylesheet">
<style>
:root {
  --primary-red: #00354e;
  --black: #000;
  --bg-gray: #f2f3f5;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

body {
  background-color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

/* =================== PAGE =================== */
.page {
  width: 215.9mm;
  height: 279.4mm;
  background-color: var(--bg-gray);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  page-break-after: always;
}

.page:last-child {
  page-break-after: auto;
}

/* =================== HEADER =================== */
header {
  background-color: var(--primary-red);
  color: white;
  padding: 30px 40px 10px;
  height: 18%;
  border-bottom-right-radius: 80px;

  display: flex;
  align-items: center;
}

/* 70% TEXTO */
.header-text {
  width: 70%;
}

/* 30% LOGO */
.header-logo {
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-logo img {
  max-width: 80%;
  object-fit: contain;
}

header h1 {
  font-size: 26pt;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
}

.subtitle-badge {
  background-color: var(--black);
  padding: 8px 30px 8px 15px;
  display: inline-block;
  margin-top: 15px;
  font-size: 10pt;
  font-weight: bold;
  clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
}

/* =================== GRID =================== */
.catalog-grid {
  padding: 20px 30px;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;

  position: relative;
  z-index: 1;
}

/* ===== WATERMARK ===== */
.catalog-grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("https://cln-clazoni.github.io/shop/_next/static/media/tiendaCLN.a5d4118c.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60% auto;
  opacity: 0.1;
  z-index: 10;
  pointer-events: none;
}

/* =================== CARD =================== */
.card {
  background: white;
  position: relative;
  z-index: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.brand-tag {
  background-color: var(--black);
  color: white;
  font-weight: bold;
  font-size: 8pt;
  padding: 5px 15px 5px 10px;
  position: absolute;
  top: 10px;
  left: 0;
  clip-path: polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%);
}

.card-header {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
}

.label-red {
  color: var(--primary-red);
  font-weight: bold;
}

.product-name {
  font-weight: bold;
  font-style: italic;
  text-align: right;
  max-width: 60%;
}

.accessories-list {
  font-size: 7pt;
  color: #555;
  margin-top: 2px;
  margin-left: 10px;
}

/* =================== IMAGE =================== */
.image-container {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* =================== FOOTER =================== */
.card-footer {
  font-size: 9pt;
  font-weight: bold;
  font-style: italic;
}

.corner-triangle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 50px 50px;
  border-color: transparent transparent var(--primary-red) transparent;
}

/* =================== PAGE FOOTER =================== */
footer {
  background-color: var(--primary-red);
  color: white;
  text-align: center;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-line {
  font-size: 10pt;
  font-weight: bold;
  line-height: 1.1;
}

.footer-line.small {
  font-size: 8pt;
  font-weight: normal;
}

/* =================== PRINT =================== */
@media print {
  body {
    background: none;
    padding: 0;
  }

  .page {
    margin: 0;
    box-shadow: none;
    width: 100%;
    height: 100vh;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

@page {
  size: letter;
  margin: 0;
}
</style>
</head>

<body>
${paginasHTML}
</body>
</html>
`;
}

module.exports = { generateHTML };
