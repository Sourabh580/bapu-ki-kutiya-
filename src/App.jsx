import React, { useState } from "react";

// Restaurant Info
const RESTAURANT_ID = "bapu-ki-kutiya";
const RESTAURANT_NAME = "Bapu Ki Kutiya";

type Dish = {
  id: string;
  name: string;
  price: number;
  description?: string;
  glb?: string;
  usdz?: string;
  image?: string;
  video?: string;
};

type CartItem = Dish & { qty: number };

// Dishes List (Sample, add more as needed)
const dishes: Dish[] = [
  {
    id: "dal_tadka",
    name: "Dal Tadka",
    price: 180,
    description: "Yellow lentils tempered with spices.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "paneer_butter_masala",
    name: "Paneer Butter Masala",
    price: 260,
    description: "Paneer cubes in creamy tomato gravy.",
    // Example: your Google Drive direct-download link (as provided earlier)
    video:
      "https://drive.google.com/uc?export=download&id=1ZgFnav0P68CwyMGWcD30wjtItnOBFhQT",
    image:
      "https://images.unsplash.com/photo-1519864600265-abb23847efc4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "naan",
    name: "Naan",
    price: 50,
    description: "Soft and fluffy Indian bread.",
    image:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b6?auto=format&fit=crop&w=400&q=80",
  },
];

function DishViewer({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-xl font-bold text-red-500"
          onClick={onClose}
        >
          ×
        </button>

        {dish.video ? (
          <video
            src={dish.video}
            autoPlay
            loop
            muted
            controls={false}
            playsInline
            style={{
              width: "100%",
              height: 300,
              background: "#000",
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-72 object-cover rounded-lg"
          />
        )}

        <div className="mt-3">
          <h2 className="text-xl font-semibold">{dish.name}</h2>
          <p className="text-gray-700">{dish.description}</p>
        </div>
        <div className="mt-2">
          <span className="text-green-700 font-bold">₹{dish.price}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  function addToCart(dish: Dish) {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === dish.id);
      if (ex) {
        return prev.map((i) => (i.id === dish.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  }

  function removeFromCart(dishId: string) {
    setCart((prev) => prev.filter((i) => i.id !== dishId));
  }

  async function placeOrder() {
    if (cart.length === 0 || placingOrder) return;
    setPlacingOrder(true);
    // Simulate customer info; in real app, ask user
    const customer = { name: "Guest", phone: "9999999999" };
    const total = cart.reduce((sum, d) => sum + d.price * d.qty, 0);
    const order = {
      restaurantId: RESTAURANT_ID,
      items: cart,
      customer,
      total,
      timestamp: Date.now(),
    };
    try {
      // Replace URL below with your backend order endpoint
      await fetch("/api/external-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      setOrderSuccess(true);
      setCart([]);
    } catch (e) {
      alert("Order failed! Make sure backend is running.");
    }
    setPlacingOrder(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-orange-50 px-4 py-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-green-700 tracking-widest mb-2 drop-shadow-lg">
          {RESTAURANT_NAME}
        </h1>
        <p className="text-lg text-gray-700">Order your meal & preview it here!</p>
      </header>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 mb-16">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="rounded-xl bg-white shadow-lg p-5 hover:scale-105 transition duration-200 flex flex-col relative"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="h-40 w-full object-cover rounded-lg mb-3"
            />
            <h2 className="text-2xl font-bold">{dish.name}</h2>
            <p className="text-gray-700">{dish.description}</p>
            <span className="text-green-700 font-bold my-2">₹{dish.price}</span>
            <div className="flex gap-2 mt-auto">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => setSelectedDish(dish)}
              >
                Preview
              </button>
              <button
                className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                onClick={() => addToCart(dish)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDish && (
        <DishViewer dish={selectedDish} onClose={() => setSelectedDish(null)} />
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-5 w-80 z-40">
          <h3 className="font-bold text-xl mb-2">Cart</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.price * item.qty}</span>
              <button
                className="text-red-500 font-bold ml-2"
                onClick={() => removeFromCart(item.id)}
              >
                ×
              </button>
            </div>
          ))}
          <div className="font-bold border-t pt-2 mt-2">
            Total: ₹{cart.reduce((s, i) => s + i.price * i.qty, 0)}
          </div>
          <button
            className={`bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 mt-3 w-full font-semibold ${
              placingOrder ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={placeOrder}
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-700">Order Placed!</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your order is on the way. Thank you!
            </p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => setOrderSuccess(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
