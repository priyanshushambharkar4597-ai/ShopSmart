#include "../include/Product.h"
#include "../include/BST.h"
#include "../include/HashTable.h"
#include "../include/LinkedList.h"
#include "../include/MaxHeap.h"
#include "../include/RecommendationEngine.h"
#include "../include/ProductLoader.h"
#include "../include/User.h"
#include "../include/Database.h"
#include "../include/ApiServer.h"

#include <stdio.h>
#include <stdlib.h>

#define MAX_PRODUCTS 300

void showRecommendations(
    User* user,
    Product products[],
    size_t productCount)
{
    MaxHeap recommendationHeap;

    maxHeapInit(
        &recommendationHeap,
        productCount
    );

    generateRecommendations(
        &user->interactionHistory,
        products,
        productCount,
        &recommendationHeap
    );

    printf("\n============================\n");
    printf("Top 5 Recommendations for %s\n", user->name);
    printf("============================\n");

    int rank = 1;

    while (
        !maxHeapIsEmpty(&recommendationHeap) &&
        rank <= 5
    )
    {
        RecommendationItem item =
            maxHeapExtractMax(
                &recommendationHeap
            );

        printf(
            "%d. %s | Score: %.2f\n",
            rank,
            item.product.name,
            item.score
        );

        rank++;
    }

    maxHeapFree(&recommendationHeap);
}

int main(void)
{
    Product products[MAX_PRODUCTS];
    size_t productCount = 0;

    BST productTree;
    HashTable productTable;

    User user1;
    User user2;

    printf("============================\n");
    printf("      SHOPSMART PROJECT\n");
    printf("============================\n");

    printf("\nLoading product dataset...\n");

    if (loadProductsFromCSV(
            "../../data/products.csv",
            products,
            MAX_PRODUCTS,
            &productCount) != 0)
    {
        printf("Failed to load product dataset.\n");
        return 1;
    }

    printf(
        "Successfully loaded %zu products.\n",
        productCount
    );

    printf("\n============================\n");
    printf("BST TEST\n");
    printf("============================\n");

    bstInit(&productTree);

    for (size_t i = 0; i < productCount; i++)
    {
        bstInsert(
            &productTree,
            products[i]
        );
    }

    printf("\nBST alphabetical order:\n");

    bstInorder(&productTree);

    Product* foundProduct =
        bstSearch(
            &productTree,
            "Wireless Earphones"
        );

    if (foundProduct != NULL)
    {
        printf(
            "\nBST Search Found: %s | ID: %d\n",
            foundProduct->name,
            foundProduct->id
        );
    }

    printf("\n============================\n");
    printf("HASH TABLE TEST\n");
    printf("============================\n");

    hashTableInit(
        &productTable,
        16
    );

    for (size_t i = 0; i < productCount; i++)
    {
        hashTableInsert(
            &productTable,
            products[i]
        );
    }

    Product* hashProduct =
        hashTableSearch(
            &productTable,
            102
        );

    if (hashProduct != NULL)
    {
        printf(
            "\nHash Search Found: %s | ID: %d\n",
            hashProduct->name,
            hashProduct->id
        );
    }

    hashTablePrintStatistics(
        &productTable
    );

    printf("\n============================\n");
    printf("USER PROFILES\n");
    printf("============================\n");

    userInit(
        &user1,
        1,
        "Priya"
    );

    userInit(
        &user2,
        2,
        "Rahul"
    );

    userAddInteraction(
        &user1,
        101,
        "View",
        "2026-09-23 10:00:00"
    );

    userAddInteraction(
        &user1,
        102,
        "Wishlist",
        "2026-09-23 10:05:00"
    );

    userAddInteraction(
        &user1,
        104,
        "Add to Cart",
        "2026-09-23 10:10:00"
    );

    userAddInteraction(
        &user2,
        109,
        "View",
        "2026-09-23 11:00:00"
    );

    userAddInteraction(
        &user2,
        110,
        "Wishlist",
        "2026-09-23 11:05:00"
    );

    userAddInteraction(
        &user2,
        108,
        "Add to Cart",
        "2026-09-23 11:10:00"
    );

    userPrintHistory(&user1);
    userPrintHistory(&user2);

    printf("\n============================\n");
    printf("RECOMMENDATION ENGINE\n");
    printf("============================\n");

    showRecommendations(
        &user1,
        products,
        productCount
    );

    showRecommendations(
        &user2,
        products,
        productCount
    );

    printf("\n============================\n");
    printf("SQLITE DATABASE\n");
    printf("============================\n");

    /*
     * databaseOpen returns:
     * 1 = success
     * 0 = failure
     */
    if (!databaseOpen(
            "../../data/shopsmart.db"))
    {
        printf(
            "Failed to open SQLite database.\n"
        );

        return 1;
    }

    if (!databaseCreateTables())
    {
        printf(
            "Failed to create database tables.\n"
        );

        databaseClose();

        return 1;
    }

    /* Registered accounts, carts, and interaction history must survive restarts. */

    printf(
        "\nInserting products into SQLite...\n"
    );

    for (size_t i = 0; i < productCount; i++)
    {
        databaseInsertProduct(
            &products[i]
        );
    }

    printf(
        "%zu products inserted.\n",
        productCount
    );

    printf(
        "\nInserting users into SQLite...\n"
    );

    if (!databaseHasUsers())
    {

    databaseInsertUser(
        user1.id,
        user1.name,
        "priya.demo@shopsmart.local",
        "demo-password"
    );

    databaseInsertUser(
        user2.id,
        user2.name,
        "rahul.demo@shopsmart.local",
        "demo-password"
    );

    databaseInsertInteraction(
        1,
        101,
        "View",
        "2026-09-23 10:00:00"
    );

    databaseInsertInteraction(
        1,
        102,
        "Wishlist",
        "2026-09-23 10:05:00"
    );

    databaseInsertInteraction(
        1,
        104,
        "Add to Cart",
        "2026-09-23 10:10:00"
    );

    databaseInsertInteraction(
        2,
        109,
        "View",
        "2026-09-23 11:00:00"
    );

    databaseInsertInteraction(
        2,
        110,
        "Wishlist",
        "2026-09-23 11:05:00"
    );

    databaseInsertInteraction(
        2,
        108,
        "Add to Cart",
        "2026-09-23 11:10:00"
    );

    printf(
        "6 interactions inserted.\n"
    );

    printf("\n============================\n");
    printf("CART TEST\n");
    printf("============================\n");

    databaseAddToCart(
        1,
        101,
        1
    );

    databaseAddToCart(
        1,
        102,
        2
    );

    databaseAddToCart(
        1,
        101,
        1
    );

    databaseAddToCart(
        2,
        107,
        1
    );

    databaseAddToCart(
        2,
        111,
        1
    );

    databasePrintCart(1);
    databasePrintCart(2);
    }
    else
    {
        printf("Existing users found; preserving authentication, carts, and history.\n");
    }

    databasePrintContents();

    printf("\n");
    printf("============================\n");
    printf("STARTING SHOPSMART API\n");
    printf("============================\n");

    /*
     * IMPORTANT:
     * Do NOT close SQLite here.
     * ApiServer.c uses the same open database.
     */
    if (!startApiServer(8080))
    {
        printf(
            "ShopSmart API server could not start.\n"
        );

        databaseClose();

        userFree(&user1);
        userFree(&user2);

        hashTableFree(&productTable);
        bstFree(&productTree);

        return 1;
    }

    databaseClose();

    userFree(&user1);
    userFree(&user2);

    hashTableFree(&productTable);
    bstFree(&productTree);

    return 0;
}
