import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/program.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  String _selectedDay = 'Monday';

  final List<String> _days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // TODO: Replace with API call
  final Map<String, List<Program>> _schedule = {
    'Monday': [
      Program(
        id: '1',
        title: 'Morning Glory',
        host: 'Pastor John',
        startTime: '06:00',
        endTime: '08:00',
        description: 'Start your day with inspiring worship and devotion',
        day: 'Monday',
        category: 'Worship',
      ),
      Program(
        id: '2',
        title: 'Midday Worship',
        host: 'Various Artists',
        startTime: '12:00',
        endTime: '14:00',
        description: 'Contemporary Christian music for your lunch break',
        day: 'Monday',
        category: 'Music',
      ),
      Program(
        id: '3',
        title: 'Evening Devotion',
        host: 'Rev. Sarah',
        startTime: '18:00',
        endTime: '20:00',
        description: 'Deep biblical teaching and prayer',
        day: 'Monday',
        category: 'Teaching',
      ),
    ],
    'Sunday': [
      Program(
        id: '4',
        title: 'Sunday Morning Service',
        host: 'Pastor John Smith',
        startTime: '10:00',
        endTime: '12:00',
        description: 'Live broadcast of our Sunday worship service',
        day: 'Sunday',
        category: 'Service',
      ),
      Program(
        id: '5',
        title: 'Gospel Hour',
        host: 'Various',
        startTime: '14:00',
        endTime: '16:00',
        description: 'Classic and contemporary gospel music',
        day: 'Sunday',
        category: 'Music',
      ),
    ],
  };

  List<Program> get _currentDayPrograms {
    return _schedule[_selectedDay] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Program Schedule'),
      ),
      body: Column(
        children: [
          // Day Selector
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _days.length,
              itemBuilder: (context, index) {
                final day = _days[index];
                final isSelected = day == _selectedDay;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(day),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        _selectedDay = day;
                      });
                    },
                    selectedColor: AppColors.gold,
                    backgroundColor: AppColors.white,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.deepNavy : AppColors.darkGray,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                    side: BorderSide(
                      color: isSelected ? AppColors.gold : AppColors.mediumGray,
                    ),
                  ),
                );
              },
            ),
          ),

          const Divider(height: 1),

          // Programs List
          Expanded(
            child: _currentDayPrograms.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.schedule,
                          size: 64,
                          color: AppColors.mediumGray,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No programs scheduled',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: AppColors.darkGray,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Check back for updates',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    itemCount: _currentDayPrograms.length,
                    itemBuilder: (context, index) {
                      final program = _currentDayPrograms[index];
                      return _buildProgramCard(program);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgramCard(Program program) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () => _showProgramDetails(program),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Time Badge
              Container(
                width: 70,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.gold),
                ),
                child: Column(
                  children: [
                    Text(
                      program.startTime,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.deepNavy,
                      ),
                    ),
                    Text(
                      'to',
                      style: TextStyle(
                        fontSize: 10,
                        color: AppColors.darkGray,
                      ),
                    ),
                    Text(
                      program.endTime,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.deepNavy,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 16),

              // Program Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            program.title,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ),
                        _buildCategoryBadge(program.category),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.person_outline,
                          size: 16,
                          color: AppColors.gold,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          program.host,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.gold,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      program.description,
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryBadge(String category) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.deepNavy.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        category,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: AppColors.deepNavy,
        ),
      ),
    );
  }

  void _showProgramDetails(Program program) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.mediumGray,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              program.title,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.person, size: 20, color: AppColors.gold),
                const SizedBox(width: 8),
                Text(
                  program.host,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppColors.gold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Icon(Icons.access_time, size: 20, color: AppColors.darkGray),
                const SizedBox(width: 8),
                Text(
                  '${program.startTime} - ${program.endTime}',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              program.description,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    height: 1.6,
                  ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  // Navigate to radio player
                },
                icon: const Icon(Icons.play_arrow),
                label: const Text('Listen Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
