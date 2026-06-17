import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../services/api_service.dart';

class DonateScreen extends StatefulWidget {
  const DonateScreen({super.key});

  @override
  State<DonateScreen> createState() => _DonateScreenState();
}

class _DonateScreenState extends State<DonateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _emailController = TextEditingController();
  final ApiService _apiService = ApiService();

  String _selectedCategory = 'General Support';
  bool _isProcessing = false;

  final List<String> _categories = [
    'General Support',
    'Equipment Fund',
    'Operational Costs',
    'Community Outreach',
    'Programming',
  ];

  // Amounts in Sierra Leone Leone (SLL)
  final List<int> _quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Support Us'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.deepNavy,
                    AppColors.deepNavy.withOpacity(0.9),
                  ],
                ),
              ),
              child: Column(
                children: [
                  Icon(Icons.volunteer_activism, size: 64, color: AppColors.gold),
                  const SizedBox(height: 16),
                  Text(
                    'Support Ecko Media',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: AppColors.white,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Your support keeps us on air 24/7',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.white.withOpacity(0.9),
                        ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Donation Form
            Form(
              key: _formKey,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Selection
                    Text('Donation Purpose', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _categories.map((category) {
                        final isSelected = category == _selectedCategory;
                        return ChoiceChip(
                          label: Text(category),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() => _selectedCategory = category);
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
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 24),

                    // Quick Amount Selection
                    Text('Quick Amount (Le)', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 3,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 2,
                      children: _quickAmounts.map((amount) => _buildQuickAmountButton(amount)).toList(),
                    ),

                    const SizedBox(height: 24),

                    // Custom Amount Input
                    Text('Or Enter Custom Amount', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _amountController,
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      decoration: InputDecoration(
                        hintText: 'Enter amount in Leones',
                        prefixIcon: Icon(Icons.money, color: AppColors.gold),
                        suffixText: 'SLL',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) return 'Please enter an amount';
                        final amount = int.tryParse(value);
                        if (amount == null || amount <= 0) return 'Please enter a valid amount';
                        return null;
                      },
                    ),

                    const SizedBox(height: 24),

                    // Email Input (Optional)
                    Text('Email for Receipt (Optional)', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        hintText: 'your@email.com',
                        prefixIcon: Icon(Icons.email_outlined, color: AppColors.gold),
                      ),
                      validator: (value) {
                        if (value != null && value.isNotEmpty && !value.contains('@')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 32),

                    // Info Box
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.info_outline, color: AppColors.deepNavy, size: 24),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Donations support our broadcast operations, equipment, and community programs.',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isProcessing ? null : _processDonation,
                        child: _isProcessing
                            ? SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.deepNavy),
                                ),
                              )
                            : const Text('Continue to Payment'),
                      ),
                    ),

                    const SizedBox(height: 16),

                    Text(
                      'By proceeding, you agree to our terms and conditions.',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                          ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAmountButton(int amount) {
    final label = amount >= 1000
        ? 'Le ${(amount / 1000).toStringAsFixed(0)}k'
        : 'Le $amount';

    return ElevatedButton(
      onPressed: () {
        setState(() => _amountController.text = amount.toString());
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.white,
        foregroundColor: AppColors.deepNavy,
        side: BorderSide(color: AppColors.gold),
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(
        label,
        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
      ),
    );
  }

  Future<void> _processDonation() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isProcessing = true);

    final amount = double.parse(_amountController.text);
    final result = await _apiService.processDonation(
      category: _selectedCategory,
      amount: amount,
      email: _emailController.text.isNotEmpty ? _emailController.text : null,
      method: 'Orange Money',
    );

    setState(() => _isProcessing = false);
    if (!mounted) return;

    if (result['success'] == true) {
      _showSuccessDialog(amount);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result['message']?.toString() ?? 'Something went wrong. Please try again.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _showSuccessDialog(double amount) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 32),
            const SizedBox(width: 12),
            const Text('Thank You!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your donation of Le ${amount.toStringAsFixed(0)} for "$_selectedCategory" has been received.',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            Text(
              'Thank you for supporting Ecko Media 104.3 FM!',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontStyle: FontStyle.italic),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _amountController.clear();
              _emailController.clear();
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _amountController.dispose();
    _emailController.dispose();
    super.dispose();
  }
}
