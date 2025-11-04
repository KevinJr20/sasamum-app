import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Watch, Heart, Activity, Moon, TrendingUp, Bluetooth, Battery, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface WearablesIntegrationProps {
  onBack: () => void;
}

export function WearablesIntegration({ onBack }: WearablesIntegrationProps) {
  const [connected, setConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [heartRate, setHeartRate] = useState(78);
  const [steps, setSteps] = useState(6432);

  const heartRateData = [
    { time: '00:00', rate: 68 },
    { time: '04:00', rate: 65 },
    { time: '08:00', rate: 75 },
    { time: '12:00', rate: 82 },
    { time: '16:00', rate: 78 },
    { time: '20:00', rate: 72 },
    { time: 'Now', rate: 78 }
  ];

  const sleepData = [
    { stage: 'Deep Sleep', hours: 2.5, percentage: 31 },
    { stage: 'Light Sleep', hours: 4.0, percentage: 50 },
    { stage: 'REM Sleep', hours: 1.2, percentage: 15 },
    { stage: 'Awake', hours: 0.3, percentage: 4 }
  ];

  const metrics = [
    {
      label: 'Heart Rate',
      value: `${heartRate} bpm`,
      status: 'Normal',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Steps Today',
      value: steps.toLocaleString(),
      status: '64% of goal',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Sleep Quality',
      value: '8.0 hours',
      status: 'Good',
      icon: Moon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: 'Stress Level',
      value: 'Low',
      status: '32/100',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setHeartRate(Math.floor(Math.random() * 10) + 75);
      setSteps(steps + Math.floor(Math.random() * 100));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky-header">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl text-foreground">Wearables</h1>
            <p className="text-sm text-muted-foreground">Device integration</p>
          </div>
          <Watch className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Device Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={connected ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10' : 'bg-muted'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'} flex items-center justify-center`}>
                    <Watch className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1">Smart Band Pro</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={connected ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 'bg-gray-100 text-gray-700'}>
                        {connected ? 'Connected' : 'Disconnected'}
                      </Badge>
                      {connected && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Battery className="w-3 h-3" />
                          85%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSync}
                  disabled={!connected || syncing}
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bluetooth className="w-4 h-4" />
                <span>Last synced: Just now</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {metrics.map((metric, index) => (
            <Card key={metric.label}>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-full ${metric.bgColor} flex items-center justify-center mb-3`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <div className="text-lg mb-1">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.status}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Heart Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sleep Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                Last Night's Sleep
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center pb-4 border-b">
                <div className="text-3xl mb-1">8.0 hours</div>
                <p className="text-sm text-muted-foreground">Total Sleep Time</p>
              </div>

              <div className="space-y-3">
                {sleepData.map((sleep, index) => (
                  <div key={sleep.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{sleep.stage}</span>
                      <span className="text-sm text-muted-foreground">{sleep.hours}h ({sleep.percentage}%)</span>
                    </div>
                    <Progress value={sleep.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fetal Movement Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle>Fetal Movement Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable movement detection</Label>
                <Switch defaultChecked />
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-center mb-3">
                  <div className="text-2xl mb-1">18</div>
                  <p className="text-sm text-muted-foreground">Movements detected today</p>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Last movement: 15 minutes ago
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>High heart rate alert</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Low movement alert</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Sleep quality reports</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Daily activity reminders</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
