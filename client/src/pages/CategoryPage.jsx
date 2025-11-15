import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/product.routes";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";


const CATEGORIES = ["Pizza", "Sos", "Desert"];

export default function CategoryPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.user.loggedIn);
    const user = useSelector(state => state.user.user);
    const isAdmin = user?.role === "admin";


    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category || !CATEGORIES.includes(category)) {
            navigate(`/category/${CATEGORIES[0]}`, { replace: true });
        }
    }, [category, navigate]);

    useEffect(() => {
        if (!category || !CATEGORIES.includes(category)) return;

        setLoading(true);

        fetchProducts().then((res) => {
            console.log("ALL PRODUCTS FROM API:", res);

            const payload = res?.data ? res.data : res;

            console.log("PAYLOAD:", payload);

            if (payload?.success && Array.isArray(payload.data)) {
                const filtered = payload.data.filter(
                    (p) => p.category === category
                );
                console.log("FILTERED:", filtered);
                setProducts(filtered);
            } else {
                setProducts([]);
            }

            setLoading(false);
        });
    }, [category]);

    const handleChangeCategory = (cat) => {
        if (cat !== category) {
            navigate(`/category/${cat}`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Menu – {category}
                </h1>

                <div className="flex justify-center gap-4 mb-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleChangeCategory(cat)}
                            className={`px-4 py-2 rounded-full border transition
              ${cat === category
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-center">Se încarcă produsele...</p>
                ) : products.length === 0 ? (
                    <p className="text-center">
                        Nu există produse în categoria <strong>{category}</strong>.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="border rounded-xl shadow-sm p-4 flex flex-col"
                            >
                                {p.image && (
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                )}

                                <h2 className="font-semibold text-lg mb-1">{p.name}</h2>

                                <p className="text-sm text-gray-600 flex-1">
                                    {p.description}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="font-bold text-orange-600">
                                        {p.price} RON
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Stoc: {p.stock}
                                    </span>
                                </div>

                                {loggedIn && !isAdmin && (
                                    <button
                                        onClick={() => dispatch(addToCart(p))}
                                        className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
                                    >
                                        Adaugă în coș
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
