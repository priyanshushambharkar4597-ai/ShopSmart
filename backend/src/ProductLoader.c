#include "../include/ProductLoader.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int loadProductsFromCSV(
    const char* filename,
    Product products[],
    size_t maxProducts,
    size_t* productCount)
{
    FILE* file;
    char line[2048];

    if (products == NULL ||
        productCount == NULL ||
        filename == NULL)
    {
        return 1;
    }

    *productCount = 0;

    file = fopen(filename, "r");

    if (file == NULL)
    {
        printf("Could not open CSV file: %s\n", filename);
        return 1;
    }

    /* Skip CSV header */
    if (fgets(line, sizeof(line), file) == NULL)
    {
        fclose(file);
        return 1;
    }

    while (fgets(line, sizeof(line), file) != NULL)
    {
        char* token;
        Product product;

        if (*productCount >= maxProducts)
        {
            break;
        }

        memset(&product, 0, sizeof(Product));

        /* Remove newline characters */
        line[strcspn(line, "\r\n")] = '\0';

        /* ID */
        token = strtok(line, ",");

        if (token == NULL)
            continue;

        product.id = atoi(token);

        /* Name */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strncpy(
            product.name,
            token,
            MAX_STRING_LENGTH - 1
        );

        /* Category */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strncpy(
            product.category,
            token,
            MAX_STRING_LENGTH - 1
        );

        /* Brand */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        strncpy(
            product.brand,
            token,
            MAX_STRING_LENGTH - 1
        );

        /* Price */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        product.price = atof(token);

        /* Rating */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        product.rating = atof(token);

        /* Popularity */
        token = strtok(NULL, ",");

        if (token == NULL)
            continue;

        product.popularity = atof(token);

        /* Tags */
        token = strtok(NULL, ",");

        if (token != NULL)
        {
            char* tagToken;

            tagToken = strtok(token, "|");

            while (
                tagToken != NULL &&
                product.tagCount < MAX_TAGS
            )
            {
                strncpy(
                    product.tags[product.tagCount],
                    tagToken,
                    MAX_STRING_LENGTH - 1
                );

                product.tags[
                    product.tagCount
                ][MAX_STRING_LENGTH - 1] = '\0';

                product.tagCount++;

                tagToken = strtok(NULL, "|");
            }
        }

        product.name[MAX_STRING_LENGTH - 1] = '\0';
        product.category[MAX_STRING_LENGTH - 1] = '\0';
        product.brand[MAX_STRING_LENGTH - 1] = '\0';

        products[*productCount] = product;
        (*productCount)++;
    }

    fclose(file);

    return 0;
}