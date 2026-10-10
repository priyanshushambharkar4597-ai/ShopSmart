#ifndef USER_H
#define USER_H

#include "LinkedList.h"

#define MAX_USER_NAME 100

typedef struct
{
    int id;
    char name[MAX_USER_NAME];

    LinkedList interactionHistory;

} User;

void userInit(
    User* user,
    int id,
    const char* name
);

void userAddInteraction(
    User* user,
    int productId,
    const char* interactionType,
    const char* timestamp
);

void userPrintHistory(
    User* user
);

void userFree(
    User* user
);

#endif