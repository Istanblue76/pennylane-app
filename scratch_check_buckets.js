import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envStr = fs.readFileSync('.env.production', 'utf8');

const urlMatch = envStr.match(/SUPABASE_URL="([^"]+)"/);
const keyMatch = envStr.match(/SUPABASE_ANON_KEY="([^"]+)"/);

if (!urlMatch || !keyMatch) {
  console.error("Missing keys");
  process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function test() {
  console.log('Testing create bucket...');
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('pennylane', { public: true });
  console.log('Bucket Creation:', bucketData, bucketError);

  console.log('Testing list buckets...');
  const { data: listData, error: listError } = await supabase.storage.listBuckets();
  console.log('Buckets:', listData?.map(b => b.name), listError);

  console.log('Testing upload...');
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pennylane')
    .upload('test.txt', 'hello world', { contentType: 'text/plain', upsert: true });
  console.log('Upload:', uploadData, uploadError);
}

test();
