#ifndef MAX_HEAP_H
#define MAX_HEAP_H

#include "Product.h"
#include <stddef.h>

typedef struct
{
    Product product;
    double score;

} RecommendationItem;

typedef struct
{
    RecommendationItem* items;
    size_t size;
    size_t capacity;

} MaxHeap;

void maxHeapInit(MaxHeap* heap, size_t capacity);

void maxHeapInsert(
    MaxHeap* heap,
    Product product,
    double score
);

RecommendationItem maxHeapExtractMax(MaxHeap* heap);

int maxHeapIsEmpty(MaxHeap* heap);

size_t maxHeapSize(MaxHeap* heap);

void maxHeapFree(MaxHeap* heap);

#endif