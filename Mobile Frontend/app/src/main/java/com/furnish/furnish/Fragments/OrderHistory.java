package com.furnish.furnish.fragments;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.MainActivity;
import com.furnish.furnish.activities.OrderConfirmation;
import com.furnish.furnish.activities.OrderDetails;
import com.furnish.furnish.activities.PreviousOrders;
import com.furnish.furnish.adapters.RecievingOrdersAdapter;
import com.furnish.furnish.adapters.ReviewlistAdapter;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.models.RecievingOrderlistModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.SourceApi;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link OrderHistory#newInstance} factory method to
 * create an instance of this fragment.
 */
public class OrderHistory extends Fragment {

    List<RecievingOrderlistModel> currentOrders;
    private RecievingOrdersAdapter recievingOrdersAdapter;
    private RecyclerView recyclerView;
    private TextView noorderyetmessge;
    private ProgressBar progressBar;


    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public OrderHistory() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment OrderHistory.
     */
    // TODO: Rename and change types and number of parameters
    public static OrderHistory newInstance(String param1, String param2) {
        OrderHistory fragment = new OrderHistory();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_order_history, container, false);

        currentOrders=new ArrayList<>();
        recyclerView=view.findViewById(R.id.recyclervieworderhistory);
        noorderyetmessge=view.findViewById(R.id.norodermsg_currentorder);
        progressBar=view.findViewById(R.id.progressBar_currentOrders);

        getCurrentOrders(view);

        return view;
    }

    private void getCurrentOrders(View view) {
        progressBar.setVisibility(View.VISIBLE);
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<List<RecievingOrderlistModel>> call=sourceApi.getCurrentorders(UserStorage.getInstance(view.getContext()).getUser().getEmail());
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
                        currentOrders.add(RecievingorderlistModel);
                    }
                    if(currentOrders.isEmpty()){
                        progressBar.setVisibility(View.INVISIBLE);
                        noorderyetmessge.setVisibility(View.VISIBLE);
                    }
                    else {
                        progressBar.setVisibility(View.INVISIBLE);
                        putDatainRecyclerView(currentOrders,view);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<RecievingOrderlistModel>> call, Throwable t) {

            }
        });
    }


    private void putDatainRecyclerView(List<RecievingOrderlistModel> currentOrders, View view) {
        recievingOrdersAdapter=new RecievingOrdersAdapter(currentOrders);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(recievingOrdersAdapter);

        recievingOrdersAdapter.setOnItemClickListener(new RecievingOrdersAdapter.OnItemClickListener() {
            @Override
            public void orderdetails(int position) {
                Intent i=new Intent(view.getContext(), OrderDetails.class);
                i.putExtra("orderDetails",recievingOrdersAdapter.getSelectedProduct(position));
//                i.putExtra("DeliveredOrderCheck",false);
                startActivity(i);

            }
        });
    }

    @Override
    public void onCreateOptionsMenu(@NonNull Menu menu, @NonNull MenuInflater inflater) {
        inflater.inflate(R.menu.settingmenu, menu);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if(id == R.id.menu_previousorders){
            Intent intent = new Intent(getActivity(), PreviousOrders.class);
            startActivity(intent);
            return true;
        }


        return super.onOptionsItemSelected(item);
    }
}