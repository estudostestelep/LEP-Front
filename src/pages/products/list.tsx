import { useEffect, useState } from "react";
import { productService } from "../../api/productService";
import type { Product } from "../../api/productService";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interface ProductResponse {
      data: Product[];
    }

    productService.getAll().then((res: ProductResponse) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <Link
          to="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Product
        </Link>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Available</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.description}</td>
              <td className="p-2">${p.price.toFixed(2)}</td>
              <td className="p-2">{p.available ? "Yes" : "No"}</td>
              <td className="p-2">
                <Link
                  to={`/products/${p.id}/edit`}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() =>
                    p.id &&
                    productService.remove(p.id).then(() =>
                      setProducts((prev) => prev.filter((x) => x.id !== p.id))
                    )
                  }
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
