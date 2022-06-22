import 'package:amazon_clone/constants/error_handling.dart';
import 'package:amazon_clone/constants/utils.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:amazon_clone/models/user.dart';
import 'package:amazon_clone/constants/urip.dart';

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
}
