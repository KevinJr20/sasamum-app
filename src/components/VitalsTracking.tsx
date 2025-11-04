import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Activity, Droplet, Heart, Baby, TrendingUp, TrendingDown, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface VitalsTrackingProps {
  onBack: () => void;
}

interface VitalReading {
  id: string;
  date: string;
  time: string;
  systolic?: number;
  diastolic?: number;
  glucose?: number;
  fetalMovements?: number;
  notes?: string;
}

export function VitalsTracking({ onBack }: VitalsTrackingProps) {
  const [selectedTab, setSelectedTab] = useState('blood-pressure');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newReading, setNewReading] = useState<Partial<VitalReading>>({});

  // Mock data for demonstration
  const [bpReadings, setBpReadings] = useState<VitalReading[]>([
    { id: '1', date: '2025-10-16', time: '08:00', systolic: 118, diastolic: 76, notes: 'Morning reading' },
    { id: '2', date: '2025-10-15', time: '14:30', systolic: 122, diastolic: 78 },
    { id: '3', date: '2025-10-14', time: '09:15', systolic: 115, diastolic: 74 },
    { id: '4', date: '2025-10-13', time: '16:00', systolic: 128, diastolic: 82, notes: 'Felt dizzy' },
    { id: '5', date: '2025-10-12', time: '08:30', systolic: 120, diastolic: 77 },
  ]);

  const [glucoseReadings, setGlucoseReadings] = useState<VitalReading[]>([
    { id: '1', date: '2025-10-16', time: '07:30', glucose: 92, notes: 'Fasting' },
    { id: '2', date: '2025-10-15', time: '07:45', glucose: 88, notes: 'Fasting' },
    { id: '3', date: '2025-10-14', time: '13:00', glucose: 105, notes: 'After lunch' },
    { id: '4', date: '2025-10-13', time: '07:30', glucose: 95, notes: 'Fasting' },
  ]);

  const [fetalMovements, setFetalMovements] = useState<VitalReading[]>([
    { id: '1', date: '2025-10-16', time: '10:00', fetalMovements: 12, notes: 'Very active' },
    { id: '2', date: '2025-10-15', time: '15:30', fetalMovements: 10 },
    { id: '3', date: '2025-10-14', time: '11:00', fetalMovements: 8 },
    { id: '4', date: '2025-10-13', time: '14:00', fetalMovements: 11 },
  ]);

  const handleAddReading = () => {
    const reading: VitalReading = {
      id: Date.now().toString(),
      date: newReading.date || new Date().toISOString().split('T')[0],
      time: newReading.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      ...newReading,
    };

    if (selectedTab === 'blood-pressure' && reading.systolic && reading.diastolic) {
      setBpReadings([reading, ...bpReadings]);
      checkBPThreshold(reading.systolic, reading.diastolic);
    } else if (selectedTab === 'glucose' && reading.glucose) {
      setGlucoseReadings([reading, ...glucoseReadings]);
      checkGlucoseThreshold(reading.glucose);
    } else if (selectedTab === 'fetal-movements' && reading.fetalMovements) {
      setFetalMovements([reading, ...fetalMovements]);
      checkFetalMovementThreshold(reading.fetalMovements);
    }

    setNewReading({});
    setIsAddDialogOpen(false);
    toast.success('Vital reading recorded successfully!');
  };

  const checkBPThreshold = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) {
      toast.error('⚠️ High blood pressure detected! Please contact your healthcare provider immediately.', {
        duration: 10000,
      });
    } else if (systolic < 90 || diastolic < 60) {
      toast.warning('⚠️ Low blood pressure detected. Rest and monitor closely.', {
        duration: 7000,
      });
    }
  };

  const checkGlucoseThreshold = (glucose: number) => {
    if (glucose >= 140) {
      toast.error('⚠️ High glucose level! Please contact your healthcare provider.', {
        duration: 10000,
      });
    } else if (glucose < 70) {
      toast.warning('⚠️ Low glucose level. Have a snack and rest.', {
        duration: 7000,
      });
    }
  };

  const checkFetalMovementThreshold = (movements: number) => {
    if (movements < 6) {
      toast.error('⚠️ Reduced fetal movement detected! Please contact your healthcare provider immediately.', {
        duration: 10000,
      });
    }
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return { status: 'High', color: 'destructive' };
    if (systolic < 90 || diastolic < 60) return { status: 'Low', color: 'warning' };
    return { status: 'Normal', color: 'success' };
  };

  const getGlucoseStatus = (glucose: number) => {
    if (glucose >= 140) return { status: 'High', color: 'destructive' };
    if (glucose < 70) return { status: 'Low', color: 'warning' };
    if (glucose >= 100 && glucose < 140) return { status: 'Elevated', color: 'warning' };
    return { status: 'Normal', color: 'success' };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-foreground">Remote Vitals Monitoring</h1>
            <p className="text-sm text-muted-foreground">Track your health indicators</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Reading
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reading</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newReading.date || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newReading.time || ''}
                      onChange={(e) => setNewReading({ ...newReading, time: e.target.value })}
                    />
                  </div>
                </div>

                {selectedTab === 'blood-pressure' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Systolic (mmHg)</Label>
                      <Input
                        type="number"
                        placeholder="120"
                        value={newReading.systolic || ''}
                        onChange={(e) => setNewReading({ ...newReading, systolic: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diastolic (mmHg)</Label>
                      <Input
                        type="number"
                        placeholder="80"
                        value={newReading.diastolic || ''}
                        onChange={(e) => setNewReading({ ...newReading, diastolic: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                {selectedTab === 'glucose' && (
                  <div className="space-y-2">
                    <Label>Glucose Level (mg/dL)</Label>
                    <Input
                      type="number"
                      placeholder="90"
                      value={newReading.glucose || ''}
                      onChange={(e) => setNewReading({ ...newReading, glucose: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                {selectedTab === 'fetal-movements' && (
                  <div className="space-y-2">
                    <Label>Number of Movements (per hour)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={newReading.fetalMovements || ''}
                      onChange={(e) => setNewReading({ ...newReading, fetalMovements: parseInt(e.target.value) })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input
                    placeholder="Any additional notes..."
                    value={newReading.notes || ''}
                    onChange={(e) => setNewReading({ ...newReading, notes: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddReading} className="w-full">
                  Save Reading
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 page-with-header">
        {/* Info Card */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-foreground mb-1">Why Track Vitals?</h3>
              <p className="text-sm text-muted-foreground">
                Regular monitoring helps detect complications early. Your healthcare provider will be alerted if any values are concerning.
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blood-pressure">
              <Heart className="w-4 h-4 mr-2" />
              Blood Pressure
            </TabsTrigger>
            <TabsTrigger value="glucose">
              <Droplet className="w-4 h-4 mr-2" />
              Glucose
            </TabsTrigger>
            <TabsTrigger value="fetal-movements">
              <Baby className="w-4 h-4 mr-2" />
              Fetal Activity
            </TabsTrigger>
          </TabsList>

          {/* Blood Pressure Tab */}
          <TabsContent value="blood-pressure" className="space-y-6">
            {/* Chart */}
            <Card className="p-4">
              <h3 className="text-foreground mb-4">Blood Pressure Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[...bpReadings].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="systolic" stroke="#e06b75" strokeWidth={2} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#f4a5b9" strokeWidth={2} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Reference Ranges */}
            <Card className="p-4">
              <h3 className="text-foreground mb-3">Reference Ranges (Pregnancy)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Normal:</span>
                  <span className="text-foreground">90-139 / 60-89 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High (Alert):</span>
                  <span className="text-destructive">≥140 / ≥90 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low (Monitor):</span>
                  <span className="text-orange-500">&lt;90 / &lt;60 mmHg</span>
                </div>
              </div>
            </Card>

            {/* Recent Readings */}
            <div className="space-y-3">
              <h3 className="text-foreground">Recent Readings</h3>
              {bpReadings.map((reading) => {
                const status = getBPStatus(reading.systolic!, reading.diastolic!);
                return (
                  <Card key={reading.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-foreground">
                            {reading.systolic}/{reading.diastolic}
                          </span>
                          <span className="text-sm text-muted-foreground">mmHg</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {reading.date} at {reading.time}
                          </span>
                        </div>
                      </div>
                      <Badge variant={status.color as any}>{status.status}</Badge>
                    </div>
                    {reading.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{reading.notes}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Glucose Tab */}
          <TabsContent value="glucose" className="space-y-6">
            {/* Chart */}
            <Card className="p-4">
              <h3 className="text-foreground mb-4">Glucose Level Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[...glucoseReadings].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="glucose" stroke="#e06b75" fill="#e06b75" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Reference Ranges */}
            <Card className="p-4">
              <h3 className="text-foreground mb-3">Reference Ranges</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fasting (Normal):</span>
                  <span className="text-foreground">70-99 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">After Meals:</span>
                  <span className="text-foreground">&lt;140 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">High (Alert):</span>
                  <span className="text-destructive">≥140 mg/dL</span>
                </div>
              </div>
            </Card>

            {/* Recent Readings */}
            <div className="space-y-3">
              <h3 className="text-foreground">Recent Readings</h3>
              {glucoseReadings.map((reading) => {
                const status = getGlucoseStatus(reading.glucose!);
                return (
                  <Card key={reading.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-foreground">{reading.glucose}</span>
                          <span className="text-sm text-muted-foreground">mg/dL</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {reading.date} at {reading.time}
                          </span>
                        </div>
                      </div>
                      <Badge variant={status.color as any}>{status.status}</Badge>
                    </div>
                    {reading.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{reading.notes}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Fetal Movements Tab */}
          <TabsContent value="fetal-movements" className="space-y-6">
            {/* Chart */}
            <Card className="p-4">
              <h3 className="text-foreground mb-4">Fetal Movement Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[...fetalMovements].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="fetalMovements" stroke="#e06b75" strokeWidth={2} name="Movements/hr" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Reference Ranges */}
            <Card className="p-4 bg-primary/10 border-primary/20">
              <h3 className="text-foreground mb-3">Kick Count Guidelines</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  • Track movements at the same time daily
                </p>
                <p className="text-muted-foreground">
                  • Normal: 6+ movements per hour
                </p>
                <p className="text-destructive">
                  • Alert: &lt;6 movements - Contact provider immediately
                </p>
              </div>
            </Card>

            {/* Recent Readings */}
            <div className="space-y-3">
              <h3 className="text-foreground">Recent Kick Counts</h3>
              {fetalMovements.map((reading) => (
                <Card key={reading.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-foreground">{reading.fetalMovements}</span>
                        <span className="text-sm text-muted-foreground">movements/hr</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {reading.date} at {reading.time}
                        </span>
                      </div>
                    </div>
                    <Badge variant={reading.fetalMovements! >= 6 ? 'success' : 'destructive'}>
                      {reading.fetalMovements! >= 6 ? 'Normal' : 'Alert'}
                    </Badge>
                  </div>
                  {reading.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{reading.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
