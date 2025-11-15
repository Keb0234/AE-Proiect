import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from "../store/slices/cartSlice";

export default function CartPage() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p>Your Cart is Empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} x {item.price} RON
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white">
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(item.id))}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 text-sm ml-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-6">
        Total Sum: {totalPrice.toFixed(2)} RON
      </h2>

      <button
        onClick={() => dispatch(clearCart())}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Empty cart
      </button>
    </div>
  );
}
