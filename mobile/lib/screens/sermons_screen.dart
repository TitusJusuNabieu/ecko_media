import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/sermon.dart';
import '../services/api_service.dart';
import '../widgets/skeleton_loader.dart';
import '../widgets/empty_state.dart';

class SermonsScreen extends StatefulWidget {
  const SermonsScreen({super.key});

  @override
  State<SermonsScreen> createState() => _SermonsScreenState();
}

class _SermonsScreenState extends State<SermonsScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ApiService _apiService = ApiService();
  
  List<Sermon> _sermons = [];
  List<Sermon> _filteredSermons = [];
  bool _isLoading = true;
  String? _error;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadSermons();
  }

  Future<void> _loadSermons() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final sermons = await _apiService.fetchSermons();
      setState(() {
        _sermons = sermons;
        _filteredSermons = sermons;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  void _filterSermons(String query) {
    setState(() {
      _searchQuery = query;
      if (query.isEmpty) {
        _filteredSermons = _sermons;
      } else {
        _filteredSermons = _sermons.where((sermon) {
          return sermon.title.toLowerCase().contains(query.toLowerCase()) ||
              sermon.preacher.toLowerCase().contains(query.toLowerCase());
        }).toList();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sermons'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: SermonSearchDelegate(_sermons),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search sermons...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _filterSermons('');
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: _filterSermons,
            ),
          ),
          
          // Content
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    if (_isLoading) {
      return _buildLoadingSkeleton();
    }

    if (_error != null) {
      return ErrorState(
        message: 'Failed to load sermons. Please try again.',
        onRetry: _loadSermons,
      );
    }

    if (_filteredSermons.isEmpty && _searchQuery.isEmpty) {
      return EmptySermons(onRetry: _loadSermons);
    }

    if (_filteredSermons.isEmpty && _searchQuery.isNotEmpty) {
      return EmptyState(
        icon: Icons.search_off,
        title: 'No Results Found',
        message: 'No sermons match your search "$_searchQuery"',
      );
    }

    return RefreshIndicator(
      onRefresh: _loadSermons,
      child: ListView.builder(
        padding: const EdgeInsets.only(bottom: 16),
        itemCount: _filteredSermons.length,
        itemBuilder: (context, index) {
          return _buildSermonCard(_filteredSermons[index]);
        },
      ),
    );
  }

  Widget _buildLoadingSkeleton() {
    return ListView.builder(
      itemCount: 5,
      itemBuilder: (context, index) => const ListItemSkeleton(),
    );
  }

  Widget _buildSermonCard(Sermon sermon) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () => _showSermonDetails(sermon),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Thumbnail
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.play_circle_outline,
                  size: 40,
                  color: AppTheme.primaryColor,
                ),
              ),
              const SizedBox(width: 16),
              
              // Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      sermon.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      sermon.preacher,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.calendar_today,
                          size: 14,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          sermon.date,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Icon(
                          Icons.access_time,
                          size: 14,
                          color: Colors.grey[500],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          sermon.duration,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Download icon
              IconButton(
                icon: const Icon(Icons.download),
                onPressed: () {
                  // TODO: Implement download
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Download feature coming soon')),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showSermonDetails(Sermon sermon) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  sermon.title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'By ${sermon.preacher}',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 8),
                    Text(sermon.date),
                    const SizedBox(width: 24),
                    Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 8),
                    Text(sermon.duration),
                  ],
                ),
                const SizedBox(height: 24),
                const Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  sermon.description,
                  style: const TextStyle(fontSize: 16, height: 1.5),
                ),
                const SizedBox(height: 32),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // TODO: Implement play
                        },
                        icon: const Icon(Icons.play_arrow),
                        label: const Text('Play'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          // TODO: Implement download
                        },
                        icon: const Icon(Icons.download),
                        label: const Text('Download'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Search delegate
class SermonSearchDelegate extends SearchDelegate<Sermon?> {
  final List<Sermon> sermons;

  SermonSearchDelegate(this.sermons);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () => query = '',
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () => close(context, null),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return buildSuggestions(context);
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final results = sermons.where((sermon) {
      return sermon.title.toLowerCase().contains(query.toLowerCase()) ||
          sermon.preacher.toLowerCase().contains(query.toLowerCase());
    }).toList();

    if (results.isEmpty) {
      return const Center(
        child: Text('No sermons found'),
      );
    }

    return ListView.builder(
      itemCount: results.length,
      itemBuilder: (context, index) {
        final sermon = results[index];
        return ListTile(
          leading: const Icon(Icons.mic),
          title: Text(sermon.title),
          subtitle: Text(sermon.preacher),
          onTap: () => close(context, sermon),
        );
      },
    );
  }
}
