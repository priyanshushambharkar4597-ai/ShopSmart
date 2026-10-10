#include "../include/Database.h"

#include <sqlite3.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static sqlite3* db = NULL;

/* ---------------------------------------------------------
   Helper: escape JSON string characters
   --------------------------------------------------------- */
static void appendJSONEscaped(
    char* output,
    size_t outputSize,
    size_t* position,
    const char* text
)
{
    if (output == NULL || position == NULL || text == NULL)
        return;

    for (size_t i = 0; text[i] != '\0'; i++)
    {
        char c = text[i];

        if (*position + 2 >= outputSize)
            return;

        if (c == '"' || c == '\\')
        {
            output[(*position)++] = '\\';
            output[(*position)++] = c;
        }
        else if (c == '\n')
        {
            output[(*position)++] = '\\';
            output[(*position)++] = 'n';
        }
        else
        {
            output[(*position)++] = c;
        }
    }

    output[*position] = '\0';
}

/* Append one product in the response format used by the React client. */
static int appendProductJSON(char* output, size_t outputSize, size_t* position,
                             int* first, sqlite3_stmt* statement)
{
    char prefix[160];
    const char* name = (const char*)sqlite3_column_text(statement, 1);
    const char* category = (const char*)sqlite3_column_text(statement, 2);
    const char* brand = (const char*)sqlite3_column_text(statement, 3);
    const char* tags = (const char*)sqlite3_column_text(statement, 7);
    int length = snprintf(prefix, sizeof(prefix), "%s{\"id\":%d,\"name\":\"",
                          *first ? "" : ",", sqlite3_column_int(statement, 0));

    if (length < 0 || *position + (size_t)length >= outputSize) return 0;
    memcpy(output + *position, prefix, (size_t)length); *position += (size_t)length;
    appendJSONEscaped(output, outputSize, position, name ? name : "");

    length = snprintf(prefix, sizeof(prefix), "\",\"category\":\"");
    if (length < 0 || *position + (size_t)length >= outputSize) return 0;
    memcpy(output + *position, prefix, (size_t)length); *position += (size_t)length;
    appendJSONEscaped(output, outputSize, position, category ? category : "");

    length = snprintf(prefix, sizeof(prefix), "\",\"brand\":\"");
    if (length < 0 || *position + (size_t)length >= outputSize) return 0;
    memcpy(output + *position, prefix, (size_t)length); *position += (size_t)length;
    appendJSONEscaped(output, outputSize, position, brand ? brand : "");

    length = snprintf(prefix, sizeof(prefix),
        "\",\"price\":%.2f,\"rating\":%.2f,\"popularity\":%.2f,\"tags\":\"",
        sqlite3_column_double(statement, 4), sqlite3_column_double(statement, 5),
        sqlite3_column_double(statement, 6));
    if (length < 0 || *position + (size_t)length >= outputSize) return 0;
    memcpy(output + *position, prefix, (size_t)length); *position += (size_t)length;
    appendJSONEscaped(output, outputSize, position, tags ? tags : "");

    if (*position + 3 >= outputSize) return 0;
    output[(*position)++] = '\"'; output[(*position)++] = '}'; output[*position] = '\0';
    *first = 0;
    return 1;
}

/* ---------------------------------------------------------
   Open database
   Return:
   1 = success
   0 = failure
   --------------------------------------------------------- */
int databaseOpen(const char* filename)
{
    if (filename == NULL)
        return 0;

    if (sqlite3_open(filename, &db) != SQLITE_OK)
    {
        printf("Database open error: %s\n",
               sqlite3_errmsg(db));

        if (db != NULL)
        {
            sqlite3_close(db);
            db = NULL;
        }

        return 0;
    }

    sqlite3_exec(db, "PRAGMA foreign_keys = ON;", NULL, NULL, NULL);

    printf("SQLite database opened successfully.\n");

    return 1;
}

/* ---------------------------------------------------------
   Create tables
   --------------------------------------------------------- */
int databaseCreateTables(void)
{
    if (db == NULL)
        return 0;

    const char* sql =
        "CREATE TABLE IF NOT EXISTS products ("
        "id INTEGER PRIMARY KEY,"
        "name TEXT NOT NULL,"
        "category TEXT NOT NULL,"
        "brand TEXT NOT NULL,"
        "price REAL NOT NULL,"
        "rating REAL NOT NULL,"
        "popularity REAL NOT NULL,"
        "tags TEXT"
        ");"

        "CREATE TABLE IF NOT EXISTS users ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "name TEXT NOT NULL,"
        "email TEXT NOT NULL UNIQUE,"
        "password TEXT NOT NULL"
        ");"

        "CREATE TABLE IF NOT EXISTS interactions ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "user_id INTEGER NOT NULL,"
        "product_id INTEGER NOT NULL,"
        "interaction_type TEXT NOT NULL,"
        "timestamp TEXT NOT NULL,"
        "FOREIGN KEY(user_id) REFERENCES users(id),"
        "FOREIGN KEY(product_id) REFERENCES products(id)"
        ");"

        "CREATE TABLE IF NOT EXISTS cart_items ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "user_id INTEGER NOT NULL,"
        "product_id INTEGER NOT NULL,"
        "quantity INTEGER NOT NULL DEFAULT 1,"
        "UNIQUE(user_id, product_id),"
        "FOREIGN KEY(user_id) REFERENCES users(id),"
        "FOREIGN KEY(product_id) REFERENCES products(id)"
        ");"

        "CREATE TABLE IF NOT EXISTS recommendation_logs ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "user_id INTEGER NOT NULL,"
        "product_id INTEGER NOT NULL,"
        "score REAL NOT NULL,"
        "timestamp TEXT NOT NULL,"
        "FOREIGN KEY(user_id) REFERENCES users(id),"
        "FOREIGN KEY(product_id) REFERENCES products(id)"
        ");";

    char* errorMessage = NULL;

    if (sqlite3_exec(db, sql, NULL, NULL, &errorMessage) != SQLITE_OK)
    {
        printf("Table creation error: %s\n",
               errorMessage);

        sqlite3_free(errorMessage);
        return 0;
    }

    printf("Database tables created successfully.\n");

    return 1;
}

/* ---------------------------------------------------------
   Insert product
   --------------------------------------------------------- */
int databaseInsertProduct(Product* product)
{
    if (db == NULL || product == NULL)
        return 0;

    const char* sql =
        "INSERT OR REPLACE INTO products "
        "(id, name, category, brand, price, rating, popularity, tags) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    char tags[1000] = "";

    for (int i = 0; i < product->tagCount; i++)
    {
        if (i > 0)
            strcat(tags, "|");

        strcat(tags, product->tags[i]);
    }

    sqlite3_bind_int(statement, 1, product->id);
    sqlite3_bind_text(statement, 2, product->name, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 3, product->category, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 4, product->brand, -1, SQLITE_TRANSIENT);
    sqlite3_bind_double(statement, 5, product->price);
    sqlite3_bind_double(statement, 6, product->rating);
    sqlite3_bind_double(statement, 7, product->popularity);
    sqlite3_bind_text(statement, 8, tags, -1, SQLITE_TRANSIENT);

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

/* ---------------------------------------------------------
   Insert user
   --------------------------------------------------------- */
int databaseInsertUser(
    int userId,
    const char* name,
    const char* email,
    const char* password
)
{
    if (db == NULL ||
        name == NULL ||
        email == NULL ||
        password == NULL)
        return 0;

    const char* sql =
        "INSERT OR REPLACE INTO users "
        "(id, name, email, password) "
        "VALUES (?, ?, ?, ?);";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);
    sqlite3_bind_text(statement, 2, name, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 3, email, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 4, password, -1, SQLITE_TRANSIENT);

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

/* ---------------------------------------------------------
   Register new user
   --------------------------------------------------------- */
int databaseRegisterUser(
    const char* name,
    const char* email,
    const char* password,
    int* newUserId
)
{
    if (db == NULL ||
        name == NULL ||
        email == NULL ||
        password == NULL ||
        newUserId == NULL)
    {
        return 0;
    }

    const char* sql =
        "INSERT INTO users (name, email, password) "
        "VALUES (?, ?, ?);";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
    {
        return 0;
    }

    sqlite3_bind_text(
        statement,
        1,
        name,
        -1,
        SQLITE_TRANSIENT
    );

    sqlite3_bind_text(
        statement,
        2,
        email,
        -1,
        SQLITE_TRANSIENT
    );

    sqlite3_bind_text(
        statement,
        3,
        password,
        -1,
        SQLITE_TRANSIENT
    );

    int result = sqlite3_step(statement);

    if (result != SQLITE_DONE)
    {
        sqlite3_finalize(statement);
        return 0;
    }

    *newUserId = (int)sqlite3_last_insert_rowid(db);

    sqlite3_finalize(statement);

    return 1;
}

/* ---------------------------------------------------------
   Login user
   --------------------------------------------------------- */
int databaseLoginUser(
    const char* email,
    const char* password,
    int* userId,
    char* name,
    size_t nameSize
)
{
    if (db == NULL ||
        email == NULL ||
        password == NULL ||
        userId == NULL ||
        name == NULL ||
        nameSize == 0)
    {
        return 0;
    }

    const char* sql =
        "SELECT id, name "
        "FROM users "
        "WHERE email = ? AND password = ? "
        "LIMIT 1;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
    {
        return 0;
    }

    sqlite3_bind_text(
        statement,
        1,
        email,
        -1,
        SQLITE_TRANSIENT
    );

    sqlite3_bind_text(
        statement,
        2,
        password,
        -1,
        SQLITE_TRANSIENT
    );

    int result = sqlite3_step(statement);

    if (result == SQLITE_ROW)
    {
        *userId = sqlite3_column_int(statement, 0);

        const char* userName =
            (const char*)sqlite3_column_text(statement, 1);

        if (userName != NULL)
        {
            strncpy(name, userName, nameSize - 1);
            name[nameSize - 1] = '\0';
        }
        else
        {
            name[0] = '\0';
        }

        sqlite3_finalize(statement);

        return 1;
    }

    sqlite3_finalize(statement);

    return 0;
}

/* ---------------------------------------------------------
   Product JSON APIs used by ApiServer.c.
   Return 0 on success. Product-by-ID returns 1 for not found.
   --------------------------------------------------------- */
int databaseGetProductsJSON(char* output, size_t outputSize)
{
    const char* sql = "SELECT id, name, category, brand, price, rating, popularity, tags FROM products ORDER BY id;";
    sqlite3_stmt* statement = NULL;
    size_t position = 0;
    int first = 1;

    if (db == NULL || output == NULL || outputSize < 3 ||
        sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK) return 1;
    output[position++] = '['; output[position] = '\0';
    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        if (!appendProductJSON(output, outputSize, &position, &first, statement))
        { sqlite3_finalize(statement); return 1; }
    }
    sqlite3_finalize(statement);
    if (position + 2 >= outputSize) return 1;
    output[position++] = ']'; output[position] = '\0';
    return 0;
}

int databaseSearchProductsJSON(const char* query, char* output, size_t outputSize)
{
    const char* sql =
        "SELECT id, name, category, brand, price, rating, popularity, tags "
        "FROM products WHERE name LIKE ? OR category LIKE ? OR brand LIKE ? ORDER BY name;";
    sqlite3_stmt* statement = NULL;
    char pattern[512];
    size_t position = 0;
    int first = 1;

    if (db == NULL || query == NULL || output == NULL || outputSize < 3 ||
        snprintf(pattern, sizeof(pattern), "%%%s%%", query) >= (int)sizeof(pattern) ||
        sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK) return 1;
    sqlite3_bind_text(statement, 1, pattern, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 2, pattern, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(statement, 3, pattern, -1, SQLITE_TRANSIENT);
    output[position++] = '['; output[position] = '\0';
    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        if (!appendProductJSON(output, outputSize, &position, &first, statement))
        { sqlite3_finalize(statement); return 1; }
    }
    sqlite3_finalize(statement);
    if (position + 2 >= outputSize) return 1;
    output[position++] = ']'; output[position] = '\0';
    return 0;
}

int databaseGetProductByIdJSON(int productId, char* output, size_t outputSize)
{
    const char* sql = "SELECT id, name, category, brand, price, rating, popularity, tags FROM products WHERE id = ?;";
    sqlite3_stmt* statement = NULL;
    size_t position = 0;
    int first = 1;

    if (db == NULL || productId <= 0 || output == NULL || outputSize < 3 ||
        sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK) return 2;
    sqlite3_bind_int(statement, 1, productId);
    if (sqlite3_step(statement) != SQLITE_ROW)
    { sqlite3_finalize(statement); return 1; }
    if (!appendProductJSON(output, outputSize, &position, &first, statement))
    { sqlite3_finalize(statement); return 2; }
    sqlite3_finalize(statement);
    return 0;
}

/* ---------------------------------------------------------
   Insert interaction
   --------------------------------------------------------- */
int databaseInsertInteraction(
    int userId,
    int productId,
    const char* interactionType,
    const char* timestamp
)
{
    if (db == NULL ||
        interactionType == NULL ||
        timestamp == NULL)
        return 0;

    const char* sql =
        "INSERT INTO interactions "
        "(user_id, product_id, interaction_type, timestamp) "
        "VALUES (?, ?, ?, ?);";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);
    sqlite3_bind_int(statement, 2, productId);
    sqlite3_bind_text(
        statement,
        3,
        interactionType,
        -1,
        SQLITE_TRANSIENT
    );
    sqlite3_bind_text(
        statement,
        4,
        timestamp,
        -1,
        SQLITE_TRANSIENT
    );

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

int databaseHasUsers(void)
{
    const char* sql = "SELECT 1 FROM users LIMIT 1;";
    sqlite3_stmt* statement = NULL;
    int hasUsers;

    if (db == NULL || sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    hasUsers = (sqlite3_step(statement) == SQLITE_ROW);
    sqlite3_finalize(statement);
    return hasUsers;
}

/* ---------------------------------------------------------
   Add item to cart
   --------------------------------------------------------- */
int databaseAddToCart(
    int userId,
    int productId,
    int quantity
)
{
    if (db == NULL || quantity <= 0)
        return 0;

    const char* sql =
        "INSERT INTO cart_items "
        "(user_id, product_id, quantity) "
        "VALUES (?, ?, ?) "
        "ON CONFLICT(user_id, product_id) "
        "DO UPDATE SET quantity = quantity + excluded.quantity;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);
    sqlite3_bind_int(statement, 2, productId);
    sqlite3_bind_int(statement, 3, quantity);

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

/* ---------------------------------------------------------
   Print cart
   --------------------------------------------------------- */
int databasePrintCart(int userId)
{
    if (db == NULL)
        return 0;

    const char* sql =
        "SELECT p.id, p.name, p.price, "
        "c.quantity, p.price * c.quantity "
        "FROM cart_items c "
        "JOIN products p ON c.product_id = p.id "
        "WHERE c.user_id = ?;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);

    double grandTotal = 0.0;

    printf("\nCART - USER %d\n", userId);

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        int id = sqlite3_column_int(statement, 0);
        const char* name =
            (const char*)sqlite3_column_text(statement, 1);
        double price =
            sqlite3_column_double(statement, 2);
        int quantity =
            sqlite3_column_int(statement, 3);
        double total =
            sqlite3_column_double(statement, 4);

        printf(
            "ID: %d | %s | Price: %.2f | Quantity: %d | Total: %.2f\n",
            id,
            name ? name : "",
            price,
            quantity,
            total
        );

        grandTotal += total;
    }

    printf("Grand Total: %.2f\n", grandTotal);

    sqlite3_finalize(statement);

    return 1;
}

/* ---------------------------------------------------------
   Cart JSON
   --------------------------------------------------------- */
int databaseGetCartJSON(
    int userId,
    char* output,
    size_t outputSize
)
{
    if (db == NULL ||
        output == NULL ||
        outputSize == 0)
        return 0;

    output[0] = '\0';

    const char* sql =
        "SELECT p.id, p.name, p.category, p.brand, "
        "p.price, p.rating, c.quantity, "
        "p.price * c.quantity "
        "FROM cart_items c "
        "JOIN products p ON c.product_id = p.id "
        "WHERE c.user_id = ? "
        "ORDER BY c.id;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);

    size_t position = 0;

    if (outputSize < 3)
    {
        sqlite3_finalize(statement);
        return 0;
    }

    output[position++] = '[';
    output[position] = '\0';

    int first = 1;

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        int id = sqlite3_column_int(statement, 0);

        const char* name =
            (const char*)sqlite3_column_text(statement, 1);

        const char* category =
            (const char*)sqlite3_column_text(statement, 2);

        const char* brand =
            (const char*)sqlite3_column_text(statement, 3);

        double price =
            sqlite3_column_double(statement, 4);

        double rating =
            sqlite3_column_double(statement, 5);

        int quantity =
            sqlite3_column_int(statement, 6);

        double total =
            sqlite3_column_double(statement, 7);

        if (!first)
        {
            if (position + 2 >= outputSize)
                break;

            output[position++] = ',';
            output[position] = '\0';
        }

        first = 0;

        char item[2000];

        snprintf(
            item,
            sizeof(item),
            "{\"id\":%d,\"name\":\"",
            id
        );

        size_t required =
            strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            name ? name : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"category\":\""
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            category ? category : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"brand\":\""
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            brand ? brand : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"price\":%.2f,"
            "\"rating\":%.2f,"
            "\"quantity\":%d,"
            "\"total\":%.2f}",
            price,
            rating,
            quantity,
            total
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;
        output[position] = '\0';
    }

    sqlite3_finalize(statement);

    if (position + 2 >= outputSize)
        return 0;

    output[position++] = ']';
    output[position] = '\0';

    return 1;
}

/* ---------------------------------------------------------
   Remove item from cart
   --------------------------------------------------------- */
int databaseRemoveFromCart(
    int userId,
    int productId
)
{
    if (db == NULL)
        return 0;

    const char* sql =
        "DELETE FROM cart_items "
        "WHERE user_id = ? AND product_id = ?;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);
    sqlite3_bind_int(statement, 2, productId);

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

/* ---------------------------------------------------------
   Clear cart
   --------------------------------------------------------- */
int databaseClearCart(int userId)
{
    if (db == NULL)
        return 0;

    const char* sql =
        "DELETE FROM cart_items WHERE user_id = ?;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(db, sql, -1, &statement, NULL) != SQLITE_OK)
        return 0;

    sqlite3_bind_int(statement, 1, userId);

    int result =
        (sqlite3_step(statement) == SQLITE_DONE);

    sqlite3_finalize(statement);

    return result;
}

/* ---------------------------------------------------------
   Reset demo data
   --------------------------------------------------------- */
int databaseResetDemoData(void)
{
    if (db == NULL)
        return 0;

    const char* sql =
        "DELETE FROM interactions;"
        "DELETE FROM cart_items;"
        "DELETE FROM recommendation_logs;"
        "DELETE FROM users;";

    char* errorMessage = NULL;

    if (sqlite3_exec(
            db,
            sql,
            NULL,
            NULL,
            &errorMessage
        ) != SQLITE_OK)
    {
        printf(
            "Demo reset error: %s\n",
            errorMessage
        );

        sqlite3_free(errorMessage);

        return 0;
    }

    return 1;
}

/* ---------------------------------------------------------
   Recommendation JSON

   This endpoint currently provides the user's interaction
   history in JSON form. The recommendation engine remains
   responsible for calculating recommendation scores.
   --------------------------------------------------------- */
int databaseGetUserRecommendationsJSON(
    int userId,
    char* output,
    size_t outputSize
)
{
    if (db == NULL ||
        output == NULL ||
        outputSize == 0)
        return 0;

    output[0] = '\0';

    const char* sql =
        "SELECT p.id, p.name, "
        "p.category, p.brand, "
        "p.price, p.rating, "
        "p.popularity "
        "FROM interactions i "
        "JOIN products p "
        "ON i.product_id = p.id "
        "WHERE i.user_id = ? "
        "GROUP BY p.id "
        "ORDER BY p.popularity DESC "
        "LIMIT 5;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(
            db,
            sql,
            -1,
            &statement,
            NULL
        ) != SQLITE_OK)
    {
        return 0;
    }

    sqlite3_bind_int(
        statement,
        1,
        userId
    );

    size_t position = 0;

    if (outputSize < 3)
    {
        sqlite3_finalize(statement);
        return 0;
    }

    output[position++] = '[';
    output[position] = '\0';

    int first = 1;

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        int id =
            sqlite3_column_int(statement, 0);

        const char* name =
            (const char*)sqlite3_column_text(statement, 1);

        const char* category =
            (const char*)sqlite3_column_text(statement, 2);

        const char* brand =
            (const char*)sqlite3_column_text(statement, 3);

        double price =
            sqlite3_column_double(statement, 4);

        double rating =
            sqlite3_column_double(statement, 5);

        double popularity =
            sqlite3_column_double(statement, 6);

        char item[2000];

        snprintf(
            item,
            sizeof(item),
            "%s{\"id\":%d,\"name\":\"",
            first ? "" : ",",
            id
        );

        first = 0;

        size_t required =
            strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            name ? name : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"category\":\""
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            category ? category : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"brand\":\""
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;

        appendJSONEscaped(
            output,
            outputSize,
            &position,
            brand ? brand : ""
        );

        snprintf(
            item,
            sizeof(item),
            "\",\"price\":%.2f,"
            "\"rating\":%.2f,"
            "\"popularity\":%.2f}",
            price,
            rating,
            popularity
        );

        required = strlen(item);

        if (position + required >= outputSize)
            break;

        memcpy(
            output + position,
            item,
            required
        );

        position += required;
        output[position] = '\0';
    }

    sqlite3_finalize(statement);

    if (position + 2 >= outputSize)
        return 0;

    output[position++] = ']';
    output[position] = '\0';

    return 1;
}

/* ---------------------------------------------------------
   Print database contents
   --------------------------------------------------------- */
void databasePrintContents(void)
{
    if (db == NULL)
        return;

    printf("\n===== PRODUCTS IN DATABASE =====\n");

    const char* sql =
        "SELECT id, name, category, brand, price "
        "FROM products "
        "ORDER BY id;";

    sqlite3_stmt* statement = NULL;

    if (sqlite3_prepare_v2(
            db,
            sql,
            -1,
            &statement,
            NULL
        ) != SQLITE_OK)
    {
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        printf(
            "ID: %d | %s | %s | %s | %.2f\n",
            sqlite3_column_int(statement, 0),
            sqlite3_column_text(statement, 1),
            sqlite3_column_text(statement, 2),
            sqlite3_column_text(statement, 3),
            sqlite3_column_double(statement, 4)
        );
    }

    sqlite3_finalize(statement);

    printf("\n===== USERS IN DATABASE =====\n");

    const char* userSQL =
        "SELECT id, name, email FROM users ORDER BY id;";

    if (sqlite3_prepare_v2(
            db,
            userSQL,
            -1,
            &statement,
            NULL
        ) != SQLITE_OK)
    {
        return;
    }

    while (sqlite3_step(statement) == SQLITE_ROW)
    {
        printf(
            "ID: %d | Name: %s | Email: %s\n",
            sqlite3_column_int(statement, 0),
            sqlite3_column_text(statement, 1),
            sqlite3_column_text(statement, 2)
        );
    }

    sqlite3_finalize(statement);
}

/* ---------------------------------------------------------
   Close database
   --------------------------------------------------------- */
void databaseClose(void)
{
    if (db != NULL)
    {
        sqlite3_close(db);
        db = NULL;

        printf("SQLite database closed.\n");
    }
}
