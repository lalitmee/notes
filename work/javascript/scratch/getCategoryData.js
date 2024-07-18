/**
 * Retrieves category information for the given product IDs.
 *
 * @param {number[]} prodIds - An array of product IDs.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the category information for the given product IDs.
 */
async function getCategoryData(productIds) {
  try {
    var apiEndpoint =
      "https://us-central1-nessa-ecommerce-prod.cloudfunctions.net/fetchCategoryInfo";
    var response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productIds }),
    });
    var data = await response.json();
    return data;
  } catch (error) {
    logError(
      {
        errorContext: {
          where: "## getCategoryData ##",
        },
        error,
      },
      orderData,
    );
    return {};
  }
}

const categoryData = {
  8143745253592: {
    item_category: {
      handle: "hair",
      title: "Hair",
    },
    item_category2: {
      handle: "hair-care",
      title: "Hair Care",
    },
    item_category3: {
      handle: "",
      title: "",
    },
  },
  8143864856792: {
    item_category: {
      handle: "makeup",
      title: "Makeup",
    },
    item_category2: {
      handle: "eyes",
      title: "Eyes",
    },
    item_category3: {
      handle: "",
      title: "",
    },
  },
  8144293953752: {
    item_category: {
      handle: "makeup",
      title: "Makeup",
    },
    item_category2: {
      handle: "nails",
      title: "Nails",
    },
    item_category3: {
      handle: "nail-polish",
      title: "Nail Polish",
    },
  },
  8175466119384: {
    item_category: {
      handle: "bath-and-body",
      title: "Bath and Body",
    },
    item_category2: {
      handle: "bath-and-shower",
      title: "Bath and Shower",
    },
    item_category3: {
      handle: "body-scrubs-and-exfoliants",
      title: "Body Scrubs and Exfoliants",
    },
  },
};

const transofrmedCategoryData = {};

for (const key in categoryData) {
  const value = categoryData[key];
  transofrmedCategoryData[key] = {
    itemCategory: value.item_category.title,
    itemCategory2: value.item_category2.title,
    itemCategory3: value.item_category3.title,
  };
}

console.log(transofrmedCategoryData);
