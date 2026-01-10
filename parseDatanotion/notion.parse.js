const parseNotionData = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || null,
      brand: page.properties.brand.relation[0]?.id || null,
      description:
        page.properties.description.rich_text
          .map((text) => text.plain_text)
          .join("") || null,
      price: page.properties.price.number || null,
      accesories:
        page.properties.accessories.multi_select.map((item) => item.name) || [],
      type: page.properties.type.relation[0]?.id || null,
      color: page.properties.color.rich_text[0].text.content || null,
      photo: page.properties.photo.files[0]?.file.url || null,
      name: page.properties.name.title[0].text.content || null,
    };
  });
  return parsedData;
};

const parseNotionDataType = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || null,
      name: page.properties.name.rich_text[0].text.content || null,
      description:
        page.properties.description.rich_text
          .map((text) => text.plain_text)
          .join("") || null,
      photo: page.properties.photo.files[0]?.file.url || null,
    };
  });
  return parsedData;
};

const parseNotionDataBranch = (data) => {
  const parsedData = data.map((page) => {
    return {
      id: page.id || null,
      nombre: page.properties.Nombre.title[0].text.content || null,
    };
  });
  return parsedData;
};

module.exports = {
  parseNotionData,
  parseNotionDataType,
  parseNotionDataBranch,
};