#ifndef BST_H
#define BST_H

#include "Product.h"

typedef struct BSTNode
{
    Product product;

    struct BSTNode* left;
    struct BSTNode* right;

} BSTNode;

typedef struct
{
    BSTNode* root;

} BST;

void bstInit(BST* tree);

void bstInsert(BST* tree, Product product);

Product* bstSearch(BST* tree, const char* name);

void bstDelete(BST* tree, const char* name);

void bstInorder(BST* tree);

void bstFree(BST* tree);

#endif