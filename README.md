# ShopSmart ⚡ // Anime & Pop-Culture Streetwear & Collectibles Store

> **A high-energy, pop-culture and anime-inspired full-stack e-commerce application powered by Data Structures & Algorithmic Recommendations.**

---

## 🌟 Highlights & Features

- **Cyber & Anime Visual Identity**: Custom dark-mode aesthetic with vibrant accents (Electric Purple, Hot Pink, Cyber Cyan, Neon Lime), angled badges, Japanese kanji watermarks (`領域展開`, `特級`), and procedural SVG product artwork.
- **Data Structures in Action**:
  - 🌳 **Binary Search Tree (BST)** — Lexicographical $O(\log n)$ catalogue indexing for sub-millisecond search.
  - ⚡ **Chained Hash Table** — Constant-time $O(1)$ ID dereference for instant cart resolution and checkout calculations.
  - 🔗 **Interaction Linked List** — Sequential chronological tracking of user behavior (Views, Wishlists, and Cart actions with weighted coefficients).
  - 🏆 **Recommendation Max Heap** — Priority queue extracting top personalized items using multi-objective scoring ($0.60 \times \text{Content} + 0.25 \times \text{UserPreference} + 0.10 \times \text{Popularity} + 0.05 \times \text{Rating}$).
- **40 Original Merchandise Drops**: Covering 5 distinct universes:
  - 🥋 **Clothing**: Heavyweight 280 GSM oversized tees, acid-wash graphics, and streetwear hoodies.
  - 🎒 **Accessories**: Tactical cross-body bags, kitsune mask enamel pins, and snapbacks.
  - 💎 **Jewellery**: Cursed seal obsidian pendants and sterling silver dragon rings.
  - ⚔️ **Collectibles**: 1/8 scale figures, acrylic standees, and Damascus steel letter opener katanas.
  - 🏮 **Decor**: Cyberpunk neo-Tokyo RGB desk mats, ether spirit LED neon lamps, and wall scrolls.
- **SQLite Database Persistence**: Transactional ACID storage for products, user accounts, and cart items.
- **Authentication**: Native session support with 1-click demo accounts (*Priya #1* and *Rahul #2*).
- **Cart Management**: Dynamic slide-over drawer with free shipping progress bar, promo code validation (`SHINOBI20` for 20% off), and instant calculations.

---

## 🏗️ Project Architecture

```
ShopSmart/
├── backend/
│   ├── CMakeLists.txt              # C build configuration
│   ├── include/                    # Header files
│   │   ├── ApiServer.h
│   │   ├── BST.h
│   │   ├── Database.h
│   │   ├── HashTable.h
│   │   ├── LinkedList.h
│   │   ├── MaxHeap.h
│   │   ├── Product.h
│   │   ├── ProductLoader.h
│   │   ├── RecommendationEngine.h
│   │   └── User.h
│   └── src/                        # C source implementations
│       ├── ApiServer.c             # libmicrohttpd REST API server
│       ├── BST.c                   # Binary Search Tree implementation
│       ├── Database.c              # SQLite database integration
│       ├── HashTable.c             # Chained Hash Table implementation
│       ├── LinkedList.c            # Interaction Linked List
│       ├── MaxHeap.c               # Priority queue Max Heap
│       ├── ProductLoader.c         # CSV parser
│       ├── RecommendationEngine.c  # Weighted recommendation algorithms
│       ├── User.c                  # User interaction models
│       └── main.c                  # Server entry point
├── data/
│   ├── products.csv                # 40 original merchandise catalog items
│   └── shopsmart.db                # SQLite database
└── frontend/
    ├── index.html                  # HTML entry point with Google Fonts
    ├── package.json
    ├── vite.config.js              # Vite server with reverse proxy for /api
    └── src/
        ├── App.css                 # Anime design system styles
        ├── App.jsx                 # Main state & view controller
        ├── index.css               # Global tokens & CSS reset
        ├── main.jsx
        └── components/
            ├── AuthModal.jsx       # Login/Sign-up dialog
            ├── CartDrawer.jsx      # Slide-over cart with free shipping meter
            ├── CategoryRow.jsx     # 5 category discovery cards
            ├── DsaShowcase.jsx     # Algorithmic recommendation engine showcase
            ├── Footer.jsx          # Brand statement & credits
            ├── Hero.jsx            # High-impact hero section
            ├── Navbar.jsx          # Announcement bar, search, cart badge
            ├── ProductArtwork.jsx  # Procedural SVG artwork generator
            ├── ProductCard.jsx     # Product card with dynamic badges
            ├── ProductDetailsModal.jsx # Product view with fit sizing
            ├── PromoBanner.jsx     # Campaign banner with countdown clock
            └── TrustIndicators.jsx # Secure SQLite & speed badges
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **C Compiler & CMake**: GCC / Clang / MSVC and CMake 3.20+ with SQLite3 and libmicrohttpd.
- **Node.js**: v18+ and npm.

### 2. Running the Backend
From the repository root:
```bash
# Build the C executable
cmake -B backend/build -S backend
cmake --build backend/build

# Run the backend server (starts on port 8080)
cd backend/build
./shopsmart.exe
```

### 3. Running the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/products` | Retrieve all 40 products |
| `GET` | `/api/products/search?q=:query` | Search products via BST |
| `GET` | `/api/products/:id` | Get individual product details |
| `GET` | `/api/recommendations/:userId` | Get Max-Heap recommendations for user |
| `POST` | `/api/auth/login?email=&password=` | User authentication |
| `POST` | `/api/auth/signup?name=&email=&password=` | User registration |
| `GET` | `/api/cart/:userId` | Retrieve user cart |
| `POST` | `/api/cart?userId=&productId=&quantity=` | Add product to cart |
| `DELETE`| `/api/cart/:userId/:productId` | Remove product from cart |

---

## 📜 License
MIT License. Built for educational and portfolio demonstration.
