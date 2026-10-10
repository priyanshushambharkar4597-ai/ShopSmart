#ifndef RECOMMENDATION_ENGINE_H
#define RECOMMENDATION_ENGINE_H

#include "Product.h"
#include "LinkedList.h"
#include "MaxHeap.h"

double calculateContentScore(
    Product* userProduct,
    Product* candidateProduct
);

double calculateUserPreferenceScore(
    LinkedList* history,
    Product* candidateProduct
);

double calculateFinalScore(
    double contentScore,
    double userPreferenceScore,
    double popularityScore,
    double ratingScore
);

void generateRecommendations(
    LinkedList* history,
    Product products[],
    size_t productCount,
    MaxHeap* recommendationHeap
);

#endif