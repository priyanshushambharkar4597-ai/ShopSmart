#include "../include/BST.h"

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* Convert a product name to lowercase for consistent searching */
static void normalizeName(const char* input, char* output)
{
    int i = 0;

    while (input[i] != '\0')
    {
        output[i] = (char)tolower((unsigned char)input[i]);
        i++;
    }

    output[i] = '\0';
}

/* Create a new BST node */
static BSTNode* createNode(Product product)
{
    BSTNode* newNode = (BSTNode*)malloc(sizeof(BSTNode));

    if (newNode == NULL)
    {
        printf("Memory allocation failed.\n");
        return NULL;
    }

    newNode->product = product;
    newNode->left = NULL;
    newNode->right = NULL;

    return newNode;
}

void bstInit(BST* tree)
{
    if (tree == NULL)
    {
        return;
    }

    tree->root = NULL;
}

/* Insert a product recursively */
static BSTNode* insertNode(BSTNode* root, Product product)
{
    if (root == NULL)
    {
        return createNode(product);
    }

    char newName[MAX_STRING_LENGTH];
    char rootName[MAX_STRING_LENGTH];

    normalizeName(product.name, newName);
    normalizeName(root->product.name, rootName);

    int comparison = strcmp(newName, rootName);

    if (comparison < 0)
    {
        root->left = insertNode(root->left, product);
    }
    else if (comparison > 0)
    {
        root->right = insertNode(root->right, product);
    }

    return root;
}

/* Public insert function */
void bstInsert(BST* tree, Product product)
{
    if (tree == NULL)
    {
        return;
    }

    tree->root = insertNode(tree->root, product);
}

/* Search recursively */
static Product* searchNode(BSTNode* root, const char* name)
{
    if (root == NULL)
    {
        return NULL;
    }

    char searchName[MAX_STRING_LENGTH];
    char rootName[MAX_STRING_LENGTH];

    normalizeName(name, searchName);
    normalizeName(root->product.name, rootName);

    int comparison = strcmp(searchName, rootName);

    if (comparison == 0)
    {
        return &root->product;
    }

    if (comparison < 0)
    {
        return searchNode(root->left, name);
    }

    return searchNode(root->right, name);
}

/* Public search function */
Product* bstSearch(BST* tree, const char* name)
{
    if (tree == NULL)
    {
        return NULL;
    }

    return searchNode(tree->root, name);
}

/* Find the smallest node in a subtree */
static BSTNode* findMinimum(BSTNode* root)
{
    BSTNode* current = root;

    while (current != NULL && current->left != NULL)
    {
        current = current->left;
    }

    return current;
}

/* Delete a node recursively */
static BSTNode* deleteNode(BSTNode* root, const char* name)
{
    if (root == NULL)
    {
        return NULL;
    }

    char searchName[MAX_STRING_LENGTH];
    char rootName[MAX_STRING_LENGTH];

    normalizeName(name, searchName);
    normalizeName(root->product.name, rootName);

    int comparison = strcmp(searchName, rootName);

    if (comparison < 0)
    {
        root->left = deleteNode(root->left, name);
    }
    else if (comparison > 0)
    {
        root->right = deleteNode(root->right, name);
    }
    else
    {
        /* Case 1: no child */
        if (root->left == NULL && root->right == NULL)
        {
            free(root);
            return NULL;
        }

        /* Case 2: only right child */
        if (root->left == NULL)
        {
            BSTNode* temp = root->right;
            free(root);
            return temp;
        }

        /* Case 3: only left child */
        if (root->right == NULL)
        {
            BSTNode* temp = root->left;
            free(root);
            return temp;
        }

        /* Case 4: two children */
        BSTNode* successor = findMinimum(root->right);

        root->product = successor->product;

        root->right = deleteNode(
            root->right,
            successor->product.name
        );
    }

    return root;
}

/* Public delete function */
void bstDelete(BST* tree, const char* name)
{
    if (tree == NULL)
    {
        return;
    }

    tree->root = deleteNode(tree->root, name);
}

/* In-order traversal */
static void inorderNode(BSTNode* root)
{
    if (root == NULL)
    {
        return;
    }

    inorderNode(root->left);

    printf(
        "%s (ID: %d)\n",
        root->product.name,
        root->product.id
    );

    inorderNode(root->right);
}

/* Public in-order traversal */
void bstInorder(BST* tree)
{
    if (tree == NULL)
    {
        return;
    }

    inorderNode(tree->root);
}

/* Free the complete tree */
static void freeNodes(BSTNode* root)
{
    if (root == NULL)
    {
        return;
    }

    freeNodes(root->left);
    freeNodes(root->right);

    free(root);
}

/* Public cleanup function */
void bstFree(BST* tree)
{
    if (tree == NULL)
    {
        return;
    }

    freeNodes(tree->root);

    tree->root = NULL;
}