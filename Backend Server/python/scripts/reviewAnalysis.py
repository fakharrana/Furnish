import pymongo
import pickle
from bson.objectid import ObjectId
from datetime import datetime
from keras.models import load_model
from keras.preprocessing import sequence


# Database Connection
Connection = pymongo.MongoClient('mongodb://localhost:27017/')
Database = Connection["Furnish"]
productsCollection = Database["products"]
positiveReviewsCollection = Database["positivereviews"]
negativeReviewsCollection = Database["negativereviews"]
reviews = []

# Loading Review Analysis Model
review_analysis_model = load_model("./python/models/review_analysis_model.h5")

# Loading Tokenizer
with open('./python/models/tokenizer.pickle', 'rb') as fileObject:
    tokenizer = pickle.load(fileObject)


# To get reviews from database
def getReviews():
    for Document in productsCollection.find({}, {"_id": 0, "productName": 1, "reviews": 1}):
        if Document["reviews"] != []:
            productReviews = []
            productReviewsDictionary = {}
            for review in Document["reviews"]:
                reviewdetails = {}
                if review["analyzed"] == 0:
                    reviewdetails["id"] = review["_id"]
                    reviewdetails["review"] = review["review"]
                    productReviews.append(reviewdetails)
            productReviewsDictionary["productName"] = Document["productName"]
            productReviewsDictionary["reviews"] = productReviews
            if productReviewsDictionary["reviews"] != []:
                reviews.append(productReviewsDictionary)


# Method for cleaning data
def cleanText(raw_text):
    letters_only = " "
    for char in str(raw_text):
        if char.isalpha() or char == " ":  # Only letters
            letters_only += char
    words = letters_only.lower().split()  # convert to lower case
    return(" ".join(words))


# To Analyze Reviews
def analyzeReviews():
    for reviewsDictionary in reviews:
        for review in reviewsDictionary["reviews"]:
            analyzedReview = {"productName": reviewsDictionary["productName"],
                              "review": review["review"], "dateAnalyzed": datetime.now()}

            productReview = [review["review"]]
            cleaned_review = [cleanText(productReview)]
            sequence_cleaned_review = tokenizer.texts_to_sequences(
                cleaned_review)  # Creating Sequences
            padded_cleaned_review = sequence.pad_sequences(
                sequence_cleaned_review, maxlen=200)  # Padding Sequences
            prediction = review_analysis_model.predict(padded_cleaned_review)
            if prediction[0][0] > prediction[0][1]:
                negativeReviewsCollection.insert_one(analyzedReview)
                productsCollection.update_one({"productName": reviewsDictionary["productName"], "reviews._id": ObjectId(review["id"])}, {
                    "$set": {"reviews.$.analyzed": 1}})
            else:
                positiveReviewsCollection.insert_one(analyzedReview)
                productsCollection.update_one({"productName": reviewsDictionary["productName"], "reviews._id": ObjectId(review["id"])}, {
                    "$set": {"reviews.$.analyzed": 1}})


# Method for sending response
def sendResponse():
    getReviews()
    if reviews == []:
        print("No Reviews Left to be Analyzed")
    else:
        analyzeReviews()
        print("Successfully Analyzed")


sendResponse()
