#include "../include/HashTable.h"

#include <stdio.h>
#include <stdlib.h>

static size_t hashFunction(HashTable* table, int key)
{
    return (size_t)key % table->tableSize;
}

static double loadFactor(HashTable* table)
{
    return (double)table->elementCount / table->tableSize;
}

static void rehash(HashTable* table)
{
    size_t oldSize = table->tableSize;
    HashEntry** oldBuckets = table->buckets;

    table->tableSize *= 2;

    table->buckets = (HashEntry**)calloc(
        table->tableSize,
        sizeof(HashEntry*)
    );

    table->elementCount = 0;

    for (size_t i = 0; i < oldSize; i++)
    {
        HashEntry* current = oldBuckets[i];

        while (current != NULL)
        {
            HashEntry* next = current->next;

            size_t index = hashFunction(table, current->key);

            current->next = table->buckets[index];
            table->buckets[index] = current;

            table->elementCount++;

            current = next;
        }
    }

    free(oldBuckets);
}

void hashTableInit(HashTable* table, size_t initialSize)
{
    table->tableSize = initialSize;
    table->elementCount = 0;

    table->buckets = (HashEntry**)calloc(
        initialSize,
        sizeof(HashEntry*)
    );
}

void hashTableInsert(HashTable* table, Product product)
{
    size_t index = hashFunction(table, product.id);

    HashEntry* current = table->buckets[index];

    while (current != NULL)
    {
        if (current->key == product.id)
        {
            current->product = product;
            return;
        }

        current = current->next;
    }

    HashEntry* newEntry =
        (HashEntry*)malloc(sizeof(HashEntry));

    if (newEntry == NULL)
    {
        printf("Memory allocation failed.\n");
        return;
    }

    newEntry->key = product.id;
    newEntry->product = product;

    newEntry->next = table->buckets[index];
    table->buckets[index] = newEntry;

    table->elementCount++;

    if (loadFactor(table) > 0.75)
    {
        rehash(table);
    }
}

Product* hashTableSearch(HashTable* table, int productId)
{
    size_t index = hashFunction(table, productId);

    HashEntry* current = table->buckets[index];

    while (current != NULL)
    {
        if (current->key == productId)
        {
            return &current->product;
        }

        current = current->next;
    }

    return NULL;
}

int hashTableRemove(HashTable* table, int productId)
{
    size_t index = hashFunction(table, productId);

    HashEntry* current = table->buckets[index];
    HashEntry* previous = NULL;

    while (current != NULL)
    {
        if (current->key == productId)
        {
            if (previous == NULL)
            {
                table->buckets[index] = current->next;
            }
            else
            {
                previous->next = current->next;
            }

            free(current);
            table->elementCount--;

            return 1;
        }

        previous = current;
        current = current->next;
    }

    return 0;
}

size_t hashTableSize(HashTable* table)
{
    return table->elementCount;
}

void hashTablePrintStatistics(HashTable* table)
{
    printf("Hash Table Statistics\n");
    printf("---------------------\n");
    printf("Buckets: %zu\n", table->tableSize);
    printf("Products: %zu\n", table->elementCount);
    printf("Load Factor: %.2f\n", loadFactor(table));
}

void hashTableFree(HashTable* table)
{
    for (size_t i = 0; i < table->tableSize; i++)
    {
        HashEntry* current = table->buckets[i];

        while (current != NULL)
        {
            HashEntry* next = current->next;

            free(current);

            current = next;
        }
    }

    free(table->buckets);

    table->buckets = NULL;
    table->tableSize = 0;
    table->elementCount = 0;
}