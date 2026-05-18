import 'package:flutter/material.dart';
import 'search_screen.dart';
import 'pharmacy_map_screen.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('GazaPharma-Link')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: Text('ابحث عن دواء'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => SearchScreen()),
                );
              },
            ),
            ElevatedButton(
              child: Text('صيدليات قريبة'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => PharmacyMapScreen()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
