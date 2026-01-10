const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const NOTION_VERSION = "2022-06-28";
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const DATABASE_ID_TYPE = process.env.NOTION_DATABASE_ID_TYPE;
const DATABASE_ID_BRANCH = process.env.NOTION_DATABASE_ID_BRANCH;

const notionHeaders = {
  accept: "application/json",
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
};

module.exports = {
  notion,
  DATABASE_ID,
  DATABASE_ID_BRANCH,
  DATABASE_ID_TYPE,
  notionHeaders,
};
