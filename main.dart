import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(GazaPharmaApp());
}

class GazaPharmaApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GazaPharma-Link',
      theme: ThemeData(primarySwatch: Colors.green),
      home: HomeScreen(),
    );
  }
}
