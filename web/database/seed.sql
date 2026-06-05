-- ============================================================================
-- Ecko Media - Complete Database Seed
-- ============================================================================
-- This file contains all demo data for testing and development
-- 
-- IMPORTANT: Use the Node.js seeder for users (npm run seed:users)
--            This ensures properly hashed passwords with bcrypt
--
-- Usage: mysql -u root -p ecko_media < database/seed.sql
-- ============================================================================

USE ecko_media;

-- ============================================================================
-- MINISTRY INFORMATION
-- ============================================================================

DELETE FROM ministry_info;

INSERT INTO ministry_info (
  name,
  mission,
  vision,
  about,
  address,
  phone,
  email,
  website,
  logo_url
) VALUES (
  'Ecko Media',
  'To "Reach the Unreached" with the Gospel, broadcasting messages of salvation, peace, and development to communities across Sierra Leone.',
  'To be the leading Christian radio station in Sierra Leone, transforming lives through the power of the Gospel and quality broadcasting.',
  'Ecko Media is a Christian radio station based in Bo, Sierra Leone. Since 2003, we have been broadcasting the Good News, reaching communities with messages of hope, faith, and development. We are committed to excellence in Christian broadcasting and community service.',
  'Bo, Southern Province, Sierra Leone',
  '+232 78 051 555, +232 99 051 555',
  'info@eckomedia.sl',
  'https://www.eckomedia.sl',
  '/images/logo.png'
);

-- ============================================================================
-- STATIONS
-- ============================================================================

INSERT INTO stations (name, slug, logo_url, description, tagline, stream_url, genre, sub_genres, language, country, is_featured, social_media) VALUES
('Ecko Media', 'ecko-media', '/images/station-logo.png', 
'Broadcasting the Good News from Bo, Sierra Leone. Your source for gospel music, ministry teachings, and community engagement.',
'Broadcasting the Good News', 
'http://stream.eckomedia.sl:8000/live.mp3',
'Gospel', 
'["Contemporary Gospel", "Traditional Gospel", "Worship", "Preaching"]',
'English', 'Sierra Leone', TRUE,
'{"facebook": "https://facebook.com/eckomedia", "instagram": "https://instagram.com/eckomedia", "twitter": "https://twitter.com/eckomedia", "youtube": "https://youtube.com/@eckomedia"}');

-- ============================================================================
-- PROGRAMS
-- ============================================================================

INSERT INTO programs (station_id, name, slug, description, host_name, genre, schedule, is_active) VALUES
(1, 'Morning Devotion', 'morning-devotion', 
'Start your day with prayer, worship, and inspiring messages from the Word of God.',
'Pastor John Smith', 'Devotional',
'{"Monday": {"start": "06:00", "end": "07:00"}, "Tuesday": {"start": "06:00", "end": "07:00"}, "Wednesday": {"start": "06:00", "end": "07:00"}, "Thursday": {"start": "06:00", "end": "07:00"}, "Friday": {"start": "06:00", "end": "07:00"}}',
TRUE),

(1, 'Gospel Vibes', 'gospel-vibes',
'The best contemporary and traditional gospel music to energize your morning.',
'DJ Faith Williams', 'Music',
'{"Monday": {"start": "07:00", "end": "10:00"}, "Tuesday": {"start": "07:00", "end": "10:00"}, "Wednesday": {"start": "07:00", "end": "10:00"}, "Thursday": {"start": "07:00", "end": "10:00"}, "Friday": {"start": "07:00", "end": "10:00"}}',
TRUE),

(1, 'The Word Today', 'word-today',
'Deep dive into the Scriptures with practical application for daily living.',
'Rev. Samuel Kamara', 'Teaching',
'{"Monday": {"start": "10:00", "end": "11:00"}, "Wednesday": {"start": "10:00", "end": "11:00"}, "Friday": {"start": "10:00", "end": "11:00"}}',
TRUE),

(1, 'Youth Connection', 'youth-connection',
'Engaging program addressing issues relevant to young people from a Christian perspective.',
'Emmanuel Sesay', 'Youth',
'{"Saturday": {"start": "15:00", "end": "17:00"}}',
TRUE),

(1, 'Evening Devotion', 'evening-devotion',
'End your day with worship, prayer, and reflection on God\'s goodness.',
'Pastor Johnson', 'Devotional',
'{"Sunday": {"start": "18:00", "end": "19:00"}}',
TRUE);

-- ============================================================================
-- SAMPLE ARTICLES
-- ============================================================================

INSERT INTO articles (title, slug, content, excerpt, featured_image_url, author_id, category, status, published_at) VALUES
('Welcome to Ecko Media', 'welcome-to-ecko-media',
'We are excited to welcome you to our new website! Ecko Media has been serving the communities of Bo and surrounding areas since 2003. Our mission is to reach the unreached with the Gospel through quality Christian broadcasting...',
'Discover our journey and what we offer to the community.',
'/images/articles/welcome.jpg',
1, 'News', 'published', NOW()),

('New Program Launch: Youth Connection', 'youth-connection-launch',
'We are thrilled to announce the launch of our new program "Youth Connection" every Saturday from 3 PM to 5 PM. This program is designed specifically for young people, addressing relevant issues from a Christian perspective...',
'Join us every Saturday for our exciting new youth program.',
'/images/articles/youth-program.jpg',
1, 'Announcements', 'published', NOW()),

('Easter Celebration Service', 'easter-celebration-2024',
'Join us for a special Easter celebration service. Experience the joy of the resurrection through worship, testimonies, and powerful preaching. Invite your family and friends...',
'Celebrate the resurrection with us this Easter.',
'/images/articles/easter.jpg',
1, 'Events', 'published', NOW());

-- ============================================================================
-- SAMPLE SERMONS
-- ============================================================================

INSERT INTO sermons (title, slug, description, speaker, youtube_url, category, series_name, recorded_at) VALUES
('The Power of Prayer', 'power-of-prayer',
'Discover how prayer can transform your life and bring breakthrough in every situation.',
'Rev. Samuel Kamara',
'https://youtube.com/watch?v=example1',
'Prayer', 'Foundations of Faith', '2024-01-15 10:00:00'),

('Living by Faith', 'living-by-faith',
'What does it mean to truly live by faith in today\'s world? Practical insights from Hebrews 11.',
'Pastor John Smith',
'https://youtube.com/watch?v=example2',
'Faith', 'Foundations of Faith', '2024-01-22 10:00:00'),

('God\'s Love for You', 'gods-love',
'Experience the unconditional love of God and how it changes everything.',
'Pastor Johnson',
'https://youtube.com/watch?v=example3',
'Love', NULL, '2024-01-29 18:00:00');

-- ============================================================================
-- CAREER LISTINGS
-- ============================================================================

DELETE FROM careers;

INSERT INTO careers (
  title,
  slug,
  department,
  location,
  employment_type,
  description,
  requirements,
  responsibilities,
  benefits,
  salary,
  application_email,
  deadline,
  is_active
) VALUES
(
  'Senior News Reporter',
  'senior-news-reporter',
  'Newsroom',
  'Freetown, Sierra Leone',
  'Full-time',
  'Lead field and desk reporting on governance, business, and community-impact stories for radio and digital platforms.',
  'Minimum 3 years reporting experience\nStrong writing and live reporting skills\nExcellent source development and verification habits\nAbility to work on breaking-news deadlines',
  'Pitch and produce enterprise stories weekly\nFile clean scripts for on-air bulletins\nCoordinate with editors and producers for multi-platform publishing\nMentor junior reporters in field reporting standards',
  'Health support package\nContinuous training opportunities\nData stipend for field reporting',
  'Le 9M - 13M / month',
  'careers@eckomedia.sl',
  '2026-07-31',
  TRUE
),
(
  'Radio Producer & Presenter',
  'radio-producer-presenter',
  'Broadcast',
  'Freetown, Sierra Leone',
  'Full-time',
  'Produce and host daily segments that blend current affairs, audience engagement, and community voices.',
  'On-air presentation confidence\nStrong show-planning and scripting ability\nBasic audio editing proficiency\nExcellent communication in English (Krio a plus)',
  'Plan daily rundowns and segment flow\nHost live and pre-recorded shows\nCoordinate guest bookings and call-ins\nWork with technical team to maintain broadcast quality',
  'Shift allowance\nProfessional voice coaching\nPerformance-based incentives',
  'Le 7M - 10M / month',
  'careers@eckomedia.sl',
  '2026-08-15',
  TRUE
),
(
  'Digital Video Editor',
  'digital-video-editor',
  'Production',
  'Freetown, Sierra Leone',
  'Contract',
  'Edit short-form and long-form video content for social, web, and campaign projects while maintaining Ecko brand quality.',
  'Strong editing skills in Premiere Pro or DaVinci Resolve\nExperience with motion graphics basics\nPortfolio of social-first storytelling\nAbility to deliver under tight timelines',
  'Edit daily clips for social channels\nCreate branded video templates and title packages\nCollaborate with reporters and producers on story cuts\nMaintain organized project files and archives',
  'Flexible contract schedule\nAccess to production gear\nOpportunity for contract extension',
  'Project-based (competitive)',
  'careers@eckomedia.sl',
  '2026-08-31',
  TRUE
),
(
  'Social Media & Community Manager',
  'social-media-community-manager',
  'Audience Growth',
  'Freetown, Sierra Leone',
  'Full-time',
  'Own social strategy, audience engagement, and performance tracking to grow Ecko Media reach and loyalty.',
  'Experience managing Facebook, Instagram, and TikTok pages\nStrong copywriting and visual storytelling skills\nAbility to analyze metrics and optimize campaigns\nBackground in media or journalism preferred',
  'Build weekly publishing calendars across platforms\nModerate audience comments and inboxes\nRun growth campaigns and partnership activations\nDeliver monthly reports with insights and recommendations',
  'Medical support\nTraining budget\nHybrid work flexibility',
  'Le 8M - 11M / month',
  'careers@eckomedia.sl',
  '2026-09-15',
  TRUE
);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- USER SEEDING:
-- Do NOT add users here! Use the Node.js seeder instead:
--   npm run seed:users
-- 
-- This ensures passwords are properly hashed with bcrypt for security.
--
-- DEMO CREDENTIALS (after running npm run seed:users):
--
-- Admin:     admin@eckomedia.sl / Admin123!
-- Editor:    sarah.editor@eckomedia.sl / Editor123!
-- Writer:    samuel.writer@eckomedia.sl / Writer123!
-- Moderator: james.mod@eckomedia.sl / Mod123!
--
-- See README.md for complete list of demo users
-- ============================================================================

SELECT 'Database seeded successfully!' as message;
SELECT 'Run "npm run seed:users" to create demo user accounts' as next_step;
