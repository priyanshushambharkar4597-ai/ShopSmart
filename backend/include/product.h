#ifndef PRODUCT_H
#define PRODUCT_H

#define MAX_TAGS 10
#define MAX_STRING_LENGTH 100

typedef struct
{
    int id;

    char name[MAX_STRING_LENGTH];
    char category[MAX_STRING_LENGTH];
    char brand[MAX_STRING_LENGTH];

    double price;
    double rating;
    double popularity;

    char tags[MAX_TAGS][MAX_STRING_LENGTH];
    int tagCount;

} Product;

#endif