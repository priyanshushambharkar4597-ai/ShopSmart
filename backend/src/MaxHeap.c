#include "../include/MaxHeap.h"

#include <stdio.h>
#include <stdlib.h>

static void swapItems(
    RecommendationItem* a,
    RecommendationItem* b
)
{
    RecommendationItem temp = *a;
    *a = *b;
    *b = temp;
}

static void heapifyUp(MaxHeap* heap, size_t index)
{
    while (index > 0)
    {
        size_t parent = (index - 1) / 2;

        if (heap->items[parent].score >=
            heap->items[index].score)
        {
            break;
        }

        swapItems(
            &heap->items[parent],
            &heap->items[index]
        );

        index = parent;
    }
}

static void heapifyDown(MaxHeap* heap, size_t index)
{
    while (1)
    {
        size_t left = 2 * index + 1;
        size_t right = 2 * index + 2;
        size_t largest = index;

        if (left < heap->size &&
            heap->items[left].score >
            heap->items[largest].score)
        {
            largest = left;
        }

        if (right < heap->size &&
            heap->items[right].score >
            heap->items[largest].score)
        {
            largest = right;
        }

        if (largest == index)
        {
            break;
        }

        swapItems(
            &heap->items[index],
            &heap->items[largest]
        );

        index = largest;
    }
}

void maxHeapInit(MaxHeap* heap, size_t capacity)
{
    heap->items = (RecommendationItem*)malloc(
        capacity * sizeof(RecommendationItem)
    );

    if (heap->items == NULL)
    {
        printf("Memory allocation failed.\n");
        heap->size = 0;
        heap->capacity = 0;
        return;
    }

    heap->size = 0;
    heap->capacity = capacity;
}

void maxHeapInsert(
    MaxHeap* heap,
    Product product,
    double score
)
{
    if (heap->size >= heap->capacity)
    {
        size_t newCapacity = heap->capacity * 2;

        RecommendationItem* newItems =
            (RecommendationItem*)realloc(
                heap->items,
                newCapacity * sizeof(RecommendationItem)
            );

        if (newItems == NULL)
        {
            printf("Memory reallocation failed.\n");
            return;
        }

        heap->items = newItems;
        heap->capacity = newCapacity;
    }

    heap->items[heap->size].product = product;
    heap->items[heap->size].score = score;

    heapifyUp(heap, heap->size);

    heap->size++;
}

RecommendationItem maxHeapExtractMax(MaxHeap* heap)
{
    RecommendationItem result;

    result.score = -1.0;

    if (heap->size == 0)
    {
        return result;
    }

    result = heap->items[0];

    heap->size--;

    if (heap->size > 0)
    {
        heap->items[0] = heap->items[heap->size];

        heapifyDown(heap, 0);
    }

    return result;
}

int maxHeapIsEmpty(MaxHeap* heap)
{
    return heap->size == 0;
}

size_t maxHeapSize(MaxHeap* heap)
{
    return heap->size;
}

void maxHeapFree(MaxHeap* heap)
{
    free(heap->items);

    heap->items = NULL;
    heap->size = 0;
    heap->capacity = 0;
}