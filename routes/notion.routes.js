const express = require("express");
const puppeteer = require("puppeteer");
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

router.get("/catalogo-pdf", async (req, res) => {
  try {
    const data = await getDatabaseData();
    const instrumentos = parseNotionData(data.results);

    const dataType = await getDatabaseDataType();
    const tipos = parseNotionDataType(dataType.results);

    const dataBranch = await getDatabaseDataBranch();
    const marcas = parseNotionDataBranch(dataBranch.results);

    const html = generateHTML(instrumentos, tipos, marcas);
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });
    await browser.close();
    // Headers para descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CATALOGO-INSTRUMENTOS-MUSICALES-Y-ACCESORIOS-CLN-${fechaDeHoyStrGuion()}.pdf"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error generando PDF",
      error: error.message,
    });
  }
});

module.exports = router;
