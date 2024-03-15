import dbConnect from "../../../db/connect";
import Review from "../../../db/models/Review";
import Product from "../../../db/models/Product";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    try {
      const reviewData = request.body.review;
      const productId = request.body.productId;
      const reviewId = await Review.create(reviewData);

      await Product.findByIdAndUpdate(productId, { $push: { reviews: reviewId } });
      response.status(201).json({ status: "Review added to product successfully" });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }

    response.status(201).json({ status: "Review added to product successfully" });
  }
}
