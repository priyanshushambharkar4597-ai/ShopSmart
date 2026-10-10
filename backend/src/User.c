#include "../include/User.h"

#include <stdio.h>
#include <string.h>

void userInit(
    User* user,
    int id,
    const char* name
)
{
    user->id = id;

    strncpy(
        user->name,
        name,
        MAX_USER_NAME - 1
    );

    user->name[MAX_USER_NAME - 1] = '\0';

    linkedListInit(
        &user->interactionHistory
    );
}

void userAddInteraction(
    User* user,
    int productId,
    const char* interactionType,
    const char* timestamp
)
{
    linkedListAdd(
        &user->interactionHistory,
        productId,
        interactionType,
        timestamp
    );
}

void userPrintHistory(
    User* user
)
{
    printf(
        "\nInteraction History - %s\n",
        user->name
    );

    linkedListPrint(
        &user->interactionHistory
    );
}

void userFree(
    User* user
)
{
    linkedListFree(
        &user->interactionHistory
    );
}