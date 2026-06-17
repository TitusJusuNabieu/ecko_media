import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/program.dart';
import '../services/api_service.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  final ApiService _apiService = ApiService();
  List<Program> _allPrograms = [];
  bool _isLoading = true;

  static String _todayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[DateTime.now().weekday % 7];
  }

  late String _selectedDay = _todayName();

  final List<String> _days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ];

  @override
  void initState() {
    super.initState();
    _loadPrograms();
  }

  Future<void> _loadPrograms() async {
    final programs = await _apiService.fetchPrograms();
    if (mounted) {
      setState(() {
        _allPrograms = programs;
        _isLoading = false;
      });
    }
  }

  List<Program> get _currentDayPrograms {
    final dayPrograms = _allPrograms.where((p) => p.hasDay(_selectedDay)).toList();
    dayPrograms.sort((a, b) =>
        a.getStartTimeForDay(_selectedDay).compareTo(b.getStartTimeForDay(_selectedDay)));
    return dayPrograms;
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
                    label: Text(day.substring(0, 3)),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() => _selectedDay = day);
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
            child: _isLoading
                ? Center(child: CircularProgressIndicator(color: AppColors.gold))
                : _currentDayPrograms.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.schedule, size: 64, color: AppColors.mediumGray),
                            const SizedBox(height: 16),
                            Text(
                              'No programs for $_selectedDay',
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(color: AppColors.darkGray),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Check another day',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        itemCount: _currentDayPrograms.length,
                        itemBuilder: (context, index) {
                          return _buildProgramCard(_currentDayPrograms[index]);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgramCard(Program program) {
    final start = program.getStartTimeForDay(_selectedDay);
    final end = program.getEndTimeForDay(_selectedDay);

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
                width: 72,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.gold),
                ),
                child: Column(
                  children: [
                    Text(
                      start,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.deepNavy,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (end.isNotEmpty) ...[
                      Text('to', style: TextStyle(fontSize: 10, color: AppColors.darkGray)),
                      Text(
                        end,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.deepNavy,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
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
                          child: Text(program.title, style: Theme.of(context).textTheme.titleMedium),
                        ),
                        if (program.category.isNotEmpty) _buildCategoryBadge(program.category),
                      ],
                    ),
                    if (program.host.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.person_outline, size: 16, color: AppColors.gold),
                          const SizedBox(width: 4),
                          Text(
                            program.host,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.gold),
                          ),
                        ],
                      ),
                    ],
                    if (program.description.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(
                        program.description,
                        style: Theme.of(context).textTheme.bodyMedium,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
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
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.deepNavy),
      ),
    );
  }

  void _showProgramDetails(Program program) {
    final start = program.getStartTimeForDay(_selectedDay);
    final end = program.getEndTimeForDay(_selectedDay);

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
            Text(program.title, style: Theme.of(context).textTheme.headlineSmall),
            if (program.host.isNotEmpty) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.person, size: 20, color: AppColors.gold),
                  const SizedBox(width: 8),
                  Text(program.host,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppColors.gold)),
                ],
              ),
            ],
            if (start.isNotEmpty) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Icon(Icons.access_time, size: 20, color: AppColors.darkGray),
                  const SizedBox(width: 8),
                  Text(
                    end.isNotEmpty ? '$start - $end' : start,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                ],
              ),
            ],
            if (program.description.isNotEmpty) ...[
              const SizedBox(height: 16),
              Text(program.description,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.6)),
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
