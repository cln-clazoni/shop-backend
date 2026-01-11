const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { generateHTML } = require("../services/pdf.service");
const { fechaDeHoyStrGuion } = require("../services/fecha.service");

const {
  getDatabaseData,
  getDatabaseDataBranch,
  getDatabaseDataType,
} = require("../services/notion.service");

const {
  parseNotionData,
  parseNotionDataType,
  parseNotionDataBranch,
} = require("../parseDatanotion/notion.parse");
const router = express.Router();

router.get("/instrumentos", async (req, res) => {
  try {
    const data = await getDatabaseData();
    const datos = parseNotionData(data.results);
    res.status(200).json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo datos de Notion",
      error: error.message,
    });
  }
});

router.get("/tipos", async (req, res) => {
  try {
    const data = await getDatabaseDataType();
    const datos = parseNotionDataType(data.results);
    res.status(200).json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo datos de Notion",
      error: error.message,
    });
  }
});

router.get("/marcas", async (req, res) => {
  try {
    const data = await getDatabaseDataBranch();
    const datos = parseNotionDataBranch(data.results);
    res.status(200).json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo datos de Notion",
      error: error.message,
    });
  }
});

router.get("/generar-pdf", async (req, res) => {
  console.log("Generando PDF del catálogo...");
  req.setTimeout(0);
  res.setTimeout(0);

  try {
    const data = await getDatabaseData();
    const instrumentos = parseNotionData(data.results);
    const dataType = await getDatabaseDataType();
    const tipos = parseNotionDataType(dataType.results);
    const dataBranch = await getDatabaseDataBranch();
    const marcas = parseNotionDataBranch(dataBranch.results);

    const html = await generateHTML(instrumentos, tipos, marcas);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 0,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 0 });

    const pdfBuffer = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
      timeout: 0,
    });

    await browser.close();

    // 📂 Ruta donde quieres guardar el archivo
    const filePath = path.join(
      __dirname,
      "pdfs",
      `CATALOGO-INSTRUMENTOS-MUSICALES-Y-ACCESORIOS-CLN.pdf`
    );

    // Guardar el PDF en el servidor
    fs.writeFileSync(filePath, pdfBuffer);

    // Responder al cliente con un mensaje de éxito
    res.json({
      message: "PDF generado y guardado en el servidor",
      path: filePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generando PDF",
      error: error.message,
    });
  }
});

router.get("/descargar-catalogo-pdf", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "pdfs",
      `CATALOGO-INSTRUMENTOS-MUSICALES-Y-ACCESORIOS-CLN.pdf`
    );
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "El PDF no existe en el servidor" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CATALOGO-INSTRUMENTOS-MUSICALES-Y-ACCESORIOS-CLN-${fechaDeHoyStrGuion()}.pdf"`
    );
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error descargando PDF", error: error.message });
  }
});

module.exports = router;
