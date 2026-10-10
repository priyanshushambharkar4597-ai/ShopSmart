#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include <stddef.h>

#define MAX_INTERACTION_TYPE 50
#define MAX_TIMESTAMP 50

typedef struct InteractionNode
{
    int productId;
    char interactionType[MAX_INTERACTION_TYPE];
    char timestamp[MAX_TIMESTAMP];

    struct InteractionNode* next;

} InteractionNode;

typedef struct
{
    InteractionNode* head;
    size_t count;

} LinkedList;

void linkedListInit(LinkedList* list);

void linkedListAdd(
    LinkedList* list,
    int productId,
    const char* interactionType,
    const char* timestamp
);

void linkedListPrint(LinkedList* list);

int linkedListIsEmpty(LinkedList* list);

size_t linkedListSize(LinkedList* list);

void linkedListFree(LinkedList* list);

#endif