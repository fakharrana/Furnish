package com.furnish.furnish.dialogs;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.furnish.furnish.R;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.SourceApi;
import com.google.android.material.textfield.TextInputLayout;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Changename  extends AppCompatDialogFragment {
    Context context;

    @NonNull
    @NotNull
    @Override
    public Dialog onCreateDialog(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
        TextInputLayout name;
        AlertDialog.Builder builder=new AlertDialog.Builder(getActivity());
        LayoutInflater inflater=getActivity().getLayoutInflater();
        View view=inflater.inflate(R.layout.change_name_dialog,null);
        name=view.findViewById(R.id.changename_edittext_dialog);
        builder.setView(view)
                .setTitle("Change name")
                .setPositiveButton("save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String changedname=name.getEditText().getText().toString();
                        changename(view,changedname);
                    }
                });
        return builder.create();
    }

    private void changename(View view,String changedname) {
        RetrofitClient retrofitClient=new RetrofitClient();
        SourceApi sourceApi=retrofitClient.getSourceApi();
        Call<ResponseBody> call=sourceApi.changeName(changedname);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                JSONObject jsonObject = null;
                try {
                    String message=response.body().string();
                    jsonObject=new JSONObject(message);
                } catch (IOException | JSONException e) {
                    e.printStackTrace();
                }
                if(response.isSuccessful()){
                    UserStorage.getInstance(view.getContext()).changename(changedname);
                    try {
                        Toast.makeText(view.getContext(), jsonObject.getString("Success"), Toast.LENGTH_SHORT).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                else {
                    try {
                        Toast.makeText(view.getContext(), response.errorBody().string(), Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {

            }
        });
    }


}
