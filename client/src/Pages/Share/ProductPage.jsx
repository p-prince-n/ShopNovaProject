import ShareSection from "./ShareSection";

const ProductPage = () => {
  const shareUrl = `https://myapp.com/product/2336gt6t4vc5yd`;
  const title = `Check out this product: Mobile Phone`;

  return (
    <div>
      <h1>{"Phone"}</h1>
      <p>{"Phone description"}</p>

      {/* Share Section */}
      <ShareSection url={shareUrl} title={title} />
    </div>
  );
};

export default ProductPage;
