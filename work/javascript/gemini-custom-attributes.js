let attributesDataAsString =
  "{&quot;8629386477733&quot;:{&quot;id&quot;:8629386477733,&quot;itemCategory&quot;:&quot;Skincare&quot;,&quot;itemCategory2&quot;:&quot;Toners&quot;,&quot;itemCategory3&quot;:&quot;Toners &amp; Mists&quot;},&quot;8629386576037&quot;:{&quot;id&quot;:8629386576037,&quot;itemCategory&quot;:&quot;Skincare&quot;,&quot;itemCategory2&quot;:&quot;Treatments&quot;,&quot;itemCategory3&quot;:&quot;Face Serums&quot;},&quot;8629386641573&quot;:{&quot;id&quot;:8629386641573,&quot;itemCategory&quot;:&quot;Skincare&quot;,&quot;itemCategory2&quot;:&quot;Masks&quot;,&quot;itemCategory3&quot;:&quot;Masks &amp; Peels&quot;},&quot;8629387460773&quot;:{&quot;id&quot;:8629387460773,&quot;itemCategory&quot;:&quot;Skincare&quot;,&quot;itemCategory2&quot;:&quot;Moisturizers&quot;,&quot;itemCategory3&quot;:&quot;Night Cream&quot;}}";

function parseAttributes(data) {
  // 1. Clean up the string:
  data = data
    .replace(/&quot;/g, '"')
    .replace(/=&gt;/g, ":")
    .replace(/ /g, "");

  // 3. Parse the main attributes object and nested categories object
  try {
    const attributes = JSON.parse(data);
    return attributes;
  } catch (error) {
    console.error("Error parsing attributes:", error.message);
    return null; // Or provide a default object
  }
}

const attributes = parseAttributes(attributesDataAsString);
console.log("attributes", attributes);
