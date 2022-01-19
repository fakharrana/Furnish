from apyori import apriori
import pymongo
import sys

# Database Connection
Connection = pymongo.MongoClient('mongodb://localhost:27017/')
Database = Connection["Furnish"]
Collection = Database["orders"]


Transactions = []
rulesDictionary = {}


# Function to get transactions/orders
def getTransactions():
    for Document in Collection.find({}, {"_id": 0, "products": 1}):
        Transaction = []
        for index in range(len(Document["products"])):
            Transaction.append(Document["products"][index]["productName"])
        Transactions.append(Transaction)


# Function to get filtered recommendation list
def recommendations(product, productList):
    return [element for element in productList if element != product]


# Function to get rules in dictionary form
def getRulesDictionary():
    for item in associationRules:
        rule = item[0]
        if len(rule) > 1:
            products = [x for x in rule]

            for index in range(len(products)):
                rulesDictionary[str(products[index])] = recommendations(
                    products[index], products)


# Function to send response to node server
def sendResponse():
    try:
        recommendedProducts = rulesDictionary[sys.argv[1]]
        response = ""
        for product in recommendedProducts:
            response = response+product+","
        print(response)
    except KeyError:
        response = []
        print(response)


getTransactions()

# Applying Apriori Algorithm
associationRules = apriori(
    Transactions, min_support=0.02, min_confidence=0.50)

getRulesDictionary()
sendResponse()


# cd C:\Project\Furnish-Web-App\Server\python\scripts
# python productRecommendation.py
