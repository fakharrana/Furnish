package com.furnish.furnish.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.furnish.furnish.R;
import com.furnish.furnish.adapters.RecievingOrdersAdapter;
import com.furnish.furnish.models.RecievingOrderlistModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.SourceApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PreviousOrders extends AppCompatActivity {

    List<RecievingOrderlistModel> previousOrders;
    private RecievingOrdersAdapter recievingOrdersAdapter;
    private RecyclerView recyclerView;
    private TextView noorderyetmessge;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_previous_orders);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);

        previousOrders=new ArrayList<>();
        recyclerView=findViewById(R.id.recyclerviewpreviousorders);
        noorderyetmessge=findViewById(R.id.norodermsg_previousorder);
        progressBar=findViewById(R.id.progressBar_previousOrders);

        getPreviousOrders();

    }

    private void getPreviousOrders() {
        progressBar.setVisibility(View.VISIBLE);
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<List<RecievingOrderlistModel>> call=sourceApi.getPreviousorders(UserStorage.getInstance(this).getUser().getEmail());
        call.enqueue(new Callback<List<RecievingOrderlistModel>>() {
            @Override
            public void onResponse(Call<List<RecievingOrderlistModel>> call, Response<List<RecievingOrderlistModel>> response) {
                if(response.code() != 200){
                    Log.v("CurrentOrders","Not Working....");
                    progressBar.setVisibility(View.INVISIBLE);
                    noorderyetmessge.setText("Problem connecting to server");
                    return;
                }

                else{
                    Log.v("CurrentOrders","Working....");
                    List<RecievingOrderlistModel> currentOrdersResponse = response.body();


                    for (RecievingOrderlistModel RecievingorderlistModel : currentOrdersResponse) {
                        previousOrders.add(RecievingorderlistModel);
                    }

                    if(previousOrders.isEmpty()){
                        progressBar.setVisibility(View.INVISIBLE);
                         noorderyetmessge.setVisibility(View.VISIBLE);
                    }
                    else {
                        progressBar.setVisibility(View.INVISIBLE);
                        putDatainRecyclerView(previousOrders);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<RecievingOrderlistModel>> call, Throwable t) {

            }
        });
    }

    private void putDatainRecyclerView(List<RecievingOrderlistModel> previousOrders) {
        recievingOrdersAdapter=new RecievingOrdersAdapter(previousOrders);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(recievingOrdersAdapter);

        recievingOrdersAdapter.setOnItemClickListener(new RecievingOrdersAdapter.OnItemClickListener() {
            @Override
            public void orderdetails(int position) {
                Intent i=new Intent(PreviousOrders.this, OrderDetails.class);
                i.putExtra("orderDetails",recievingOrdersAdapter.getSelectedProduct(position));
                i.putExtra("DeliveredOrderCheck",true);
                startActivity(i);
            }
        });
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
}