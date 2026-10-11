# SHOPSMART — COMPLETE TECH STACK & SYSTEM ARCHITECTURE SPECIFICATION
**Reference Document for AI Assistants, Engineering Teams, and Technical Reviewers**

---

## 1. EXECUTIVE SYSTEM SUMMARY

- **Project Name**: ShopSmart
- **Tagline**: High-Performance E-Commerce & Anime Merchandise Platform Powered by Custom C Data Structures & Algorithms
- **Live Production URL**: [https://priyanshushambharkar4597-ai.github.io/ShopSmart/](https://priyanshushambharkar4597-ai.github.io/ShopSmart/)
- **Repository**: [https://github.com/priyanshushambharkar4597-ai/ShopSmart](https://github.com/priyanshushambharkar4597-ai/ShopSmart)
- **Primary Paradigms**:
  1. Low-level algorithmic core written in **pure C (C11)**.
  2. Transactional relational database with **SQLite3**.
  3. High-throughput embedded HTTP micro-server with **GNU libmicrohttpd**.
  4. Ultra-responsive single-page storefront written in **React 19** and bundled with **Vite 8**.
  5. Uncompromising **Raw Brutalist UI identity** (pure black, white, signal red, 2px grid lines, zero border-radius).

---

## 2. SYSTEM ARCHITECTURE & REPOSITORY TREE

```
ShopSmart/
├── backend/                        # C11 Core Engine & Micro-API
│   ├── CMakeLists.txt              # CMake build definitions (C11, link sqlite3, microhttpd, m)
│   ├── include/                    # Header interfaces
│   │   ├── ApiServer.h             # libmicrohttpd HTTP router and JSON serializers
│   │   ├── BST.h                   # Binary Search Tree declarations
│   │   ├── Database.h              # SQLite3 database wrappers and prepared statements
│   │   ├── HashTable.h             # Chained Hash Table declarations
│   │   ├── LinkedList.h            # User interaction Linked List declarations
│   │   ├── MaxHeap.h               # Recommendation Priority Queue declarations
│   │   ├── Product.h               # Core Product struct definitions
│   │   ├── ProductLoader.h         # CSV catalog parser
│   │   ├── RecommendationEngine.h  # Multi-factor scoring functions
│   │   └── User.h                  # User model definitions
│   └── src/                        # C11 implementations
│       ├── ApiServer.c             # REST API server (CORS, JSON formatting, route dispatch)
│       ├── BST.c                   # Case-insensitive BST insert/search/delete
│       ├── Database.c              # Schema creation, transactions, auth, cart SQL
│       ├── HashTable.c             # Separate chaining hash table with dynamic rehash
│       ├── LinkedList.c            # Chronological interaction logger
│       ├── MaxHeap.c               # Array-backed Max Heap with heapifyUp/Down
│       ├── ProductLoader.c         # CSV tokenizer and product population
│       ├── RecommendationEngine.c  # Weighted hybrid recommendation algorithms
│       ├── User.c                  # User helper routines
│       └── main.c                  # Server initialization and event loop
├── data/
│   ├── products.csv                # 40 seed products across 5 merchandise universes
│   └── shopsmart.db                # SQLite transactional database
├── frontend/                       # React 19 + Vite 8 SPA Storefront
│   ├── index.html                  # HTML5 entry with Space Grotesk & Space Mono fonts
│   ├── package.json                # React 19, Vite 8, Lucide React, Oxlint
│   ├── vite.config.js              # Vite bundler config with GitHub Pages base path
│   └── src/
│       ├── App.css                 # Raw Brutalist CSS design system (~1100 lines)
│       ├── App.jsx                 # Top-level state orchestrator, filters, cart, auth
│       ├── index.css               # Global reset: 0 border radius, 0 shadow, 3px focus
│       ├── main.jsx                # React root mount
│       ├── data/
│       │   └── products.json       # Bundled catalogue with high-res photography URLs
│       └── components/
│           ├── AuthModal.jsx       # Brutalist authentication modal (demo fast-logins)
│           ├── CartDrawer.jsx      # Slide-in cart manifest with shipping progress
│           ├── CategoryRow.jsx     # 5-cell spreadsheet category discovery row
│           ├── DsaShowcase.jsx     # Algorithmic spec matrix & DSA visualizer
│           ├── Footer.jsx          # Dense industrial footer with DSA credits
│           ├── Hero.jsx            # Asymmetric typographic manifesto hero
│           ├── Navbar.jsx          # Sticky header, ticker bar, square CART [N] tag
│           ├── ProductArtwork.jsx  # Brutalist specimen photo frame with SVG fallback
│           ├── ProductCard.jsx     # Table-grid card with square badges & mono prices
│           ├── ProductDetailsModal.jsx # Split-view technical blueprint specification
│           ├── PromoBanner.jsx     # Full-width Signal Red (#FF2A00) discount poster
│           └── TrustIndicators.jsx # 4-cell table row with architectural assurances
├── .github/workflows/
│   ├── ci.yml                      # Automated build & testing workflow
│   └── jekyll-gh-pages.yml         # Automated Vite build & GitHub Pages deployment
├── DSA_VIVA_QUESTIONS_AND_ANSWERS.md# 20-Question DSA Viva study guide & question bank
└── TECH_STACK_SPECIFICATION.md     # This comprehensive technical reference document
```

---

## 3. BACKEND TECH STACK SPECIFICATION

| Component | Technology | Version / Specification | Rationale & Usage |
| :--- | :--- | :--- | :--- |
| **Language** | C | C11 (`-std=c11`) | Maximum runtime performance, predictable memory footprint, manual memory management (`malloc`/`free`). |
| **Build System** | CMake + Ninja / Make | CMake 3.20+ | Cross-platform build automation generating native compilation targets for GCC, Clang, and MSVC. |
| **HTTP Server** | GNU libmicrohttpd | `microhttpd` | Compact, thread-pool embedded C HTTP web server providing REST endpoints on port 8080. |
| **Database** | SQLite | SQLite 3 (`sqlite3`) | Serverless, zero-configuration ACID relational storage with foreign key constraints enabled. |
| **Math Library** | Standard C Math | `libm` (`-lm`) | Used in recommendation scoring for floating-point distance and normalization (`fabs`). |

### Backend REST API Endpoints
- `GET /api/products`: Returns full catalogue in JSON format ($O(1)$ from memory).
- `GET /api/products/search?q={query}`: Lexicographical search using the **Binary Search Tree** ($O(\log N)$).
- `GET /api/products/{id}`: Direct product dereference using the **Hash Table** ($O(1)$).
- `GET /api/recommendations?userId={id}`: Generates top personalized items using the **Linked List + Max Heap** ($O(K \log N)$).
- `GET /api/cart/{userId}`: Retrieves active cart items and quantities from SQLite.
- `POST /api/cart`: Adds/increments product in user's cart in SQLite.
- `DELETE /api/cart/{userId}/{productId}`: Removes item from cart in SQLite.
- `POST /api/auth/login?email={e}&password={p}`: Authenticates user credentials against SQLite.
- `POST /api/auth/signup?email={e}&password={p}&name={n}`: Creates a new user record in SQLite.

---

## 4. DATA STRUCTURES & ALGORITHMIC CORE

### A. Binary Search Tree (BST)
- **Source Files**: `backend/include/BST.h`, `backend/src/BST.c`
- **Purpose**: Catalogue search and lexicographical indexing by product name.
- **Node Structure**:
  ```c
  typedef struct BSTNode {
      Product product;
      struct BSTNode* left;
      struct BSTNode* right;
  } BSTNode;
  ```
- **Key Characteristics**:
  - Case-insensitive string normalization (`normalizeName()` via `tolower()`).
  - Standard `strcmp()` recursive navigation.
  - Three-case deletion with in-order successor resolution via `findMinimum(root->right)`.
  - **Complexity**: Search & Insert $O(\log N)$ average, $O(N)$ worst-case; In-order traversal $O(N)$.

### B. Chained Hash Table
- **Source Files**: `backend/include/HashTable.h`, `backend/src/HashTable.c`
- **Purpose**: Constant-time $O(1)$ product retrieval by unique integer `productId`.
- **Collision Resolution**: Separate Chaining with singly linked bucket chains (`HashEntry* next`).
- **Hash Function**:
  $$\text{Index} = \text{key} \pmod{\text{tableSize}}$$
- **Dynamic Resizing**:
  - Monitors load factor $\alpha = \frac{\text{elementCount}}{\text{tableSize}}$.
  - Executes `rehash()` when threshold is reached: doubles bucket size, allocates new pointer array via `calloc()`, re-hashes existing nodes, and frees stale bucket array.
  - **Complexity**: Average $O(1)$ lookup, insertion, and deletion.

### C. Singly Linked List
- **Source Files**: `backend/include/LinkedList.h`, `backend/src/LinkedList.c`
- **Purpose**: Dynamic chronological stream of user behavioral interactions.
- **Node Structure**:
  ```c
  typedef struct InteractionNode {
      int productId;
      char interactionType[32]; /* "View", "Wishlist", "Add to Cart", "Purchase" */
      char timestamp[32];
      struct InteractionNode* next;
  } InteractionNode;
  ```
- **Key Characteristics**:
  - Unbounded dynamic allocation; avoids fixed-array resizing overhead.
  - Fast $O(1)$ appends.
  - Provides sequential pass-through for computing user category affinity.

### D. Max Heap (Priority Queue)
- **Source Files**: `backend/include/MaxHeap.h`, `backend/src/MaxHeap.c`
- **Purpose**: Extracting top $K$ personalized recommendations.
- **Representation**: Contiguous 1D array (`RecommendationItem items[]`) representing a complete binary tree:
  - Parent: $\lfloor\frac{i - 1}{2}\rfloor$ | Left: $2i + 1$ | Right: $2i + 2$.
- **Algorithms**:
  - `heapifyUp()`: Restores max heap property on insert in $O(\log N)$.
  - `heapifyDown()`: Restores max heap property on extract-max in $O(\log N)$.
- **Advantage Over Sorting**: Extracting top $K$ items takes $O(K \log N)$, substantially faster than full sorting ($O(N \log N)$) when $K \ll N$.

---

## 5. RECOMMENDATION SCORING MATHEMATICS

Implemented in `backend/src/RecommendationEngine.c`:

$$\text{FinalScore} = 0.60 \times S_{\text{content}} + 0.25 \times S_{\text{preference}} + 0.10 \times S_{\text{popularity}} + 0.05 \times S_{\text{rating}}$$

### 1. Content Similarity Score ($S_{\text{content}}$):
$$S_{\text{content}} = 0.40 \cdot M_{\text{category}} + 0.25 \cdot M_{\text{tags}} + 0.15 \cdot M_{\text{brand}} + 0.10 \cdot P_{\text{sim}} + 0.10 \cdot \frac{\text{popularity}}{100}$$

Where price similarity is:
$$P_{\text{sim}} = 1.0 - \frac{|P_{\text{user}} - P_{\text{candidate}}|}{P_{\text{user}}} \quad (\text{clamped between } 0.0 \text{ and } 1.0)$$

### 2. User Behavioral Interaction Weights ($S_{\text{preference}}$):
- Product View: **$1.0$**
- Search Click: **$2.0$**
- Wishlist: **$4.0$**
- Add to Cart: **$5.0$**
- Purchase: **$8.0$**

---

## 6. FRONTEND TECH STACK SPECIFICATION

| Component | Technology | Version | Rationale & Usage |
| :--- | :--- | :--- | :--- |
| **Framework** | React | `^19.2.8` | High-performance component tree, concurrent rendering, native Hooks. |
| **Build Tool / Bundler** | Vite | `^8.3.0` | Sub-second HMR, Rollup production bundling, zero-configuration CSS support. |
| **Linter** | Oxlint | `^1.81.0` | Rust-powered high-speed linter enforcing strict standard practices. |
| **Icon System** | Lucide React | `^1.54.0` | Minimalist line icons rendered with uniform 2px stroke width. |
| **Fonts** | Google Fonts | Web CDN | Space Grotesk (Bold headlines), Space Mono & JetBrains Mono (Specs, pricing, code). |

### Design System: Raw Brutalism
- **Color Palette (Strict)**:
  - Background: Plain white (`#FFFFFF`) or light grey (`#EAEAEA`).
  - Text & Borders: Pure dense black (`#000000`).
  - Accent Color: **Signal Red (`#FF2A00`)** used strictly for CTAs, active states, and sale tags.
- **Surface & Geometry**:
  - `border-radius: 0 !important` on every button, card, modal, and input.
  - `box-shadow: none !important` (zero soft drops, zero blurs, zero glow).
  - 2px solid black dividers and spreadsheet grid lines.
  - Mechanical transitions: Instant color inversions on hover (`transition: none !important`), no smooth fades.
- **Copywriting Tone**:
  - Dry, concise, human Indian-English voice (*"Built in Bharat"*, *"Dispatched via Speed Post & Bluedart"*, *"Otaku Grade Goods"*).
  - Absolutely zero marketing filler (*"elevate"*, *"seamless"*, *"unleash"*) and zero emojis.

---

## 7. DATA LAYER & STORAGE SCHEMAS

### SQLite Database (`data/shopsmart.db`)

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL,
    rating REAL NOT NULL,
    popularity REAL NOT NULL,
    tags TEXT
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    interaction_type TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE recommendation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recommended_product_id INTEGER NOT NULL,
    score REAL NOT NULL,
    timestamp TEXT NOT NULL
);
```

---

## 8. DEPLOYMENT & CI/CD PIPELINE

- **CI Pipeline (`.github/workflows/ci.yml`)**:
  - Builds the C executable via CMake and runs memory checks.
  - Runs frontend linting via `oxlint` and production build via `npm run build`.
- **CD Pipeline (`.github/workflows/jekyll-gh-pages.yml`)**:
  - Triggers on every `push` to `main`.
  - Installs Node dependencies (`npm ci`).
  - Builds Vite client bundle to `frontend/dist/`.
  - Deploys static bundle directly to **GitHub Pages** with `.nojekyll` bypass.
- **Hybrid Hosting Architecture**:
  - **Online Mode (GitHub Pages)**: Runs the React frontend client-side, using `frontend/src/data/products.json` and client-side simulation for DSA ranking and localStorage cart persistence.
  - **Local Mode**: When the C backend binary is started (`./backend/build/shopsmart`), the React client connects to `localhost:8080` for live C execution and SQLite persistence.

---

## 9. QUICK REPRODUCIBILITY GUIDE

```bash
# 1. Clone repository
git clone https://github.com/priyanshushambharkar4597-ai/ShopSmart.git
cd ShopSmart

# 2. Build & Run C Backend (Port 8080)
cmake -B backend/build -S backend
cmake --build backend/build
./backend/build/shopsmart

# 3. Run Frontend Development Server (Port 5173)
cd frontend
npm install
npm run dev

# 4. Run Production Build & Lint
npm run lint
npm run build
```
