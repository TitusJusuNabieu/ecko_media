import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../services/radio_service.dart';

class RadioScreen extends StatelessWidget {
  const RadioScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Radio'),
      ),
      body: Consumer<RadioService>(
        builder: (context, radioService, child) {
          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 24),
                
                // Album Art / Station Logo
                Container(
                  width: 280,
                  height: 280,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.gold.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      color: AppColors.deepNavy,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.radio,
                            size: 120,
                            color: AppColors.gold,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'RADIO NEWSONG',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  color: AppColors.white,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 2,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Current Program Info
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Text(
                        radioService.currentProgram,
                        style: Theme.of(context).textTheme.titleLarge,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'with ${radioService.currentHost}',
                        style: Theme.of(context).textTheme.bodyMedium,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Now Playing
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.gold.withOpacity(0.1),
                        AppColors.gold.withOpacity(0.05),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.music_note, color: AppColors.gold, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'NOW PLAYING',
                            style: Theme.of(context).textTheme.labelLarge,
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        radioService.currentSong,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        radioService.currentArtist,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Waveform Animation Placeholder
                Container(
                  height: 60,
                  margin: const EdgeInsets.symmetric(horizontal: 40),
                  child: radioService.isPlaying
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: List.generate(
                            20,
                            (index) => AnimatedWaveBar(index: index),
                          ),
                        )
                      : Center(
                          child: Text(
                            'Press play to start listening',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ),
                ),
                
                const SizedBox(height: 32),
                
                // Play/Pause Button
                GestureDetector(
                  onTap: () {
                    if (radioService.isPlaying) {
                      radioService.pause();
                    } else {
                      radioService.play();
                    }
                  },
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.gold, AppColors.gold.withOpacity(0.8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.gold.withOpacity(0.4),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Icon(
                      radioService.isPlaying ? Icons.pause : Icons.play_arrow,
                      size: 40,
                      color: AppColors.deepNavy,
                    ),
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Volume Control
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Row(
                    children: [
                      Icon(Icons.volume_down, color: AppColors.darkGray),
                      Expanded(
                        child: Slider(
                          value: radioService.volume,
                          onChanged: (value) {
                            radioService.setVolume(value);
                          },
                          activeColor: AppColors.gold,
                          inactiveColor: AppColors.mediumGray,
                        ),
                      ),
                      Icon(Icons.volume_up, color: AppColors.darkGray),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Stream Quality Info
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.signal_cellular_alt, size: 16, color: AppColors.deepNavy),
                      const SizedBox(width: 8),
                      Text(
                        'Streaming Quality: High (128kbps)',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }
}

class AnimatedWaveBar extends StatefulWidget {
  final int index;
  
  const AnimatedWaveBar({super.key, required this.index});

  @override
  State<AnimatedWaveBar> createState() => _AnimatedWaveBarState();
}

class _AnimatedWaveBarState extends State<AnimatedWaveBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300 + (widget.index * 50)),
      vsync: this,
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: 0.2, end: 1.0).animate(
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
          width: 3,
          height: 60 * _animation.value,
          decoration: BoxDecoration(
            color: AppColors.gold,
            borderRadius: BorderRadius.circular(2),
          ),
        );
      },
    );
  }
}
