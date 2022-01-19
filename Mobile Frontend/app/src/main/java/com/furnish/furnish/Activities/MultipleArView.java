package com.furnish.furnish.activities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentOnAttachListener;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.furnish.furnish.R;
import com.furnish.furnish.adapters.MultipleArviewAdapter;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.utilities.Credentials;
import com.furnish.furnish.utilities.SourceApi;
import com.google.android.filament.ColorGrading;
import com.google.ar.core.Anchor;
import com.google.ar.core.Config;
import com.google.ar.core.HitResult;
import com.google.ar.core.Plane;
import com.google.ar.core.Session;
import com.google.ar.sceneform.AnchorNode;
import com.google.ar.sceneform.ArSceneView;
import com.google.ar.sceneform.HitTestResult;
import com.google.ar.sceneform.Node;
import com.google.ar.sceneform.SceneView;
import com.google.ar.sceneform.Sceneform;
import com.google.ar.sceneform.math.Vector3;
import com.google.ar.sceneform.rendering.EngineInstance;
import com.google.ar.sceneform.rendering.ModelRenderable;
import com.google.ar.sceneform.rendering.Renderable;
import com.google.ar.sceneform.rendering.Renderer;
import com.google.ar.sceneform.rendering.ViewRenderable;
import com.google.ar.sceneform.ux.ArFragment;
import com.google.ar.sceneform.ux.BaseArFragment;
import com.google.ar.sceneform.ux.TransformableNode;

import org.jetbrains.annotations.NotNull;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MultipleArView extends AppCompatActivity implements
        FragmentOnAttachListener,
        BaseArFragment.OnTapArPlaneListener,
        BaseArFragment.OnSessionConfigurationListener,
        ArFragment.OnViewCreatedListener
{
    private RecyclerView recyclerView;
    private MultipleArviewAdapter adapter;
    private boolean selected=false;
    private ArFragment arFragment;
    private Renderable model;
    private ProgressBar progressBar,listProgessbar;
    private ViewRenderable viewRenderable,viewRenderable1;
    private List<ProductModel> productList;
    private ProductModel product;
    private TextView selectedProductName;
    private Button closeButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.multiplearview);
        getSupportFragmentManager().addFragmentOnAttachListener(this);


        selectedProductName=findViewById(R.id.selectedProductName);
        productList=new ArrayList<>();
        progressBar=findViewById(R.id.progressBar_multiAr);
        listProgessbar=findViewById(R.id.multiArlist_progressbar);
        recyclerView=findViewById(R.id.multiar_recyclerview);
        closeButton=findViewById(R.id.multiar_closebutton);
        GetDataFromAPI();
        putDatainRecyclerView(productList);

        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


        if (savedInstanceState == null) {
            if (Sceneform.isSupported(this)) {
                 getSupportFragmentManager().beginTransaction()
                        .replace(R.id.multiArFragment, ArFragment.class, null)
                        .commit();
            }
        }

        if(!isNetworkAvailable()){
            selectedProductName.setText("No Internet Connection");
        }

    }
    private void  GetDataFromAPI() {
        listProgessbar.setVisibility(View.VISIBLE);
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<List<ProductModel>> call=sourceApi.getProducts();
        call.enqueue(new Callback<List<ProductModel>>() {
            @Override
            public void onResponse(Call<List<ProductModel>> call, Response<List<ProductModel>> response) {
                if(response.code() != 200){
                    Log.v("mutli","Not Working....");
                    listProgessbar.setVisibility(View.INVISIBLE);
                    selectedProductName.setText("Problem connecting to server..");
                    return;
                }
                Log.v("multi","Working....");
                List<ProductModel> Products=response.body();
                for (ProductModel productModel:Products){
                    productList.add(productModel);
                }
                listProgessbar.setVisibility(View.INVISIBLE);
            }
            @Override
            public void onFailure(Call<List<ProductModel>> call, Throwable t) {
                listProgessbar.setVisibility(View.INVISIBLE);

            }
        });

    }
    private void putDatainRecyclerView(List<ProductModel> productList) {
        listProgessbar.setVisibility(View.VISIBLE);
        adapter=new MultipleArviewAdapter(productList);
        recyclerView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));
        recyclerView.setAdapter(adapter);
        listProgessbar.setVisibility(View.INVISIBLE);
        adapter.setOnItemClickListener(new MultipleArviewAdapter.OnItemClickListener() {
            @Override
            public void onClick(int position) {
                product=adapter.getSelectedProduct(position);
                        loadModel(product);
            }
        });
    }
    private void loadModel(ProductModel product) {
        WeakReference<MultipleArView> weakActivity = new WeakReference<>(this);
         ModelRenderable.builder()
                .setSource(this, Uri.parse(Credentials.PRODUCTMODEL_URL+product.getProductModel()))
                .setIsFilamentGltf(true)
                .setAsyncLoadEnabled(true)
                .build()
                .thenAccept(model -> {
                    MultipleArView activity = weakActivity.get();
                    if (activity != null) {
                        activity.model = model;
                    }
                })
                .exceptionally(throwable -> {
                    Toast.makeText(
                            this, "Unable to load model", Toast.LENGTH_LONG).show();
                    return null;
                });



        ViewRenderable.builder()
                .setView(this, R.layout.view_model_title)
                .build()
                .thenAccept(viewRenderable -> {
                    MultipleArView activity = weakActivity.get();
                    if (activity != null) {
                        activity.viewRenderable = viewRenderable;
                    }
                    TextView v=viewRenderable.getView().findViewById(R.id.titlenodeid);
                    v.setText(product.getProductName());
                    v.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            OpenDialogForProductDetails(product);
                        }
                    });
                })
                .exceptionally(throwable -> {
                    Toast.makeText(this, "Unable to load model", Toast.LENGTH_LONG).show();
                    return null;
                });


        ViewRenderable.builder()
                .setView(this, R.layout.removemodel)
                .build()
                .thenAccept(viewRenderable1 -> {
                    MultipleArView activity = weakActivity.get();
                    if (activity != null) {
                        activity.viewRenderable1 = viewRenderable1;
                    }
                })
                .exceptionally(throwable -> {
                    Toast.makeText(this, "Unable to load", Toast.LENGTH_LONG).show();
                    return null;
                });
        selected=true;
        new CountDownTimer(5000, 1000) {
            public void onFinish() {
                progressBar.setVisibility(View.INVISIBLE);
                selectedProductName.setText(product.getProductName());
                getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
            }

            public void onTick(long millisUntilFinished) {
                progressBar.setVisibility(View.VISIBLE);
                getWindow().setFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE,
                        WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
            }
        }.start();
    }
    @Override
    public void onAttachFragment(@NonNull @NotNull FragmentManager fragmentManager, @NonNull @NotNull Fragment fragment) {
        if (fragment.getId() == R.id.multiArFragment) {
            arFragment = (ArFragment) fragment;
            arFragment.setOnSessionConfigurationListener(this);
            arFragment.setOnViewCreatedListener(this);
            arFragment.setOnTapArPlaneListener(this);
        }
    }
    @Override
    public void onViewCreated(ArFragment arFragment, ArSceneView arSceneView) {
        Renderer renderer = arSceneView.getRenderer();
        if (renderer != null) {
            renderer.getFilamentView().setColorGrading(
                    new ColorGrading.Builder()
                            .toneMapping(ColorGrading.ToneMapping.FILMIC)
                            .build(EngineInstance.getEngine().getFilamentEngine())
            );
        }
        // Fine adjust the maximum frame rate
        arSceneView.setFrameRateFactor(SceneView.FrameRate.FULL);
    }
    @Override
    public void onSessionConfiguration(Session session, Config config) {
        if (session.isDepthModeSupported(Config.DepthMode.AUTOMATIC)) {
            config.setDepthMode(Config.DepthMode.AUTOMATIC);
        }
    }
    @Override
    public void onTapPlane(HitResult hitResult, Plane plane, MotionEvent motionEvent) {

        if (model == null || viewRenderable == null) {
            if (!selected){
                Toast.makeText(this, "No product selected.", Toast.LENGTH_SHORT).show();
                return;
            }
            else {
                Toast.makeText(this, "Loading...", Toast.LENGTH_SHORT).show();
                return;
            }
        }

        // Create the Anchor.
        Anchor anchor = hitResult.createAnchor();
        AnchorNode anchorNode = new AnchorNode(anchor);
        anchorNode.setParent(arFragment.getArSceneView().getScene());
        // Create the transformable model and add it to the anchor.
        TransformableNode model = new TransformableNode(arFragment.getTransformationSystem());
        model.setParent(anchorNode);
        model.setRenderable(this.model)
                .animate(true).start();
        model.select();
        model.getScaleController().setMaxScale(1.0f);
        model.getScaleController().setMinScale(0.3f);
        Node titleNode = new Node();
        titleNode.setParent(model);
        titleNode.setLocalPosition(new Vector3(0.0f, 1.0f, 0.0f));
        titleNode.setRenderable(viewRenderable);
        titleNode.setEnabled(true);
        Node removeModelNode=new Node();
        removeModelNode.setParent(titleNode);
        removeModelNode.setLocalPosition(new Vector3(0.4f, 0.0f, 0.0f));
        removeModelNode.setRenderable(viewRenderable1);
        removeModelNode.setEnabled(true);
        removeModelNode.setOnTapListener(new Node.OnTapListener() {
            @Override
            public void onTap(HitTestResult hitTestResult, MotionEvent motionEvent) {
                anchorNode.setParent(null);
            }
        });
    }

    private void OpenDialogForProductDetails(ProductModel product) {
        //open dialog
        AlertDialog dialog;
        TextView productName,productDescription,productPrice;
        ImageView productThumbnail;
        AlertDialog.Builder builder=new AlertDialog.Builder(this);
        LayoutInflater inflater=this.getLayoutInflater();
        View view=inflater.inflate(R.layout.multiar_details_dialog,null);
        productName=view.findViewById(R.id.multiAr_productdetails_name);
        productPrice=view.findViewById(R.id.multiAr_productdetails_price);
        productDescription=view.findViewById(R.id.multiAr_productdetails_description);
        productThumbnail=view.findViewById(R.id.multiAr_productdetails_thumbnail);
        productName.setText(product.getProductName());
        productDescription.setText(product.getProductDescription());
        long price=(long) (product).getProductPrice();
        String price_string="PKR "+Long.toString(price);
        productPrice.setText(price_string);
        Glide.with(view.getContext())
                .load(Credentials.PRODUCTTHUMBNAIL_URL +product.getProductThumbnail())
                .into(productThumbnail);

        builder.setView(view)
                .setNeutralButton("Further Details", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Intent intent = new Intent(view.getContext(), ProductDetails.class);
                        intent.putExtra("product",product);
                        startActivity(intent);
                    }
                }).setPositiveButton("Add to Cart", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Cartstorage cartstorage=new Cartstorage();
                int isAddedtoCart= cartstorage.savetopref(view.getContext(),product);
                if(isAddedtoCart==1){
                    Toast.makeText(view.getContext(), product.getProductName() +" is added to your cart.", Toast.LENGTH_SHORT).show();
                }
                else if(isAddedtoCart==0) {
                    Toast.makeText(view.getContext(), "This Product is out of stock", Toast.LENGTH_SHORT).show();
                }
                else if(isAddedtoCart==2){
                    Toast.makeText(view.getContext(), "This item is already present in your cart", Toast.LENGTH_SHORT).show();
                }
            }
        });
        dialog=builder.create();
        dialog.show();
    }
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}