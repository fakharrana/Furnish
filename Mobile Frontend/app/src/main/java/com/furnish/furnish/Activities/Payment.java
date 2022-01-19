package com.furnish.furnish.activities;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import com.furnish.furnish.R;
import com.furnish.furnish.dialogs.Orderplaced;
import com.furnish.furnish.models.OrderlistModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.request.TokenInterceptor;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.storage.Orderstorage;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.Credentials;
import com.furnish.furnish.utilities.SourceApi;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.PaymentConfiguration;
import com.stripe.android.PaymentIntentResult;
import com.stripe.android.Stripe;
import com.stripe.android.model.ConfirmPaymentIntentParams;
import com.stripe.android.model.PaymentIntent;
import com.stripe.android.model.PaymentMethodCreateParams;
import com.stripe.android.paymentsheet.PaymentSheet;
import com.stripe.android.paymentsheet.PaymentSheetResult;
import com.stripe.android.view.CardInputWidget;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Payment extends AppCompatActivity {
    RadioGroup radioGroup;
    RadioButton radioButton;
    Button placeOrderButton;
    ProgressBar progressBar;
    ConstraintLayout paymentByCardLayout,paymentByCashLayout;
    Orderstorage orderstorage;

    private static final String BACKEND_URL = Credentials.BASE_URL+"/orders";
    CardInputWidget cardInputWidget;
    Button payButton;
    private String paymentIntentClientSecret;
    //declare stripe
    private static final String TAG = "CheckoutActivity";
    private PaymentSheet paymentSheet;
    OrderlistModel orderlistModel;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        progressBar=findViewById(R.id.progressBar);
        radioGroup=findViewById(R.id.radioGroup);
        placeOrderButton=findViewById(R.id.placeorderbtn);
        paymentByCardLayout=findViewById(R.id.paywithcardLayout);
        paymentByCashLayout=findViewById(R.id.paywithcashLayout);
        orderstorage=new Orderstorage();
        orderlistModel=orderstorage.getOrder(this);
        placeOrderButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                orderlistModel.setPaymentMethod("Cash on Delivery");
                placeOrder();
            }
        });
        //cardInputWidget = findViewById(R.id.cardInputWidget);
        payButton = findViewById(R.id.pay_button);
        PaymentConfiguration.init(
                getApplicationContext(),
                "pk_test_51JqiF6LOCDkRRMGgzcnREkh7ORv4npbuuEtZMr6m1K4FlGdv6jIarUB6rFMDJkeA7cF5G8uGWkj9GkBLTLX108lE00W5HtzrBj"
        );
        // Hook up the pay button
        payButton = findViewById(R.id.pay_button);
        payButton.setOnClickListener(this::onPayClicked);
        payButton.setEnabled(false);
        paymentSheet = new PaymentSheet(this, this::onPaymentSheetResult);
        try {
            fetchPaymentIntent();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    private void showAlert(String title, @Nullable String message) {
        runOnUiThread(() -> {
            AlertDialog dialog = new AlertDialog.Builder(this)
                    .setTitle(title)
                    .setMessage(message)
                    .setPositiveButton("Ok", null)
                    .create();
            dialog.show();
        });
    }

    private void showToast(String message) {
        runOnUiThread(() -> Toast.makeText(this, message, Toast.LENGTH_LONG).show());
    }


    private void fetchPaymentIntent() throws JSONException {
        JSONObject shoppingCartContent = new JSONObject();
        shoppingCartContent.put("items", orderlistModel.getOrderTotal());



        final RequestBody requestBody = RequestBody.create(
                String.valueOf(shoppingCartContent),
                MediaType.get("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .url(BACKEND_URL + "/payment")
                .post(requestBody)
                .addHeader("Authorization", "Bearer " + UserStorage.getInstance(Payment.this).getToken())
                .build();

        new OkHttpClient()
                .newCall(request)
                .enqueue(new okhttp3.Callback() {

                    @Override
                    public void onResponse(@NonNull okhttp3.Call call, @NonNull okhttp3.Response response) throws IOException {
                        if (!response.isSuccessful()) {
                            showAlert(
                                    "Failed to load page",
                                    "Error: " + response.toString()
                            );
                        } else {
                            final JSONObject responseJson = parseResponse(response.body());
                            paymentIntentClientSecret = responseJson.optString("clientSecret");
                            runOnUiThread(() -> payButton.setEnabled(true));
                            Log.i(TAG, "Retrieved PaymentIntent");
                        }
                    }
                    @Override
                    public void onFailure(@NonNull okhttp3.Call call, @NonNull IOException e) {
                        showAlert("Failed to load data", "Error: " + e.toString());
                    }
                });
    }
    private JSONObject parseResponse(ResponseBody responseBody) {
        if (responseBody != null) {
            try {
                return new JSONObject(responseBody.string());
            } catch (IOException | JSONException e) {
                Log.e(TAG, "Error parsing response", e);
            }
        }
        return new JSONObject();
    }
    private void onPayClicked(View view) {
        PaymentSheet.Configuration configuration = new PaymentSheet.Configuration("Example, Inc.");
        // Present Payment Sheet
        paymentSheet.presentWithPaymentIntent(paymentIntentClientSecret, configuration);
    }

    private void onPaymentSheetResult(
            final PaymentSheetResult paymentSheetResult
    ) {
        if (paymentSheetResult instanceof PaymentSheetResult.Completed) {
            orderlistModel.setPaymentMethod("Visa Card");
            placeOrder();
            showToast("Payment complete!");
        } else if (paymentSheetResult instanceof PaymentSheetResult.Canceled) {
            Log.i(TAG, "Payment canceled!");
        }  else if (paymentSheetResult instanceof PaymentSheetResult.Failed) {
            Throwable error = ((PaymentSheetResult.Failed) paymentSheetResult).getError();
            showAlert("Payment failed", error.getLocalizedMessage());
        }
    }

    private void placeOrder() {
        progressBar.setVisibility(View.VISIBLE);
        placeOrderButton.setEnabled(false);
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<ResponseBody> call=sourceApi
                .addOrder(orderlistModel);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()){
                    progressBar.setVisibility(View.INVISIBLE);
                    orderstorage.clearOrderStorage(Payment.this);
                    Cartstorage cartstorage=new Cartstorage();
                    cartstorage.clearCart(Payment.this);
                    openOrderplaceddialog();
                }
                else {
                    progressBar.setVisibility(View.INVISIBLE);
                    placeOrderButton.setEnabled(true);
                    Toast.makeText(Payment.this, response.message(), Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
                placeOrderButton.setEnabled(true);
                Toast.makeText(Payment.this, t.getMessage(), Toast.LENGTH_SHORT).show();

            }
        });
    }
    private void openOrderplaceddialog() {
        //open dialog
        Orderplaced orderplaced=new Orderplaced();
        orderplaced.show(this.getSupportFragmentManager(),"order placed dialog");
        orderplaced.setCancelable(false);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void checkButton(View v){
        int radioId=radioGroup.getCheckedRadioButtonId();
        radioButton=findViewById(radioId);
    if(radioButton.getText().equals("Cash on Delivery")){
        paymentByCardLayout.setVisibility(View.INVISIBLE);
        paymentByCashLayout.setVisibility(View.VISIBLE);
    }
    else{
        paymentByCashLayout.setVisibility(View.INVISIBLE);
        paymentByCardLayout.setVisibility(View.VISIBLE);

    }

    }



}