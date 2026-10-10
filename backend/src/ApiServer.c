#include "../include/ApiServer.h"
#include "../include/Database.h"

#include <microhttpd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define PRODUCT_JSON_SIZE 65536

static enum MHD_Result sendJson(
    struct MHD_Connection* connection,
    const char* json,
    unsigned int statusCode)
{
    struct MHD_Response* response;

    response = MHD_create_response_from_buffer(
        strlen(json),
        (void*)json,
        MHD_RESPMEM_MUST_COPY
    );

    if (response == NULL)
        return MHD_NO;

    MHD_add_response_header(
        response,
        "Content-Type",
        "application/json"
    );

    MHD_add_response_header(
        response,
        "Access-Control-Allow-Origin",
        "*"
    );

    MHD_add_response_header(
        response,
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );

    MHD_add_response_header(
        response,
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    enum MHD_Result result =
        MHD_queue_response(
            connection,
            statusCode,
            response
        );

    MHD_destroy_response(response);

    return result;
}

static int getQueryInt(
    struct MHD_Connection* connection,
    const char* name,
    int defaultValue)
{
    const char* value;
    char* endPtr;
    long number;

    value = MHD_lookup_connection_value(
        connection,
        MHD_GET_ARGUMENT_KIND,
        name
    );

    if (value == NULL)
        return defaultValue;

    number = strtol(value, &endPtr, 10);

    if (endPtr == value)
        return defaultValue;

    return (int)number;
}

static const char* getQueryText(
    struct MHD_Connection* connection,
    const char* name
)
{
    return MHD_lookup_connection_value(
        connection,
        MHD_GET_ARGUMENT_KIND,
        name
    );
}

static enum MHD_Result handleRequest(
    void* cls,
    struct MHD_Connection* connection,
    const char* url,
    const char* method,
    const char* version,
    const char* uploadData,
    size_t* uploadDataSize,
    void** conCls)
{
    (void)cls;
    (void)version;
    (void)uploadData;
    (void)uploadDataSize;
    (void)conCls;

    if (strcmp(method, "OPTIONS") == 0)
    {
        return sendJson(
            connection,
            "{\"status\":\"ok\"}",
            MHD_HTTP_OK
        );
    }

    /* HOME */
    if (strcmp(method, "GET") == 0 &&
        strcmp(url, "/") == 0)
    {
        return sendJson(
            connection,
            "{\"message\":\"ShopSmart API is running\",\"status\":\"success\"}",
            MHD_HTTP_OK
        );
    }

    /* HEALTH */
    if (strcmp(method, "GET") == 0 &&
        strcmp(url, "/api/health") == 0)
    {
        return sendJson(
            connection,
            "{\"status\":\"ok\",\"service\":\"ShopSmart API\"}",
            MHD_HTTP_OK
        );
    }

    /* SIGN UP: POST /api/auth/signup?name=...&email=...&password=... */
    if (strcmp(method, "POST") == 0 && strcmp(url, "/api/auth/signup") == 0)
    {
        const char* name = getQueryText(connection, "name");
        const char* email = getQueryText(connection, "email");
        const char* password = getQueryText(connection, "password");
        int userId = 0;
        char response[160];

        if (name == NULL || *name == '\0' || email == NULL || *email == '\0' ||
            password == NULL || *password == '\0')
            return sendJson(connection, "{\"error\":\"Name, email, and password are required\"}", MHD_HTTP_BAD_REQUEST);

        if (!databaseRegisterUser(name, email, password, &userId))
            return sendJson(connection, "{\"error\":\"Could not register user; the email may already exist\"}", MHD_HTTP_CONFLICT);

        snprintf(response, sizeof(response),
            "{\"status\":\"success\",\"message\":\"Registration successful\",\"userId\":%d,\"name\":\"%s\"}", userId, name);
        return sendJson(connection, response, MHD_HTTP_CREATED);
    }

    /* LOGIN: POST /api/auth/login?email=...&password=... */
    if (strcmp(method, "POST") == 0 && strcmp(url, "/api/auth/login") == 0)
    {
        const char* email = getQueryText(connection, "email");
        const char* password = getQueryText(connection, "password");
        int userId = 0;
        char name[128];
        char response[160];

        if (email == NULL || *email == '\0' || password == NULL || *password == '\0')
            return sendJson(connection, "{\"error\":\"Email and password are required\"}", MHD_HTTP_BAD_REQUEST);

        if (!databaseLoginUser(email, password, &userId, name, sizeof(name)))
            return sendJson(connection, "{\"error\":\"Invalid email or password\"}", MHD_HTTP_UNAUTHORIZED);

        snprintf(response, sizeof(response),
            "{\"status\":\"success\",\"message\":\"Login successful\",\"userId\":%d,\"name\":\"%s\"}", userId, name);
        return sendJson(connection, response, MHD_HTTP_OK);
    }

    /* ALL PRODUCTS */
    if (strcmp(method, "GET") == 0 &&
        strcmp(url, "/api/products") == 0)
    {
        char* output = malloc(PRODUCT_JSON_SIZE);

        if (output == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Memory allocation failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        int result = databaseGetProductsJSON(
            output,
            PRODUCT_JSON_SIZE
        );

        if (result != 0)
        {
            free(output);

            return sendJson(
                connection,
                "{\"error\":\"Could not load products\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        enum MHD_Result response =
            sendJson(
                connection,
                output,
                MHD_HTTP_OK
            );

        free(output);

        return response;
    }

    /* SEARCH */
    if (strcmp(method, "GET") == 0 &&
        strncmp(url, "/api/products/search", 21) == 0)
    {
        const char* searchTerm =
            MHD_lookup_connection_value(
                connection,
                MHD_GET_ARGUMENT_KIND,
                "q"
            );

        if (searchTerm == NULL)
        {
            return sendJson(
                connection,
                "[]",
                MHD_HTTP_OK
            );
        }

        char* output = malloc(PRODUCT_JSON_SIZE);

        if (output == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Memory allocation failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        int result =
            databaseSearchProductsJSON(
                searchTerm,
                output,
                PRODUCT_JSON_SIZE
            );

        if (result != 0)
        {
            free(output);

            return sendJson(
                connection,
                "{\"error\":\"Search failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        enum MHD_Result response =
            sendJson(
                connection,
                output,
                MHD_HTTP_OK
            );

        free(output);

        return response;
    }

    /* CART */
    if (strcmp(method, "GET") == 0 &&
        strncmp(url, "/api/cart/", 10) == 0)
    {
        const char* idText = url + 10;
        char* endPtr;

        long userId =
            strtol(idText, &endPtr, 10);

        if (endPtr == idText || *endPtr != '\0')
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid user ID\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        char* output = malloc(PRODUCT_JSON_SIZE);

        if (output == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Memory allocation failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        int result =
            databaseGetCartJSON(
                (int)userId,
                output,
                PRODUCT_JSON_SIZE
            );

        if (result == 0)
        {
            free(output);

            return sendJson(
                connection,
                "{\"error\":\"Could not load cart\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        enum MHD_Result response =
            sendJson(
                connection,
                output,
                MHD_HTTP_OK
            );

        free(output);

        return response;
    }

    /* RECOMMENDATIONS */
    if (strcmp(method, "GET") == 0 &&
        strncmp(url, "/api/recommendations/", 21) == 0)
    {
        const char* idText = url + 21;
        char* endPtr;

        long userId = strtol(idText, &endPtr, 10);

        if (endPtr == idText || *endPtr != '\0')
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid user ID\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        char* output = malloc(PRODUCT_JSON_SIZE);

        if (output == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Memory allocation failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        int result = databaseGetUserRecommendationsJSON(
            (int)userId,
            output,
            PRODUCT_JSON_SIZE
        );

        if (result != 1)
        {
            free(output);

            return sendJson(
                connection,
                "[]",
                MHD_HTTP_OK
            );
        }

        enum MHD_Result response = sendJson(
            connection,
            output,
            MHD_HTTP_OK
        );

        free(output);

        return response;
    }

    /* PRODUCT DETAILS */
    if (strcmp(method, "GET") == 0 &&
        strncmp(url, "/api/products/", 14) == 0)
    {
        const char* idText = url + 14;
        char* endPtr;

        long productId =
            strtol(idText, &endPtr, 10);

        if (endPtr == idText || *endPtr != '\0')
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid product ID\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        char* output = malloc(PRODUCT_JSON_SIZE);

        if (output == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Memory allocation failed\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        int result =
            databaseGetProductByIdJSON(
                (int)productId,
                output,
                PRODUCT_JSON_SIZE
            );

        if (result == 1)
        {
            free(output);

            return sendJson(
                connection,
                "{\"error\":\"Product not found\"}",
                MHD_HTTP_NOT_FOUND
            );
        }

        if (result != 0)
        {
            free(output);

            return sendJson(
                connection,
                "{\"error\":\"Could not load product\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        enum MHD_Result response =
            sendJson(
                connection,
                output,
                MHD_HTTP_OK
            );

        free(output);

        return response;
    }

    /* ADD TO CART */
    if (strcmp(method, "POST") == 0 &&
        strcmp(url, "/api/cart") == 0)
    {
        int userId =
            getQueryInt(connection, "userId", 0);

        int productId =
            getQueryInt(connection, "productId", 0);

        int quantity =
            getQueryInt(connection, "quantity", 1);

        if (userId <= 0 ||
            productId <= 0 ||
            quantity <= 0)
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid cart parameters\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        int result =
            databaseAddToCart(
                userId,
                productId,
                quantity
            );

        if (result == 0)
        {
            return sendJson(
                connection,
                "{\"error\":\"Could not add product to cart\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return sendJson(
            connection,
            "{\"message\":\"Product added to cart\",\"status\":\"success\"}",
            MHD_HTTP_OK
        );
    }

    /* DELETE FROM CART */
    if (strcmp(method, "DELETE") == 0 &&
        strncmp(url, "/api/cart/", 10) == 0)
    {
        const char* path = url + 10;
        const char* separator = strchr(path, '/');

        if (separator == NULL)
        {
            return sendJson(
                connection,
                "{\"error\":\"Product ID is required\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        char userText[32];
        char productText[32];

        size_t userLength =
            (size_t)(separator - path);

        if (userLength == 0 ||
            userLength >= sizeof(userText))
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid user ID\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        memcpy(
            userText,
            path,
            userLength
        );

        userText[userLength] = '\0';

        strncpy(
            productText,
            separator + 1,
            sizeof(productText) - 1
        );

        productText[
            sizeof(productText) - 1
        ] = '\0';

        int userId = atoi(userText);
        int productId = atoi(productText);

        if (userId <= 0 || productId <= 0)
        {
            return sendJson(
                connection,
                "{\"error\":\"Invalid cart IDs\"}",
                MHD_HTTP_BAD_REQUEST
            );
        }

        int result =
            databaseRemoveFromCart(
                userId,
                productId
            );

        if (result == 0)
        {
            return sendJson(
                connection,
                "{\"error\":\"Could not remove product from cart\"}",
                MHD_HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return sendJson(
            connection,
            "{\"message\":\"Product removed from cart\",\"status\":\"success\"}",
            MHD_HTTP_OK
        );
    }

    return sendJson(
        connection,
        "{\"error\":\"Endpoint not found\"}",
        MHD_HTTP_NOT_FOUND
    );
}

int startApiServer(int port)
{
    struct MHD_Daemon* daemon;

    printf("\nStarting ShopSmart API server...\n");

    daemon = MHD_start_daemon(
        MHD_USE_INTERNAL_POLLING_THREAD,
        port,
        NULL,
        NULL,
        &handleRequest,
        NULL,
        MHD_OPTION_END
    );

    if (daemon == NULL)
    {
        printf(
            "Failed to start API server on port %d.\n",
            port
        );

        return 0;
    }

    printf("\n============================\n");
    printf("SHOPSMART API SERVER RUNNING\n");
    printf("============================\n");
    printf(
        "Home:     http://localhost:%d/\n",
        port
    );
    printf(
        "Health:   http://localhost:%d/api/health\n",
        port
    );
    printf(
        "Products: http://localhost:%d/api/products\n",
        port
    );
    printf(
        "Search:   http://localhost:%d/api/products/search?q=wireless\n",
        port
    );
    printf(
        "Details:  http://localhost:%d/api/products/102\n",
        port
    );
    printf(
        "Cart:     http://localhost:%d/api/cart/1\n",
        port
    );
    printf("============================\n");
    printf("Press Ctrl+C to stop.\n");

    while (1)
    {
        getchar();
    }

    return 1;
}
