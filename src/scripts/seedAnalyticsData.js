/**
 * Seed realistic violation data with dates and site names.
 * Usage: node src/scripts/seedAnalyticsData.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hbnezfmcfmrzjpolssre.supabase.co';
const supabaseAnonKey = 'sb_publishable_UQ529JO2fK242Ie-JOUNpg_fL425ra2';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));
  return d.toISOString();
}

const sites = ['DHA Phase 6 Site', 'Bahria Town Block C', 'Gulberg III Plaza'];

const sampleViolations = [
  // Today
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[0], detected_at: daysAgo(0) },
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[0], detected_at: daysAgo(0) },
  { violation_type: 'Mobile Phone Usage', fine_amount: 700, site_name: sites[1], detected_at: daysAgo(0) },
  // Yesterday
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[1], detected_at: daysAgo(1) },
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[2], detected_at: daysAgo(1) },
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[0], detected_at: daysAgo(1) },
  // 3 days ago
  { violation_type: 'Mobile Phone Usage', fine_amount: 700, site_name: sites[2], detected_at: daysAgo(3) },
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[0], detected_at: daysAgo(3) },
  // 5 days ago
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[1], detected_at: daysAgo(5) },
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[2], detected_at: daysAgo(5) },
  { violation_type: 'Mobile Phone Usage', fine_amount: 700, site_name: sites[0], detected_at: daysAgo(5) },
  // 10 days ago
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[1], detected_at: daysAgo(10) },
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[2], detected_at: daysAgo(10) },
  // 20 days ago
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[0], detected_at: daysAgo(20) },
  { violation_type: 'Mobile Phone Usage', fine_amount: 700, site_name: sites[1], detected_at: daysAgo(20) },
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[2], detected_at: daysAgo(20) },
  // 40 days ago (older than a month)
  { violation_type: 'No Hard Hat', fine_amount: 500, site_name: sites[0], detected_at: daysAgo(40) },
  { violation_type: 'No Safety Vest', fine_amount: 300, site_name: sites[1], detected_at: daysAgo(40) },
];

async function seed() {
  // Delete all old test data first
  console.log('Cleaning up old data...');
  const { error: delError } = await supabase
    .from('violation_logs')
    .delete()
    .in('violation_type', ['No Helmet', 'Unauthorized Area', 'No Gloves', 'Smoking on Site', 'No Safety Boots', 'No Hard Hat', 'No Safety Vest', 'Mobile Phone Usage']);

  if (delError) {
    console.error('Error cleaning:', delError.message);
  } else {
    console.log('Old data removed.');
  }

  console.log('Inserting fresh violation data...');
  const { data, error } = await supabase
    .from('violation_logs')
    .insert(sampleViolations)
    .select();

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log(`Inserted ${data.length} records with dates and site names.`);
  console.log('\nBreakdown:');
  console.log('  - No Hard Hat:        7x across multiple days');
  console.log('  - No Safety Vest:     5x across multiple days');
  console.log('  - Mobile Phone Usage: 4x across multiple days');
  console.log('  - Today: 3 | This Week: ~8 | This Month: ~16 | All: 18');
}

seed();
