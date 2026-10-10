#ifndef PRODUCT_LOADER_H
#define PRODUCT_LOADER_H

#include "Product.h"
#include <stddef.h>

int loadProductsFromCSV(
    const char* filename,
    Product products[],
    size_t maxProducts,
    size_t* productCount
);

#endif