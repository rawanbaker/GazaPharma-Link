import 'package:flutter/material.dart';

class SearchScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('بحث عن دواء')),
      body: Center(
        child: Text('هنا سيتم البحث عن الأدوية وربطها بالقاعدة لاحقًا'),
      ),
    );
  }
}
