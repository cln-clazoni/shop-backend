const {
  DATABASE_ID,
  DATABASE_ID_TYPE,
  DATABASE_ID_BRANCH,
  notionHeaders,
} = require("../config/notion.config");

const getDatabaseData = async () => {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: notionHeaders,
  });

  if (!response.ok) {
    throw new Error(`Notion error: ${response.statusText}`);
  }

  return response.json();
};
const getDatabaseDataType = async () => {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID_TYPE}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: notionHeaders,
  });

  if (!response.ok) {
    throw new Error(`Notion error: ${response.statusText}`);
  }

  return response.json();
};
const getDatabaseDataBranch = async () => {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID_BRANCH}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: notionHeaders,
  });

  if (!response.ok) {
    throw new Error(`Notion error: ${response.statusText}`);
  }

  return response.json();
};

module.exports = {
  getDatabaseData,
  getDatabaseDataType,
  getDatabaseDataBranch,
};
