// components/dashboard/products/ProductsTable.jsx
import ProductRow from "./ProductRow";

const ProductsTable = ({ products, isDashboard = true }) => {
  return (
    <div className="rounded-2xl border-2 border-secondary/10 px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10  *:px-space-3 *:py-space-2">
            <th className="">Product Id</th>
            <th className="">Product Name</th>
            <th className="">Price</th>
            <th className="">Status</th>
            <th className="">Category</th>
            <th className="">Stock</th>
            {!isDashboard && <th className="">Added On</th>}
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              isDashboard={isDashboard}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
