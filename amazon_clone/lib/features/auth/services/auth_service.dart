import 'dart:convert';

import 'package:amazon_clone/constants/error_handling.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:amazon_clone/providers/user_provider.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:amazon_clone/models/user.dart';
import 'package:amazon_clone/constants/urip.dart';
import "package:shared_preferences/shared_preferences.dart";
import "package:provider/provider.dart";
import 'package:amazon_clone/features/home/screens/home_screen.dart';

class AuthService {
  // sign up user
  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
          id: '',
          name: name,
          email: email,
          password: password,
          address: '',
          type: '',
          token: '',
          cart: []);

      http.Response response = await http.post(
          Uri.parse('$uri/8080/api/signup'),
          body: user.toJson(),
          headers: <String, String>{
            'Content-Type': 'application/json;chartset=UTF-8'
          });
      print(response.body);
      httpErrorHandler(
          response: response,
          context: context,
          onSuccess: () {
            showSnackBar(context, 'Account has been created! Please Login');
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void signInUser({
    required BuildContext context,
    required String email,
    required String password,
  }) async {
    try {
      http.Response response = await http.post(
          Uri.parse('$uri/8080/api/signin'),
          body: jsonEncode({
            'email': email,
            'password': password,
          }),
          headers: <String, String>{
            'Content-Type': 'application/json;chartset=UTF-8'
          });
      print(response.body);
      httpErrorHandler(
          response: response,
          context: context,
          onSuccess: () async {
            final prefs = await SharedPreferences.getInstance();
            Provider.of<UserProvider>(context, listen: false)
                .setUser(response.body);
            await prefs.setInt(
                'x-auth-token', jsonDecode(response.body)['token']);
            Navigator.pushNamedAndRemoveUntil(
              context,
              HomeScreen.routeName,
              (route) => false,
            );
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
