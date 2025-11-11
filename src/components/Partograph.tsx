import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Activity,
  Heart,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  Droplet,
  Baby,
  Clock,
  Plus,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

interface PartographEntry {
  time: Date;
  hoursInLabor: number;
  cervicalDilation: number; // 0-10 cm
  fetalHeartRate: number; // bpm
  contractions: number; // per 10 minutes
  contractionDuration: number; // seconds
  fetalHeadDescent: number; // 0-5 (fifths above pelvic brim)
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  temperature: number;
  urine: {
    volume: string;
    protein: string;
    ketones: string;
  };
  liquor: 'Intact' | 'Clear' | 'Meconium' | 'Bloody' | 'Dry';
  moulding: '+' | '++' | '+++' | 'None';
}

interface PartographProps {
  patientName: string;
  admissionTime: Date;
  gravida?: string;
  parity?: string;
}

export function Partograph({ 
  patientName, 
  admissionTime,
  gravida = 'G1',
  parity = 'P0'
}: PartographProps) {
  const [entries, setEntries] = useState<PartographEntry[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<PartographEntry>>({
    cervicalDilation: 0,
    fetalHeartRate: 140,
    contractions: 3,
    contractionDuration: 40,
    fetalHeadDescent: 5,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    pulse: 80,
    temperature: 37.0,
    urine: { volume: 'Normal', protein: 'Nil', ketones: 'Nil' },
    liquor: 'Intact',
    moulding: 'None'
  });

  const addEntry = () => {
    if (!currentEntry.cervicalDilation || !currentEntry.fetalHeartRate) {
      toast.error('Please fill in required fields');
      return;
    }

    const now = new Date();
    const hoursInLabor = (now.getTime() - admissionTime.getTime()) / (1000 * 60 * 60);

    const newEntry: PartographEntry = {
      ...currentEntry as PartographEntry,
      time: now,
      hoursInLabor: Math.round(hoursInLabor * 10) / 10
    };

    setEntries(prev => [...prev, newEntry].sort((a, b) => a.hoursInLabor - b.hoursInLabor));
    setShowAddDialog(false);
    
    // Check for alerts
    checkForAlerts(newEntry);
    
    toast.success('Entry added successfully');
  };

  const checkForAlerts = (entry: PartographEntry) => {
    const alerts: string[] = [];

    // Check if crossing action line (dilation progressing too slowly)
    if (entries.length > 0) {
      const lastEntry = entries[entries.length - 1];
      const timeDiff = entry.hoursInLabor - lastEntry.hoursInLabor;
      const dilationDiff = entry.cervicalDilation - lastEntry.cervicalDilation;
      
      if (timeDiff >= 4 && dilationDiff < 1) {
        alerts.push('Cervical dilation progressing slowly - consider intervention');
      }
    }

    // Fetal heart rate
    if (entry.fetalHeartRate < 110 || entry.fetalHeartRate > 160) {
      alerts.push(`Abnormal fetal heart rate: ${entry.fetalHeartRate} bpm`);
    }

    // Blood pressure
    if (entry.bloodPressureSystolic >= 140 || entry.bloodPressureDiastolic >= 90) {
      alerts.push('Elevated blood pressure detected');
    }

    // Temperature
    if (entry.temperature >= 38.0) {
      alerts.push('Maternal pyrexia detected');
    }

    // Meconium
    if (entry.liquor === 'Meconium' || entry.liquor === 'Bloody') {
      alerts.push(`Abnormal liquor: ${entry.liquor}`);
    }

    // Severe moulding
    if (entry.moulding === '+++') {
      alerts.push('Severe moulding detected - possible CPD');
    }

    if (alerts.length > 0) {
      toast.error(alerts[0], {
        description: alerts.length > 1 ? `+${alerts.length - 1} more alerts` : undefined
      });
    }
  };

  const deleteEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
    toast.success('Entry deleted');
  };

  // Prepare chart data with alert and action lines
  const chartData = entries.map(entry => ({
    hours: entry.hoursInLabor,
    dilation: entry.cervicalDilation,
    alertLine: Math.min(10, entry.hoursInLabor * 1), // 1cm/hour
    actionLine: Math.min(10, entry.hoursInLabor * 0.5), // Alert line shifted 4 hours right
    fhr: entry.fetalHeartRate
  }));

  const exportPDF = async () => {
    // Use the new PDF generator
    const { generatePartographPDF } = await import('./utils/pdfGenerator');
    
    try {
      await generatePartographPDF({
        patientName,
        admissionTime,
        gravida,
        parity,
        entries
      });
      toast.success('Partograph downloaded successfully! Open the file and print as PDF.');
    } catch (error) {
      toast.error('Failed to generate partograph');
    }
  };

  const exportPDFOld = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Partograph - ${patientName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #e06b75; border-bottom: 3px solid #e06b75; padding-bottom: 10px; }
              .header-info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 20px 0; }
              .info-item { background: #f9f9f9; padding: 10px; border-radius: 5px; }
              .label { font-weight: bold; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
              th { background: #e06b75; color: white; padding: 8px; text-align: left; }
              td { padding: 8px; border: 1px solid #ddd; }
              tr:nth-child(even) { background: #f9f9f9; }
              .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
              .critical { background: #f8d7da; border-left: 4px solid #dc3545; }
              @media print { body { padding: 10px; } }
            </style>
          </head>
          <body>
            <h1>WHO PARTOGRAPH</h1>
            <div class="header-info">
              <div class="info-item"><span class="label">Patient:</span> ${patientName}</div>
              <div class="info-item"><span class="label">Date:</span> ${admissionTime.toLocaleDateString('en-KE')}</div>
              <div class="info-item"><span class="label">Gravida/Parity:</span> ${gravida}/${parity}</div>
              <div class="info-item"><span class="label">Admission Time:</span> ${admissionTime.toLocaleTimeString('en-KE')}</div>
            </div>

            <h2>Labor Progress</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Hours</th>
                  <th>Dilation (cm)</th>
                  <th>FHR (bpm)</th>
                  <th>Contractions</th>
                  <th>Descent</th>
                  <th>BP</th>
                  <th>Pulse</th>
                  <th>Temp</th>
                  <th>Liquor</th>
                </tr>
              </thead>
              <tbody>
                ${entries.map(entry => `
                  <tr>
                    <td>${entry.time.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>${entry.hoursInLabor.toFixed(1)}</td>
                    <td>${entry.cervicalDilation}</td>
                    <td>${entry.fetalHeartRate}</td>
                    <td>${entry.contractions}/10min (${entry.contractionDuration}s)</td>
                    <td>${entry.fetalHeadDescent}/5</td>
                    <td>${entry.bloodPressureSystolic}/${entry.bloodPressureDiastolic}</td>
                    <td>${entry.pulse}</td>
                    <td>${entry.temperature}°C</td>
                    <td>${entry.liquor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666;">
              <p><strong>SasaMum</strong> - WHO Partograph Implementation</p>
              <p style="font-size: 11px; margin-top: 5px;">Generated: ${new Date().toLocaleString('en-KE')}</p>
              <button onclick="window.print()" style="background: #e06b75; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">Print / Save as PDF</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">WHO Partograph</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {patientName} • {gravida}/{parity} • Started: {admissionTime.toLocaleString('en-KE', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
            <Button
              variant="outline"
              onClick={exportPDF}
              disabled={entries.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/30 p-2 rounded">
                <p className="text-xs text-muted-foreground">Current Dilation</p>
                <p className="text-lg text-foreground">{entries[entries.length - 1].cervicalDilation} cm</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <p className="text-xs text-muted-foreground">Latest FHR</p>
                <p className="text-lg text-foreground">{entries[entries.length - 1].fetalHeartRate} bpm</p>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <p className="text-xs text-muted-foreground">Time in Labor</p>
                <p className="text-lg text-foreground">{entries[entries.length - 1].hoursInLabor.toFixed(1)} hrs</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      {entries.length > 0 && (
        <Tabs defaultValue="dilation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dilation">Cervical Dilation</TabsTrigger>
            <TabsTrigger value="fhr">Fetal Heart Rate</TabsTrigger>
            <TabsTrigger value="vitals">Maternal Vitals</TabsTrigger>
          </TabsList>

          <TabsContent value="dilation">
            <Card>
              <CardHeader>
                <h3 className="text-foreground">Cervical Dilation Progress</h3>
                <p className="text-xs text-muted-foreground">
                  Alert line (1 cm/hr) and Action line shown
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hours" 
                      label={{ value: 'Hours in Labor', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      label={{ value: 'Dilation (cm)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={10} stroke="#22c55e" strokeDasharray="3 3" label="Full Dilation" />
                    <Line 
                      type="monotone" 
                      dataKey="dilation" 
                      stroke="#e06b75" 
                      strokeWidth={3}
                      name="Actual Progress"
                      dot={{ fill: '#e06b75', r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alertLine" 
                      stroke="#fbbf24" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Alert Line"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actionLine" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Action Line"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fhr">
            <Card>
              <CardHeader>
                <h3 className="text-foreground">Fetal Heart Rate Monitoring</h3>
                <p className="text-xs text-muted-foreground">
                  Normal range: 110-160 bpm
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hours" 
                      label={{ value: 'Hours in Labor', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={[100, 180]}
                      label={{ value: 'FHR (bpm)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={110} stroke="#ef4444" strokeDasharray="3 3" label="Lower Limit" />
                    <ReferenceLine y={160} stroke="#ef4444" strokeDasharray="3 3" label="Upper Limit" />
                    <Area 
                      type="monotone" 
                      dataKey="fhr" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Fetal Heart Rate"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="text-foreground">Blood Pressure</h3>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={entries.map((e, i) => ({
                      time: e.hoursInLabor,
                      systolic: e.bloodPressureSystolic,
                      diastolic: e.bloodPressureDiastolic
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} />
                      <YAxis domain={[60, 180]} />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Entries Table */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-foreground">All Entries</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-foreground">
                        {entry.time.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} 
                        <span className="text-muted-foreground ml-2">({entry.hoursInLabor.toFixed(1)} hrs)</span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEntry(index)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Dilation:</span> {entry.cervicalDilation} cm</div>
                    <div><span className="text-muted-foreground">FHR:</span> {entry.fetalHeartRate} bpm</div>
                    <div><span className="text-muted-foreground">Contractions:</span> {entry.contractions}/10min</div>
                    <div><span className="text-muted-foreground">BP:</span> {entry.bloodPressureSystolic}/{entry.bloodPressureDiastolic}</div>
                    <div><span className="text-muted-foreground">Descent:</span> {entry.fetalHeadDescent}/5</div>
                    <div><span className="text-muted-foreground">Temp:</span> {entry.temperature}°C</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {entries.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No entries yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Entry Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Partograph Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dilation">Cervical Dilation (cm) *</Label>
                <Input
                  id="dilation"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={currentEntry.cervicalDilation}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, cervicalDilation: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fhr">Fetal Heart Rate (bpm) *</Label>
                <Input
                  id="fhr"
                  type="number"
                  min="100"
                  max="200"
                  value={currentEntry.fetalHeartRate}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, fetalHeartRate: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractions">Contractions (per 10 min)</Label>
                <Input
                  id="contractions"
                  type="number"
                  min="0"
                  max="10"
                  value={currentEntry.contractions}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, contractions: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  max="120"
                  value={currentEntry.contractionDuration}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, contractionDuration: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descent">Fetal Head Descent (fifths)</Label>
                <Input
                  id="descent"
                  type="number"
                  min="0"
                  max="5"
                  value={currentEntry.fetalHeadDescent}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, fetalHeadDescent: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure (mmHg)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Systolic"
                    value={currentEntry.bloodPressureSystolic}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, bloodPressureSystolic: parseInt(e.target.value) }))}
                  />
                  <span className="self-center">/</span>
                  <Input
                    type="number"
                    placeholder="Diastolic"
                    value={currentEntry.bloodPressureDiastolic}
                    onChange={e => setCurrentEntry(prev => ({ ...prev, bloodPressureDiastolic: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  min="40"
                  max="150"
                  value={currentEntry.pulse}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, pulse: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  value={currentEntry.temperature}
                  onChange={e => setCurrentEntry(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addEntry} className="flex-1">
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About WHO Partograph</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              The partograph is a WHO-recommended tool for monitoring labor progress and maternal/fetal wellbeing.
            </p>
            <div className="space-y-2">
              <h4 className="text-foreground">Key Components:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cervical dilation chart with alert and action lines</li>
                <li>Fetal heart rate monitoring</li>
                <li>Contraction frequency and duration</li>
                <li>Descent of fetal head</li>
                <li>Maternal vital signs</li>
              </ul>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded">
              <p className="text-sm">
                <strong>Alert Line:</strong> Expected progress (1 cm/hr)<br />
                <strong>Action Line:</strong> 4 hours right of alert line - consider intervention
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
