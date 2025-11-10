import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { copyWithFeedback } from './utils/clipboard';
import { Partograph } from './Partograph';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft,
  Play,
  Pause,
  AlertTriangle,
  Phone,
  Activity,
  Timer,
  Heart,
  Zap,
  Save,
  Share2,
  Users,
  Clock,
  TrendingUp,
  Circle,
  CheckCircle2,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Send,
  X
} from 'lucide-react';

interface ContractionMonitorProps {
  onBack: () => void;
  userName?: string;
}

interface Contraction {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  intensity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}

interface DilationEntry {
  id: string;
  dilation: number; // 0-10 cm
  timestamp: Date;
  notes?: string;
  checkedBy?: string;
}

interface LaborSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  contractions: Contraction[];
  dilations: DilationEntry[];
  isActive: boolean;
}

export function ContractionMonitor({ onBack, userName = "Grace" }: ContractionMonitorProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentContraction, setCurrentContraction] = useState<{ startTime: Date; id: string } | null>(null);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [dilations, setDilations] = useState<DilationEntry[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [contractionStartTime, setContractionStartTime] = useState<Date | null>(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'contractions' | 'dilation' | 'partograph'>('contractions');
  const [currentDilation, setCurrentDilation] = useState(0);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPartograph, setShowPartograph] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update elapsed time every second
  useEffect(() => {
    if (isTracking && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking, sessionStartTime]);

  // Check for labor patterns and emergency conditions
  useEffect(() => {
    if (contractions.length >= 3) {
      const recentContractions = contractions.slice(-5);
      const averageInterval = calculateAverageInterval(recentContractions);
      const averageDuration = calculateAverageDuration(recentContractions);
      const latestDilation = dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0;
      
      // Alert if contractions are 5 minutes apart or less, lasting 45+ seconds, OR dilation >= 7cm
      if ((averageInterval <= 5 * 60 && averageDuration >= 45) || latestDilation >= 7) {
        setShowEmergencyAlert(true);
      }
    }
  }, [contractions, dilations]);

  const startSession = () => {
    setIsTracking(true);
    setSessionStartTime(new Date());
    setContractions([]);
    setDilations([]);
    setElapsedTime(0);
  };

  const startContraction = () => {
    const now = new Date();
    setContractionStartTime(now);
    setCurrentContraction({
      startTime: now,
      id: Date.now().toString()
    });
  };

  const endContraction = (intensity: 1 | 2 | 3 | 4 | 5) => {
    if (currentContraction && contractionStartTime) {
      const now = new Date();
      const duration = Math.floor((now.getTime() - contractionStartTime.getTime()) / 1000);
      
      const completedContraction: Contraction = {
        id: currentContraction.id,
        startTime: currentContraction.startTime,
        endTime: now,
        duration,
        intensity,
        timestamp: now.toLocaleString('en-KE', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: 'short'
        })
      };

      setContractions(prev => [...prev, completedContraction]);
      setCurrentContraction(null);
      setContractionStartTime(null);
    }
  };

  const addDilationEntry = () => {
    if (currentDilation > 0) {
      const newEntry: DilationEntry = {
        id: Date.now().toString(),
        dilation: currentDilation,
        timestamp: new Date(),
        checkedBy: "Self-assessment"
      };
      setDilations(prev => [...prev, newEntry]);
      setCurrentDilation(0);
    }
  };

  const deleteDilation = (id: string) => {
    setDilations(prev => prev.filter(d => d.id !== id));
  };

  const deleteContraction = (id: string) => {
    setContractions(prev => prev.filter(c => c.id !== id));
  };

  const calculateAverageInterval = (contractionsArray: Contraction[]) => {
    if (contractionsArray.length < 2) return 0;
    
    let totalInterval = 0;
    for (let i = 1; i < contractionsArray.length; i++) {
      const interval = (contractionsArray[i].startTime.getTime() - contractionsArray[i-1].startTime.getTime()) / 1000;
      totalInterval += interval;
    }
    
    return totalInterval / (contractionsArray.length - 1);
  };

  const calculateAverageDuration = (contractionsArray: Contraction[]) => {
    if (contractionsArray.length === 0) return 0;
    
    const totalDuration = contractionsArray.reduce((sum, c) => sum + c.duration, 0);
    return totalDuration / contractionsArray.length;
  };

  const getTimeBetweenContractions = () => {
    if (contractions.length < 2) return null;
    
    const lastTwo = contractions.slice(-2);
    const interval = (lastTwo[1].startTime.getTime() - lastTwo[0].startTime.getTime()) / 1000;
    return Math.floor(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-red-500';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getLabourStage = () => {
    if (contractions.length < 3 && dilations.length === 0) return null;
    
    const avgInterval = calculateAverageInterval(contractions.slice(-5)) / 60; // in minutes
    const avgDuration = calculateAverageDuration(contractions.slice(-5)); // in seconds
    const latestDilation = dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0;
    
    if (latestDilation >= 8 || (avgInterval <= 2 && avgDuration >= 60)) {
      return { stage: 'Transition Phase (8-10cm)', color: 'text-red-600', urgent: true };
    } else if (latestDilation >= 6 || (avgInterval <= 3 && avgDuration >= 45)) {
      return { stage: 'Active Labor (6-8cm)', color: 'text-orange-600', urgent: true };
    } else if (latestDilation >= 3 || (avgInterval <= 5 && avgDuration >= 30)) {
      return { stage: 'Early Labor (3-6cm)', color: 'text-yellow-600', urgent: false };
    } else {
      return { stage: 'Latent Phase (0-3cm)', color: 'text-blue-600', urgent: false };
    }
  };

  const exportToCSV = () => {
    const rows = [
      ['SasaMum Labor Monitor Report'],
      ['Patient', userName],
      ['Session Start', sessionStartTime?.toLocaleString('en-KE') || 'N/A'],
      ['Session Duration', formatTime(elapsedTime)],
      [''],
      ['CONTRACTION HISTORY'],
      ['Time', 'Duration', 'Intensity', 'Notes'],
    ];

    contractions.forEach(c => {
      rows.push([
        c.timestamp,
        formatDuration(c.duration),
        `${c.intensity}/5`,
        getIntensityLabel(c.intensity)
      ]);
    });

    rows.push(['']);
    rows.push(['DILATION CHECKS']);
    rows.push(['Time', 'Dilation (cm)', 'Checked By']);

    dilations.forEach(d => {
      rows.push([
        d.timestamp.toLocaleString('en-KE'),
        `${d.dilation} cm`,
        d.checkedBy || 'N/A'
      ]);
    });

    rows.push(['']);
    rows.push(['STATISTICS']);
    rows.push(['Total Contractions', contractions.length.toString()]);
    rows.push(['Average Duration', formatDuration(Math.floor(calculateAverageDuration(contractions)))]);
    rows.push(['Average Interval', formatDuration(Math.floor(calculateAverageInterval(contractions)))]);
    rows.push(['Current Dilation', `${dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0} cm`]);
    rows.push(['Labor Stage', getLabourStage()?.stage || 'Not determined']);

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labor-monitor-${userName}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const exportToPDF = async () => {
    // Use the new PDF generator
    const { generateContractionMonitorPDF } = await import('./utils/pdfGenerator');
    
    try {
      await generateContractionMonitorPDF({
        contractions,
        userName
      });
      toast.success('Contraction report downloaded successfully! Open the file and print as PDF.');
      setShowExportDialog(false);
    } catch (error) {
      toast.error('Failed to generate contraction report');
    }
  };

  const exportToPDFOld = () => {
    // Create a simple text-based PDF report
    const reportText = generateReportText();
    
    // For a real PDF, you'd use jsPDF, but for simplicity, we'll create an HTML page that can be printed as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Labor Monitor Report - ${userName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 { color: #e06b75; margin-bottom: 10px; }
              h2 { color: #333; margin-top: 30px; border-bottom: 2px solid #e06b75; padding-bottom: 10px; }
              .header { background: #fdf8f6; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
              .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .label { font-weight: bold; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #e06b75; color: white; padding: 12px; text-align: left; }
              td { padding: 10px; border-bottom: 1px solid #ddd; }
              tr:nth-child(even) { background: #f9f9f9; }
              .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
              .stat-card { background: #fdf8f6; padding: 15px; border-radius: 8px; border-left: 4px solid #e06b75; }
              .stat-value { font-size: 24px; font-weight: bold; color: #e06b75; }
              .alert { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🤰 SasaMum Labor Monitor Report</h1>
              <div class="info-row">
                <div><span class="label">Patient:</span> ${userName}</div>
                <div><span class="label">Report Date:</span> ${new Date().toLocaleString('en-KE')}</div>
              </div>
              <div class="info-row">
                <div><span class="label">Session Start:</span> ${sessionStartTime?.toLocaleString('en-KE') || 'N/A'}</div>
                <div><span class="label">Duration:</span> ${formatTime(elapsedTime)}</div>
              </div>
            </div>

            ${getLabourStage()?.urgent ? `
              <div class="alert">
                <strong>⚠️ MEDICAL ALERT:</strong> Patient is in ${getLabourStage()?.stage}. 
                ${dilations.length > 0 && dilations[dilations.length - 1].dilation >= 7 
                  ? 'Cervical dilation indicates active labor. ' 
                  : 'Contraction pattern indicates active labor. '}
                Immediate medical attention recommended.
              </div>
            ` : ''}

            <h2>📊 Session Statistics</h2>
            <div class="stats">
              <div class="stat-card">
                <div class="label">Total Contractions</div>
                <div class="stat-value">${contractions.length}</div>
              </div>
              <div class="stat-card">
                <div class="label">Average Duration</div>
                <div class="stat-value">${formatDuration(Math.floor(calculateAverageDuration(contractions)))}</div>
              </div>
              <div class="stat-card">
                <div class="label">Average Interval</div>
                <div class="stat-value">${formatDuration(Math.floor(calculateAverageInterval(contractions)))}</div>
              </div>
              <div class="stat-card">
                <div class="label">Current Dilation</div>
                <div class="stat-value">${dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0} cm</div>
              </div>
            </div>

            ${dilations.length > 0 ? `
              <h2>🔄 Dilation Progress</h2>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Dilation (cm)</th>
                    <th>Checked By</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  ${dilations.map(d => `
                    <tr>
                      <td>${d.timestamp.toLocaleString('en-KE')}</td>
                      <td>${d.dilation} cm</td>
                      <td>${d.checkedBy || 'N/A'}</td>
                      <td>${d.dilation < 3 ? 'Early' : d.dilation < 7 ? 'Active' : 'Transition'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : ''}

            <h2>⚡ Contraction History</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Intensity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${contractions.map(c => `
                  <tr>
                    <td>${c.timestamp}</td>
                    <td>${formatDuration(c.duration)}</td>
                    <td>${c.intensity}/5</td>
                    <td>${getIntensityLabel(c.intensity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p><strong>SasaMum</strong> - Supporting Kenyan mothers through every step</p>
              <p style="font-size: 12px; margin-top: 10px;">
                This report should be reviewed by a qualified healthcare provider. 
                For emergencies, call 1190 (Kenya Emergency Services).
              </p>
              <button class="no-print" onclick="window.print()" style="
                background: #e06b75;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
              ">
                Print / Save as PDF
              </button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    setShowExportDialog(false);
  };

  const getIntensityLabel = (intensity: number) => {
    switch (intensity) {
      case 1: return 'Mild';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      case 5: return 'Severe';
      default: return 'Unknown';
    }
  };

  const generateReportText = () => {
    return `LABOR MONITOR REPORT
Patient: ${userName}
Session Start: ${sessionStartTime?.toLocaleString('en-KE')}
Duration: ${formatTime(elapsedTime)}

STATISTICS:
- Total Contractions: ${contractions.length}
- Average Duration: ${formatDuration(Math.floor(calculateAverageDuration(contractions)))}
- Average Interval: ${formatDuration(Math.floor(calculateAverageInterval(contractions)))}
- Current Dilation: ${dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0} cm
- Labor Stage: ${getLabourStage()?.stage || 'Not determined'}

${dilations.length > 0 ? `
DILATION HISTORY:
${dilations.map(d => `- ${d.timestamp.toLocaleString('en-KE')}: ${d.dilation} cm (${d.checkedBy || 'N/A'})`).join('\n')}
` : ''}

CONTRACTION HISTORY:
${contractions.map(c => `- ${c.timestamp}: ${formatDuration(c.duration)}, Intensity ${c.intensity}/5 (${getIntensityLabel(c.intensity)})`).join('\n')}

Generated by SasaMum - Labor Monitor`;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateReportText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareDialog(false);
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(generateReportText());
    window.location.href = `sms:?body=${text}`;
    setShowShareDialog(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Labor Monitor Report - ${userName}`);
    const body = encodeURIComponent(generateReportText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareDialog(false);
  };

  const copyReportToClipboard = async () => {
    await copyWithFeedback(
      generateReportText(),
      'Report copied to clipboard! ✅',
      'Labor Monitor Report'
    );
    setShowShareDialog(false);
  };

  const labourStage = getLabourStage();
  const latestDilation = dilations.length > 0 ? dilations[dilations.length - 1].dilation : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background w-full pb-20"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Button>
        <h1 className="text-lg text-foreground">Labor Monitor</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setShowExportDialog(true)} className="p-2" disabled={!isTracking}>
            <Download className="w-5 h-5 text-foreground" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowShareDialog(true)} className="p-2" disabled={!isTracking}>
            <Share2 className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Emergency Alert */}
      <AnimatePresence>
        {showEmergencyAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 border-b-2 border-destructive/30 p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-destructive">Time to Go to Hospital!</h4>
                <p className="text-destructive/80 text-sm mt-1">
                  {latestDilation >= 7 
                    ? `Dilation is ${latestDilation}cm - You're in active labor! Contact your healthcare provider immediately.`
                    : 'Your contractions indicate active labor. Contact your healthcare provider immediately.'}
                </p>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 1190
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/30 text-destructive">
                    Call Doctor
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pb-20">
        {/* Session Status */}
        <div className="p-4 bg-card border-b border-border">
          <Card className={isTracking ? "bg-primary/5 border-primary/20" : "border-border"}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="text-foreground">Labor Monitoring Session</h3>
                    {isTracking && sessionStartTime && (
                      <p className="text-xs text-muted-foreground">
                        Started: {sessionStartTime.toLocaleString('en-KE', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          day: '2-digit',
                          month: 'short'
                        })} • Duration: {formatTime(elapsedTime)}
                      </p>
                    )}
                    {!isTracking && <p className="text-sm text-muted-foreground">Ready to start monitoring</p>}
                  </div>
                </div>
                {labourStage && (
                  <Badge className={`${labourStage.color} bg-transparent border`}>
                    {labourStage.stage}
                  </Badge>
                )}
              </div>

              {!isTracking ? (
                <Button 
                  onClick={startSession} 
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Labor Monitoring
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* Tabs */}
                  <div className="flex bg-muted rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('contractions')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
                        activeTab === 'contractions'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Activity className="w-4 h-4 inline mr-2" />
                      Contractions
                    </button>
                    <button
                      onClick={() => setActiveTab('dilation')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
                        activeTab === 'dilation'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Circle className="w-4 h-4 inline mr-2" />
                      Dilation
                    </button>
                    <button
                      onClick={() => setActiveTab('partograph')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
                        activeTab === 'partograph'
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Partograph
                    </button>
                  </div>

                  {/* Contraction Tracking */}
                  {activeTab === 'contractions' && (
                    <div className="space-y-3">
                      {!currentContraction ? (
                        <Button 
                          onClick={startContraction}
                          className="w-full bg-primary hover:bg-primary/90"
                          size="lg"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Contraction Started
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-center bg-primary/10 p-4 rounded-lg">
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: [0.9, 1.1, 0.9] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-2xl text-primary mb-2"
                            >
                              <Timer className="w-8 h-8 mx-auto" />
                            </motion.div>
                            <p className="text-2xl text-foreground font-bold">
                              {formatTime(Math.floor((new Date().getTime() - contractionStartTime!.getTime()) / 1000))}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Current contraction</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Rate intensity (1-5):</p>
                            <div className="grid grid-cols-5 gap-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <Button
                                  key={level}
                                  onClick={() => endContraction(level as any)}
                                  className={`${getIntensityColor(level)} hover:opacity-80 text-white`}
                                  size="lg"
                                >
                                  {level}
                                </Button>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Mild</span>
                              <span>Moderate</span>
                              <span>Strong</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dilation Tracking */}
                  {activeTab === 'dilation' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="text-sm text-foreground mb-2">Cervical Dilation Assessment</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          Track dilation progress (0-10 cm). This should ideally be checked by your healthcare provider.
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-foreground">Dilation: {currentDilation} cm</span>
                              <span className="text-xs text-muted-foreground">
                                {currentDilation < 3 ? 'Early' : currentDilation < 7 ? 'Active' : 'Transition'}
                              </span>
                            </div>
                            <Slider
                              value={[currentDilation]}
                              onValueChange={(value) => setCurrentDilation(value[0])}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0 cm</span>
                              <span>5 cm</span>
                              <span>10 cm</span>
                            </div>
                          </div>

                          <Button
                            onClick={addDilationEntry}
                            disabled={currentDilation === 0}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Record Dilation Check
                          </Button>
                        </div>
                      </div>

                      {/* Latest Dilation */}
                      {latestDilation > 0 && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Current Dilation</p>
                              <p className="text-3xl text-primary font-bold">{latestDilation} cm</p>
                            </div>
                            <div className="text-right">
                              <Progress value={latestDilation * 10} className="w-20 h-20 rounded-full" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Partograph Tab */}
                  {activeTab === 'partograph' && sessionStartTime && (
                    <div className="mt-4">
                      <Partograph
                        patientName={userName}
                        admissionTime={sessionStartTime}
                        gravida="G1"
                        parity="P0"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {contractions.length > 0 && isTracking && (
          <div className="p-4 border-b border-border">
            <h4 className="text-foreground mb-3">Current Session Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="p-3 text-center">
                  <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Contractions</p>
                  <p className="text-lg text-foreground">{contractions.length}</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-3 text-center">
                  <Timer className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-lg text-foreground">
                    {formatDuration(Math.floor(calculateAverageDuration(contractions)))}
                  </p>
                </CardContent>
              </Card>

              {contractions.length >= 2 && (
                <>
                  <Card className="border-border">
                    <CardContent className="p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Avg Interval</p>
                      <p className="text-lg text-foreground">
                        {formatDuration(Math.floor(calculateAverageInterval(contractions)))}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-3 text-center">
                      <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Last Interval</p>
                      <p className="text-lg text-foreground">
                        {getTimeBetweenContractions() ? formatDuration(getTimeBetweenContractions()!) : '--'}
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* Dilation History */}
        {dilations.length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-foreground">Dilation Progress</h4>
              <Badge className="bg-primary/10 text-primary">{dilations.length} checks</Badge>
            </div>

            <div className="space-y-3">
              {dilations.slice(-5).reverse().map((dilation) => (
                <Card key={dilation.id} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg text-primary font-bold">{dilation.dilation}</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{dilation.dilation} cm dilation</p>
                          <p className="text-xs text-muted-foreground">
                            {dilation.timestamp.toLocaleString('en-KE', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </p>
                          {dilation.checkedBy && (
                            <p className="text-xs text-muted-foreground">By: {dilation.checkedBy}</p>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteDilation(dilation.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contraction History */}
        {contractions.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-foreground">Contraction History</h4>
            </div>

            <div className="space-y-3">
              {contractions.slice(-10).reverse().map((contraction) => (
                <Card key={contraction.id} className="border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getIntensityColor(contraction.intensity)}`} />
                        <div>
                          <p className="text-sm text-foreground font-medium">
                            {contraction.timestamp}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {formatDuration(contraction.duration)} • Intensity: {contraction.intensity}/5
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 rounded-full ${
                                level <= contraction.intensity 
                                  ? getIntensityColor(contraction.intensity)
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteContraction(contraction.id)}
                          className="text-destructive hover:bg-destructive/10 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="p-4 bg-destructive/10 border-t border-destructive/20">
          <h4 className="text-destructive mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Emergency Contacts
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <Button className="bg-green-600 hover:bg-green-700 justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Ambulance: 1190
            </Button>
            <Button variant="outline" className="border-destructive/30 text-destructive justify-start hover:bg-destructive/10">
              <Heart className="w-4 h-4 mr-2" />
              Your Doctor: +254 722 XXX XXX
            </Button>
            <Button variant="outline" className="border-destructive/30 text-destructive justify-start hover:bg-destructive/10">
              <Users className="w-4 h-4 mr-2" />
              Birth Partner: Call Now
            </Button>
          </div>
        </div>

        {/* Educational Info */}
        <div className="p-4">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-600/30">
            <CardContent className="p-4">
              <h4 className="text-blue-800 dark:text-blue-400 mb-2">💡 Labor Stages Guide</h4>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
                <div>
                  <strong>Latent Phase (0-3cm):</strong>
                  <p>• Contractions: Irregular, 5-30 min apart</p>
                  <p>• Stay home, rest, hydrate</p>
                </div>
                <div className="pt-2">
                  <strong>Active Labor (4-7cm):</strong>
                  <p>• Contractions: 3-5 min apart, 45-60 sec</p>
                  <p>• Go to hospital/birth center</p>
                </div>
                <div className="pt-2">
                  <strong>Transition (8-10cm):</strong>
                  <p>• Contractions: 2-3 min apart, 60-90 sec</p>
                  <p>• Almost time to push!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Export Labor Report</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Choose a format to export your labor monitoring data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={exportToCSV}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <FileSpreadsheet className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Export as CSV</div>
                <div className="text-xs opacity-80">Open in Excel or Google Sheets</div>
              </div>
            </Button>

            <Button
              onClick={exportToPDF}
              className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Export as PDF</div>
                <div className="text-xs opacity-80">Print or save as PDF document</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowExportDialog(false)}
              variant="outline"
              className="w-full border-border"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Share Report</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Share your labor report with healthcare providers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={shareViaWhatsApp}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Share via WhatsApp
            </Button>

            <Button
              onClick={shareViaEmail}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Mail className="w-5 h-5 mr-3" />
              Share via Email
            </Button>

            <Button
              onClick={shareViaSMS}
              className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <Send className="w-5 h-5 mr-3" />
              Share via SMS
            </Button>

            <Button
              onClick={copyReportToClipboard}
              variant="outline"
              className="w-full justify-start border-border"
              size="lg"
            >
              <FileText className="w-5 h-5 mr-3" />
              Copy to Clipboard
            </Button>

            <Button
              onClick={() => setShowShareDialog(false)}
              variant="outline"
              className="w-full border-border"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
