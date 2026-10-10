#include "../include/LinkedList.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void linkedListInit(LinkedList* list)
{
    list->head = NULL;
    list->count = 0;
}

void linkedListAdd(
    LinkedList* list,
    int productId,
    const char* interactionType,
    const char* timestamp
)
{
    InteractionNode* newNode =
        (InteractionNode*)malloc(sizeof(InteractionNode));

    if (newNode == NULL)
    {
        printf("Memory allocation failed.\n");
        return;
    }

    newNode->productId = productId;

    strncpy(
        newNode->interactionType,
        interactionType,
        MAX_INTERACTION_TYPE - 1
    );

    newNode->interactionType[MAX_INTERACTION_TYPE - 1] = '\0';

    strncpy(
        newNode->timestamp,
        timestamp,
        MAX_TIMESTAMP - 1
    );

    newNode->timestamp[MAX_TIMESTAMP - 1] = '\0';

    newNode->next = NULL;

    if (list->head == NULL)
    {
        list->head = newNode;
    }
    else
    {
        InteractionNode* current = list->head;

        while (current->next != NULL)
        {
            current = current->next;
        }

        current->next = newNode;
    }

    list->count++;
}

void linkedListPrint(LinkedList* list)
{
    InteractionNode* current = list->head;

    printf("\nUser Interaction History\n");
    printf("------------------------\n");

    while (current != NULL)
    {
        printf(
            "Product ID: %d | Interaction: %s | Time: %s\n",
            current->productId,
            current->interactionType,
            current->timestamp
        );

        current = current->next;
    }
}

int linkedListIsEmpty(LinkedList* list)
{
    return list->head == NULL;
}

size_t linkedListSize(LinkedList* list)
{
    return list->count;
}

void linkedListFree(LinkedList* list)
{
    InteractionNode* current = list->head;

    while (current != NULL)
    {
        InteractionNode* next = current->next;

        free(current);

        current = next;
    }

    list->head = NULL;
    list->count = 0;
}