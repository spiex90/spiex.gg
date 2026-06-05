import { Card, CardHeader, CardBody } from '../../components/primitives/Card';
import { Badge } from '../../components/primitives/Badge';
import { Settings } from 'lucide-react';

export default async function SettingsPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-white/30 text-sm mt-0.5">System configuration</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-white/40" />
            <span className="text-white/70 text-sm font-medium">API Status</span>
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          {[
            { name: 'Claude AI (Anthropic)', envKey: 'ANTHROPIC_API_KEY', desc: 'Content generation + scoring' },
            { name: 'Supabase', envKey: 'SUPABASE_URL', desc: 'Database — follower snapshots, ideas, games' },
            { name: 'OS Auth', envKey: 'OS_PASSWORD', desc: 'Password-protected access' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between py-1">
              <div>
                <p className="text-white/70 text-sm">{item.name}</p>
                <p className="text-white/25 text-xs">{item.desc}</p>
              </div>
              <Badge variant="green">Connected</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="text-white/70 text-sm font-medium">Keyboard Shortcuts</span>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 text-sm">
            {[
              ['⌘K', 'Open command palette'],
              ['G T', 'Go to Command Center'],
              ['G G', 'Go to Games'],
              ['G I', 'Go to Ideas'],
              ['G F', 'Go to AI Factory'],
              ['G A', 'Go to Analytics'],
              ['G W', 'Go to Wins'],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white/40">{label}</span>
                <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/40 font-mono">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="text-white/70 text-sm font-medium">Content-Dashboard Integration</span>
        </CardHeader>
        <CardBody>
          <p className="text-white/40 text-sm leading-relaxed">
            The <code className="text-violet-300">content-dashboard</code> cron job automatically pulls
            follower snapshots from Instagram, YouTube, TikTok, and Twitch into Supabase daily.
            Analytics displayed here are live from that same database.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
