package com.furnish.furnish.utilities;

import com.furnish.furnish.models.OrderlistModel;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.models.RecievingOrderlistModel;
import com.furnish.furnish.models.ReviewModel;
import com.furnish.furnish.responses.SigninResponse;
import com.furnish.furnish.responses.SignupResponse;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface SourceApi {

    //SignUp
    @FormUrlEncoded
    @POST("users/signup")
    Call<SignupResponse> createUser(
            @Field("name") String name,
            @Field("email") String email,
            @Field("password") String password
    );

    //Login
    @FormUrlEncoded
    @POST("users/login")
    Call<SigninResponse> userLogin(
            @Field("email") String email,
            @Field("password") String password
    );

    //Get Products
    @GET("/products")
    Call<List<ProductModel>> getProducts();

    //Add Order
    @POST("orders/addorder")
    Call<ResponseBody> addOrder(@Body OrderlistModel orderlistModel);

    //Get Reviews of  specific products
    @GET("products/getreviews/{id}")
    Call<List<ReviewModel>> getReviews(@Path("id") String id);

    //Delete Reviews
    @DELETE("products/deletereview/{reviewdetails}")
    Call<ResponseBody> deleteReview(@Path("reviewdetails") String reviewdetails);

    //Add a review
    @FormUrlEncoded
    @PUT("products/addreview")
    Call<ResponseBody> addReview(
            @Field("productid") String productid,
            @Field("userEmail") String userEmail,
            @Field("review") String review
    );

    //Forget Password
    @FormUrlEncoded
    @PUT("users/forgotpassword")
    Call<ResponseBody> sendEmail(
            @Field("email") String email
            );

    //Recommend products
    @GET("products/recommendproducts/{productdetails}")
    Call<List<ProductModel>> getRecommendedProducts(@Path("productdetails") String productdetails);

    //Change name
    @FormUrlEncoded
    @PUT("users/changename")
    Call<ResponseBody> changeName(
            @Field("name") String name
    );

    //Change Password
    @FormUrlEncoded
    @PUT("users/changepassword")
    Call<ResponseBody> changePassword(
            @Field("oldPassword") String oldPassword,
            @Field("newPassword") String newPassword
    );

    //Get current orders of a specific customer
    @GET("orders/currentorders/{email}")
    Call<List<RecievingOrderlistModel>> getCurrentorders(@Path("email") String email);

    //Get previous orders of a specific customer
    @GET("orders/deliveredorders/{email}")
    Call<List<RecievingOrderlistModel>> getPreviousorders(@Path("email") String email);



}
