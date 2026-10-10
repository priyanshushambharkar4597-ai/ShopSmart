cmake_minimum_required(VERSION 3.20)

project(ShopSmart C)

set(CMAKE_C_STANDARD 17)
set(CMAKE_C_STANDARD_REQUIRED ON)

add_executable(shopsmart
    src/main.c
    src/BST.c
    src/HashTable.c
    src/LinkedList.c
    src/MaxHeap.c
    src/RecommendationEngine.c
    src/ProductLoader.c
    src/User.c
    src/Database.c
    src/ApiServer.c
)

target_include_directories(shopsmart PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_link_libraries(shopsmart PRIVATE
    sqlite3
    microhttpd
)