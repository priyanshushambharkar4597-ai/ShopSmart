#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include "Product.h"
#include <stddef.h>

typedef struct HashEntry
{
    int key;
    Product product;
    struct HashEntry* next;

} HashEntry;

typedef struct
{
    HashEntry** buckets;
    size_t tableSize;
    size_t elementCount;

} HashTable;

void hashTableInit(HashTable* table, size_t initialSize);

void hashTableInsert(HashTable* table, Product product);

Product* hashTableSearch(HashTable* table, int productId);

int hashTableRemove(HashTable* table, int productId);

size_t hashTableSize(HashTable* table);

void hashTablePrintStatistics(HashTable* table);

void hashTableFree(HashTable* table);

#endif