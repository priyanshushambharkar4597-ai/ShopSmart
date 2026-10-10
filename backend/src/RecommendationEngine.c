#include "../include/RecommendationEngine.h"
#include <stdio.h>
#include <string.h>
#include <math.h>

static int hasTag(Product* product, const char* tag)
{
    if (product == NULL || tag == NULL)
        return 0;

    for (int i = 0; i < product->tagCount; i++)
    {
        if (strcmp(product->tags[i], tag) == 0)
            return 1;
    }

    return 0;
}

static int historyContainsProduct(LinkedList* history, int productId)
{
    if (history == NULL)
        return 0;

    InteractionNode* current = history->head;

    while (current != NULL)
    {
        if (current->productId == productId)
            return 1;

        current = current->next;
    }

    return 0;
}

double calculateContentScore(
    Product* userProduct,
    Product* candidateProduct)
{
    if (userProduct == NULL || candidateProduct == NULL)
        return 0.0;

    double categoryMatch = 0.0;
    double tagMatch = 0.0;
    double brandMatch = 0.0;
    double priceSimilarity = 0.0;
    double popularityScore = 0.0;

    /* Category match */
    if (strcmp(userProduct->category, candidateProduct->category) == 0)
        categoryMatch = 1.0;

    /* Tag match */
    if (userProduct->tagCount > 0)
    {
        int matchingTags = 0;

        for (int i = 0; i < userProduct->tagCount; i++)
        {
            if (hasTag(candidateProduct, userProduct->tags[i]))
                matchingTags++;
        }

        tagMatch = (double)matchingTags / userProduct->tagCount;
    }

    /* Brand match */
    if (strcmp(userProduct->brand, candidateProduct->brand) == 0)
        brandMatch = 1.0;

    /* Price similarity */
    if (userProduct->price > 0.0)
    {
        double difference =
            fabs(userProduct->price - candidateProduct->price)
            / userProduct->price;

        priceSimilarity = 1.0 - difference;

        if (priceSimilarity < 0.0)
            priceSimilarity = 0.0;

        if (priceSimilarity > 1.0)
            priceSimilarity = 1.0;
    }

    /* Popularity normalized from 0-100 to 0-1 */
    popularityScore = candidateProduct->popularity / 100.0;

    return
        0.40 * categoryMatch +
        0.25 * tagMatch +
        0.15 * brandMatch +
        0.10 * priceSimilarity +
        0.10 * popularityScore;
}

double calculateUserPreferenceScore(
    LinkedList* history,
    Product* candidateProduct)
{
    if (history == NULL || candidateProduct == NULL)
        return 0.0;

    InteractionNode* current = history->head;

    double totalPreference = 0.0;
    double maximumPreference = 0.0;

    while (current != NULL)
    {
        double interactionWeight = 0.0;

        if (strcmp(current->interactionType, "View") == 0)
            interactionWeight = 1.0;
        else if (strcmp(current->interactionType, "Search Click") == 0)
            interactionWeight = 2.0;
        else if (strcmp(current->interactionType, "Wishlist") == 0)
            interactionWeight = 4.0;
        else if (strcmp(current->interactionType, "Add to Cart") == 0)
            interactionWeight = 5.0;
        else if (strcmp(current->interactionType, "Purchase") == 0)
            interactionWeight = 8.0;

        /*
         * The actual product lookup is performed by the recommendation
         * engine. Here we use the interaction weight as the strength
         * of the user's preference.
         */
        totalPreference += interactionWeight;
        maximumPreference += 8.0;

        current = current->next;
    }

    if (maximumPreference == 0.0)
        return 0.0;

    double historyStrength =
        totalPreference / maximumPreference;

    if (historyStrength > 1.0)
        historyStrength = 1.0;

    /*
     * Candidates receive a preference contribution when their
     * category/tags are represented in the user's history.
     * The detailed matching is handled in generateRecommendations().
     */
    return historyStrength;
}

double calculateFinalScore(
    double contentScore,
    double userPreferenceScore,
    double popularityScore,
    double ratingScore)
{
    return
        0.60 * contentScore +
        0.25 * userPreferenceScore +
        0.10 * popularityScore +
        0.05 * ratingScore;
}

void generateRecommendations(
    LinkedList* history,
    Product products[],
    size_t productCount,
    MaxHeap* recommendationHeap)
{
    if (history == NULL ||
        products == NULL ||
        recommendationHeap == NULL)
    {
        return;
    }

    for (size_t i = 0; i < productCount; i++)
    {
        Product* candidate = &products[i];

        /*
         * Do not recommend products that the user has
         * already interacted with.
         */
        if (historyContainsProduct(history, candidate->id))
            continue;

        double bestContentScore = 0.0;
        double categoryPreference = 0.0;
        double tagPreference = 0.0;

        InteractionNode* current = history->head;

        while (current != NULL)
        {
            /*
             * Find the product associated with this interaction.
             */
            Product* historyProduct = NULL;

            for (size_t j = 0; j < productCount; j++)
            {
                if (products[j].id == current->productId)
                {
                    historyProduct = &products[j];
                    break;
                }
            }

            if (historyProduct != NULL)
            {
                /*
                 * Content similarity between the historical
                 * product and candidate product.
                 */
                double contentScore =
                    calculateContentScore(
                        historyProduct,
                        candidate);

                if (contentScore > bestContentScore)
                    bestContentScore = contentScore;

                /*
                 * Category preference.
                 */
                if (strcmp(
                        historyProduct->category,
                        candidate->category) == 0)
                {
                    categoryPreference = 1.0;
                }

                /*
                 * Tag preference.
                 */
                for (int t = 0;
                     t < historyProduct->tagCount;
                     t++)
                {
                    if (hasTag(
                            candidate,
                            historyProduct->tags[t]))
                    {
                        tagPreference += 1.0;
                    }
                }
            }

            current = current->next;
        }

        /*
         * Normalize tag preference.
         */
        if (tagPreference > 1.0)
            tagPreference = 1.0;

        /*
         * Combine category and tag preferences.
         */
        double userPreferenceScore =
            0.60 * categoryPreference +
            0.40 * tagPreference;

        if (userPreferenceScore > 1.0)
            userPreferenceScore = 1.0;

        /*
         * Normalize popularity and rating.
         */
        double popularityScore =
            candidate->popularity / 100.0;

        double ratingScore =
            candidate->rating / 5.0;

        /*
         * Final weighted recommendation score.
         */
        double finalScore =
            calculateFinalScore(
                bestContentScore,
                userPreferenceScore,
                popularityScore,
                ratingScore);

        maxHeapInsert(
            recommendationHeap,
            *candidate,
            finalScore);
    }
}