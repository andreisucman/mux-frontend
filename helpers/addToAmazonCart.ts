export function addToAmazonCart(asinsArray: string[]) {
  if (asinsArray.length === 0) return;

  try {
    let baseUrl = `https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=${process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID}`;

    baseUrl += asinsArray.map(
      (asin, index) => `&ASIN.${index + 1}=${asin}&Quantity.${index + 1}=1`
    );

    window.location.href = baseUrl;
  } catch (err) {
    console.log("Error in addToAmazonCart: ", err);
  }
}
