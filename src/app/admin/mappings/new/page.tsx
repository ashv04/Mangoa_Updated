// src/app/admin/mappings/new/page.tsx
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewMapping() {
  const [msg, setMsg] = useState<string| null>(null);
  const [form, setForm] = useState({
    franchise_slug: 'naruto',
    adaptation_a_title: 'Naruto Manga',
    sequence_a: '1',
    adaptation_b_title: 'Naruto Anime Season 1',
    sequence_b: '1',
    relation_type: 'overlaps',
    confidence: 0.8,
    notes: 'Local test',
    status: 'approved', // keep approved while admin-only
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.rpc('upsert_mapping_by_keys', {
      _fr_slug: form.franchise_slug,
      _ad_a: form.adaptation_a_title,
      _seq_a: form.sequence_a,
      _ad_b: form.adaptation_b_title,
      _seq_b: form.sequence_b,
      _relation: form.relation_type,
      _confidence: form.confidence,
      _notes: form.notes,
      _status: form.status,
      _creator: null
    });
    setMsg(error ? `Error: ${error.message}` : 'Saved!');
  }

  const bind = (e: any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Add Mapping (local admin)</h1>
      <form onSubmit={submit} className="space-y-2">
        <input name="franchise_slug" className="border p-2 w-full" defaultValue={form.franchise_slug} onChange={bind}/>
        <input name="adaptation_a_title" className="border p-2 w-full" defaultValue={form.adaptation_a_title} onChange={bind}/>
        <input name="sequence_a" className="border p-2 w-full" defaultValue={form.sequence_a} onChange={bind}/>
        <input name="adaptation_b_title" className="border p-2 w-full" defaultValue={form.adaptation_b_title} onChange={bind}/>
        <input name="sequence_b" className="border p-2 w-full" defaultValue={form.sequence_b} onChange={bind}/>
        <select name="relation_type" className="border p-2 w-full" defaultValue={form.relation_type} onChange={bind}>
          <option>equivalent</option><option>covers</option><option>is_covered_by</option><option>overlaps</option><option>splits_into</option>
        </select>
        <input name="confidence" type="number" step="0.05" min="0" max="1" className="border p-2 w-full" defaultValue={form.confidence} onChange={bind}/>
        <textarea name="notes" className="border p-2 w-full" defaultValue={form.notes} onChange={bind}/>
        <select name="status" className="border p-2 w-full" defaultValue={form.status} onChange={bind}>
          <option value="approved">approved</option>
          <option value="submitted">submitted</option>
        </select>
        <button className="bg-indigo-600 text-white rounded px-4 py-2">Save</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
