package com.furnish.furnish.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.MainActivity;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.responses.SignupResponse;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.SourceApi;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Signup#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Signup extends Fragment {
    private TextInputLayout name,email, password,confirmpassword;
    private Button signupbtn;
    ProgressBar progressBar;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Signup() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Signup.
     */
    // TODO: Rename and change types and number of parameters
    public static Signup newInstance(String param1, String param2) {
        Signup fragment = new Signup();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_signup, container, false);

        name=view.findViewById(R.id.signup_name);
        email = view.findViewById(R.id.signup_emailAddress);
        password = view.findViewById(R.id.signup_password);
        signupbtn = view.findViewById(R.id.signupbtn);
        confirmpassword=view.findViewById(R.id.signup_confirm_password);
        progressBar=view.findViewById(R.id.signup_progressbar);

        signupbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(validation(view)) {
                    //proceed to signup
                    userSignUp(view);
                }
            }
        });

        return view;
    }

    private boolean validation(View view){
        if(TextUtils.isEmpty(name.getEditText().getText())){
            Toast.makeText(view.getContext(),"Name required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(name.getEditText().length()<3){
            Toast.makeText(view.getContext(),"Name should have at least 3 letters", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(TextUtils.isEmpty(email.getEditText().getText())){
            Toast.makeText(view.getContext(),"Email required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(!Patterns.EMAIL_ADDRESS.matcher(email.getEditText().getText()).matches()){
            Toast.makeText(view.getContext(),"Enter a valid email", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(TextUtils.isEmpty(password.getEditText().getText())){
            Toast.makeText(view.getContext(),"Password required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(password.getEditText().length()<8){
            Toast.makeText(view.getContext(),"Password should be at least 8 characters long", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(!(confirmpassword.getEditText().getText().toString().equals(password.getEditText().getText().toString()))){
            Toast.makeText(view.getContext(),"Password does not match", Toast.LENGTH_LONG).show();
            return false;
        }
        else {
            return true;
        }

    }


    private void userSignUp(View view) {

        signupbtn.setEnabled(false);
        progressBar.setVisibility(View.VISIBLE);

        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<SignupResponse> call=sourceApi
                .createUser(name.getEditText().getText().toString(),email.getEditText().getText().toString(),password.getEditText().getText().toString());


        call.enqueue(new Callback<SignupResponse>() {
            @Override
            public void onResponse(Call<SignupResponse> call, Response<SignupResponse> response) {
                SignupResponse signUpResponse=response.body();
                if(response.isSuccessful()){
                    Toast.makeText(view.getContext(),signUpResponse.getStatus(), Toast.LENGTH_LONG).show();
                    UserStorage.getInstance(view.getContext())
                            .saveUser(signUpResponse.getUser());
                    UserStorage.getInstance(view.getContext())
                            .saveToken(signUpResponse.getToken());

                    progressBar.setVisibility(View.INVISIBLE);
                    Intent i = new Intent(getActivity(), MainActivity.class);
                    startActivity(i);
                }
                else{
                    progressBar.setVisibility(View.INVISIBLE);
                    signupbtn.setEnabled(true);
                    try {
                        JSONObject jsonObject=new JSONObject(response.errorBody().string()).getJSONObject("err");
                        Toast.makeText(view.getContext(),jsonObject.getString("message"), Toast.LENGTH_LONG).show();

                    } catch (IOException | JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<SignupResponse> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
                signupbtn.setEnabled(true);
                Toast.makeText(view.getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();


            }
        });
    }
}