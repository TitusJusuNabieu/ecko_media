import 'package:flutter/material.dart';

class AnimatedPageRoute {
  // Slide from right (default)
  static Route<T> slideFromRight<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOut;

        var tween = Tween(begin: begin, end: end).chain(
          CurveTween(curve: curve),
        );

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }

  // Slide from bottom
  static Route<T> slideFromBottom<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 1.0);
        const end = Offset.zero;
        const curve = Curves.easeInOut;

        var tween = Tween(begin: begin, end: end).chain(
          CurveTween(curve: curve),
        );

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 400),
    );
  }

  // Fade transition
  static Route<T> fade<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: animation,
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }

  // Combined fade and slide
  static Route<T> fadeSlide<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 0.05);
        const end = Offset.zero;
        const curve = Curves.easeOut;

        var slideTween = Tween(begin: begin, end: end).chain(
          CurveTween(curve: curve),
        );

        return SlideTransition(
          position: animation.drive(slideTween),
          child: FadeTransition(
            opacity: animation,
            child: child,
          ),
        );
      },
      transitionDuration: const Duration(milliseconds: 400),
    );
  }
}

// Extension method for easy navigation
extension NavigatorExtension on BuildContext {
  // Navigate with animation
  Future<T?> pushAnimated<T>(
    Widget page, {
    AnimationType type = AnimationType.slideRight,
  }) {
    Route<T?> route;
    switch (type) {
      case AnimationType.slideRight:
        route = AnimatedPageRoute.slideFromRight<T?>(page);
        break;
      case AnimationType.slideBottom:
        route = AnimatedPageRoute.slideFromBottom<T?>(page);
        break;
      case AnimationType.fade:
        route = AnimatedPageRoute.fade<T?>(page);
        break;
      case AnimationType.fadeSlide:
        route = AnimatedPageRoute.fadeSlide<T?>(page);
        break;
    }
    return Navigator.push<T?>(this, route);
  }

  // Replace with animation
  Future<T?> pushReplacementAnimated<T, TO>(
    Widget page, {
    AnimationType type = AnimationType.fadeSlide,
  }) {
    Route<T?> route;
    switch (type) {
      case AnimationType.slideRight:
        route = AnimatedPageRoute.slideFromRight<T?>(page);
        break;
      case AnimationType.slideBottom:
        route = AnimatedPageRoute.slideFromBottom<T?>(page);
        break;
      case AnimationType.fade:
        route = AnimatedPageRoute.fade<T?>(page);
        break;
      case AnimationType.fadeSlide:
        route = AnimatedPageRoute.fadeSlide<T?>(page);
        break;
    }
    return Navigator.pushReplacement<T?, TO>(this, route);
  }
}

enum AnimationType {
  slideRight,
  slideBottom,
  fade,
  fadeSlide,
}
