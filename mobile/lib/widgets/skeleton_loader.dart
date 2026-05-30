import 'package:flutter/material.dart';

class SkeletonLoader extends StatefulWidget {
  final double? width;
  final double height;
  final BorderRadius? borderRadius;

  const SkeletonLoader({
    Key? key,
    this.width,
    this.height = 20,
    this.borderRadius,
  }) : super(key: key);

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
    
    _animation = Tween<double>(begin: -2, end: 2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(4),
            gradient: LinearGradient(
              begin: Alignment(_animation.value, 0),
              end: const Alignment(1, 0),
              colors: [
                Colors.grey[300]!,
                Colors.grey[200]!,
                Colors.grey[300]!,
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        );
      },
    );
  }
}

// List Item Skeleton
class ListItemSkeleton extends StatelessWidget {
  const ListItemSkeleton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const SkeletonLoader(
            width: 60,
            height: 60,
            borderRadius: BorderRadius.all(Radius.circular(8)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SkeletonLoader(width: double.infinity, height: 16),
                const SizedBox(height: 8),
                SkeletonLoader(
                  width: MediaQuery.of(context).size.width * 0.6,
                  height: 14,
                ),
                const SizedBox(height: 4),
                const SkeletonLoader(width: 100, height: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Card Skeleton
class CardSkeleton extends StatelessWidget {
  const CardSkeleton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SkeletonLoader(
              width: double.infinity,
              height: 200,
              borderRadius: BorderRadius.all(Radius.circular(8)),
            ),
            const SizedBox(height: 12),
            const SkeletonLoader(width: double.infinity, height: 20),
            const SizedBox(height: 8),
            const SkeletonLoader(width: double.infinity, height: 16),
            const SizedBox(height: 8),
            SkeletonLoader(
              width: MediaQuery.of(context).size.width * 0.5,
              height: 16,
            ),
          ],
        ),
      ),
    );
  }
}

// Grid Item Skeleton
class GridItemSkeleton extends StatelessWidget {
  const GridItemSkeleton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SkeletonLoader(
            width: double.infinity,
            height: 120,
            borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SkeletonLoader(width: double.infinity, height: 16),
                const SizedBox(height: 8),
                const SkeletonLoader(width: 100, height: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
