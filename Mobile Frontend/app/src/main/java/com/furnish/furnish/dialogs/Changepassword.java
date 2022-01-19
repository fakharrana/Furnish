package com.furnish.furnish.dialogs;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.furnish.furnish.R;
import com.furnish.furnish.request.RetrofitClient;
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

public class Changepassword extends AppCompatDialogFragment {
    Context context;
    TextInputLayout oldpassword, newpassword;

    @NonNull
    @NotNull
    @Override
    public Dialog onCreateDialog(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.change_password_dialog, null);
        oldpassword = view.findViewById(R.id.oldpassword_edittext_dialog);
        newpassword = view.findViewById(R.id.newpassword_edittext_dialog);
        builder.setView(view)
                .setTitle("Change password")
                .setPositiveButton("save", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if(validation(view)){

                            changepassword(view);
                        }

                    }
                });
        return builder.create();
    }

    private void changepassword(View view) {
        RetrofitClient retrofitClient=new RetrofitClient();
        SourceApi sourceApi=retrofitClient.getSourceApi();
        Call<ResponseBody> call=sourceApi.changePassword(oldpassword.getEditText().getText().toString(),newpassword.getEditText().getText().toString());
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
                if(response.isSuccessful() ){
                    if(jsonObject.has("Success")){
                        Toast.makeText(view.getContext(), "Password Changed!", Toast.LENGTH_SHORT).show();
                    }
                    else{
                        Toast.makeText(view.getContext(), "Incorrect Old Password!", Toast.LENGTH_SHORT).show();
                    }

                }
                else {
                    Toast.makeText(view.getContext(), "Problem connecting to server!", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(view.getContext(), "Problem connecting to server!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private boolean validation(View view){

         if(TextUtils.isEmpty(oldpassword.getEditText().getText())){
            Toast.makeText(view.getContext(),"Password required", Toast.LENGTH_LONG).show();
            return false;
        }
       else if(TextUtils.isEmpty(newpassword.getEditText().getText())){
            Toast.makeText(view.getContext(),"Password required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(newpassword.getEditText().length()<8){
            Toast.makeText(view.getContext(),"Password should be at least 8 characters long", Toast.LENGTH_LONG).show();
            return false;
        }
        else {
            return true;
        }

    }
}
