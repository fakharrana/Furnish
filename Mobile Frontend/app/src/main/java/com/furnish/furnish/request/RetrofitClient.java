package com.furnish.furnish.request;

import com.furnish.furnish.utilities.Credentials;
import com.furnish.furnish.utilities.SourceApi;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
 TokenInterceptor tokenInterceptor=new TokenInterceptor();

 private OkHttpClient.Builder client = new OkHttpClient.Builder()
         .addInterceptor(tokenInterceptor);

 private  Retrofit.Builder retrofitBuilder=
         new Retrofit.Builder()
         .baseUrl(Credentials.BASE_URL)
          .client(client.build())
         .addConverterFactory(GsonConverterFactory.create());

 private  Retrofit retrofit=retrofitBuilder.build();
 private  SourceApi sourceApi=retrofit.create(SourceApi.class);

 public SourceApi getSourceApi(){
      return sourceApi;
 }
}





