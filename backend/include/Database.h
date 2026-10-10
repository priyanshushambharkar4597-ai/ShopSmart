#ifndef DATABASE_H
#define DATABASE_H

#include "Product.h"
#include <stddef.h>

int databaseOpen(const char* filename);
int databaseCreateTables(void);

int databaseInsertProduct(Product* product);

int databaseInsertUser(
    int userId,
    const char* name,
    const char* email,
    const char* password
);

int databaseRegisterUser(
    const char* name,
    const char* email,
    const char* password,
    int* newUserId
);

int databaseLoginUser(
    const char* email,
    const char* password,
    int* userId,
    char* name,
    size_t nameSize
);

int databaseInsertInteraction(
    int userId,
    int productId,
    const char* interactionType,
    const char* timestamp
);

int databaseHasUsers(void);

int databaseResetDemoData(void);

int databaseGetProductsJSON(
    char* output,
    size_t outputSize
);

int databaseSearchProductsJSON(
    const char* query,
    char* output,
    size_t outputSize
);

int databaseGetProductByIdJSON(
    int productId,
    char* output,
    size_t outputSize
);

int databaseAddToCart(
    int userId,
    int productId,
    int quantity
);

int databasePrintCart(
    int userId
);

int databaseRemoveFromCart(
    int userId,
    int productId
);

int databaseClearCart(
    int userId
);

int databaseGetCartJSON(
    int userId,
    char* output,
    size_t outputSize
);

int databaseGetUserRecommendationsJSON(
    int userId,
    char* output,
    size_t outputSize
);

void databasePrintContents(void);
void databaseClose(void);

#endif
