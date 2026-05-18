import 'package:flutter/material.dart';

class PharmacyMapScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('خريطة الصيدليات')),
      body: Center(
        child: Text('هنا سيتم عرض الخريطة مع علامات الصيدليات'),
      ),
    );
  }
}
