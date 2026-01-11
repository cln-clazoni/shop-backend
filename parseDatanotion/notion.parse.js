const parseNotionData = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || '',
      brand: page.properties?.brand?.relation[0]?.id || '',
      description:
        page.properties?.description?.rich_text
          .map((text) => text.plain_text)
          .join("") || '',
      price: page.properties?.price?.number || '',
      accesories:
        page.properties?.accessories?.multi_select.map((item) => item.name) || [],
      type: page.properties?.type?.relation[0]?.id || '',
      color: page.properties?.color?.rich_text[0].text.content || '',
      photo: page.properties?.photo?.files[0]?.file.url || '',
      name: page.properties?.name?.title[0].text.content || '',
    };
  });
  return parsedData;
};

const parseNotionDataType = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || null,
      name: page.properties?.name?.rich_text[0].text.content || '',
      description:
        page.properties?.description?.rich_text
          .map((text) => text.plain_text)
          .join("") || '',
      photo: page.properties?.photo?.files[0]?.file.url || '',
    };
  });
  return parsedData;
};

const parseNotionDataBranch = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || '',
      nombre: page.properties?.Nombre?.title[0]?.text.content || '',
    };
  });
  return parsedData;
};

module.exports = {
  parseNotionData,
  parseNotionDataType,
  parseNotionDataBranch,
};