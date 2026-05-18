import 'package:flutter/material.dart';

class MedicineCard extends StatelessWidget {
  final String medicineName;
  MedicineCard({required this.medicineName});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(medicineName),
      ),
    );
  }
}
