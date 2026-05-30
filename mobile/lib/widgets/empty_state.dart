import 'package:flutter/material.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String message;
  final String? actionText;
  final VoidCallback? onAction;

  const EmptyState({
    Key? key,
    required this.icon,
    required this.title,
    required this.message,
    this.actionText,
    this.onAction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 80,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.grey[700],
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
              textAlign: TextAlign.center,
            ),
            if (actionText != null && onAction != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onAction,
                icon: const Icon(Icons.refresh),
                label: Text(actionText!),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// Predefined Empty States
class EmptySermons extends StatelessWidget {
  final VoidCallback? onRetry;

  const EmptySermons({Key? key, this.onRetry}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.mic_none,
      title: 'No Sermons Yet',
      message: 'There are no sermons available at the moment. Check back later for inspiring messages!',
      actionText: onRetry != null ? 'Retry' : null,
      onAction: onRetry,
    );
  }
}

class EmptyNews extends StatelessWidget {
  final VoidCallback? onRetry;

  const EmptyNews({Key? key, this.onRetry}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.article_outlined,
      title: 'No Articles Yet',
      message: 'Stay tuned for the latest news and updates from our ministry!',
      actionText: onRetry != null ? 'Retry' : null,
      onAction: onRetry,
    );
  }
}

class EmptySchedule extends StatelessWidget {
  final VoidCallback? onRetry;

  const EmptySchedule({Key? key, this.onRetry}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.schedule,
      title: 'No Programs Scheduled',
      message: 'Program schedule will be available soon. Keep listening!',
      actionText: onRetry != null ? 'Retry' : null,
      onAction: onRetry,
    );
  }
}

class ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorState({
    Key? key,
    this.message = 'Something went wrong. Please try again.',
    this.onRetry,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.error_outline,
      title: 'Oops!',
      message: message,
      actionText: 'Try Again',
      onAction: onRetry,
    );
  }
}

class NoConnection extends StatelessWidget {
  final VoidCallback? onRetry;

  const NoConnection({Key? key, this.onRetry}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return EmptyState(
      icon: Icons.wifi_off,
      title: 'No Internet Connection',
      message: 'Please check your internet connection and try again.',
      actionText: 'Retry',
      onAction: onRetry,
    );
  }
}
