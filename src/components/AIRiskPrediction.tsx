import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, TrendingUp, Brain, Activity, Heart, Droplet, Eye, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface AIRiskPredictionProps {
  onBack: () => void;
}

interface RiskFactor {
  name: string;
  risk: 'low' | 'medium' | 'high';
  score: number;
  recommendation: string;
}

export function AIRiskPrediction({ onBack }: AIRiskPredictionProps) {
  const [riskFactors] = useState<RiskFactor[]>([
    {
      name: 'Preeclampsia',
      risk: 'low',
      score: 15,
      recommendation: 'Continue monitoring blood pressure daily'
    },
    {
      name: 'Gestational Diabetes',
      risk: 'medium',
      score: 45,
      recommendation: 'Schedule glucose tolerance test and reduce sugar intake'
    },
    {
      name: 'Preterm Labor',
      risk: 'low',
      score: 20,
      recommendation: 'Maintain regular prenatal visits and rest adequately'
    },
    {
      name: 'Anemia',
      risk: 'medium',
      score: 38,
      recommendation: 'Increase iron-rich foods and continue supplements'
    }
  ]);

  const overallRiskScore = Math.round(
    riskFactors.reduce((acc, factor) => acc + factor.score, 0) / riskFactors.length
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
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
            <h1 className="text-xl text-foreground">AI Risk Prediction</h1>
            <p className="text-sm text-muted-foreground">ML-powered health insights</p>
          </div>
          <Brain className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Overall Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Overall Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{overallRiskScore}%</div>
                <p className="text-sm text-muted-foreground">Current Risk Level</p>
              </div>
              <Progress value={overallRiskScore} className="h-3" />
              <Alert className={overallRiskScore < 30 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  {overallRiskScore < 30 
                    ? 'Your pregnancy is progressing well. Continue your current care routine.'
                    : 'Some factors need attention. Follow the recommendations below.'}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4">Risk Factors Analysis</h2>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1">{factor.name}</h3>
                        <Badge className={getRiskBg(factor.risk)}>
                          <span className={getRiskColor(factor.risk)}>
                            {factor.risk.toUpperCase()} RISK
                          </span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className={getRiskColor(factor.risk)}>{factor.score}%</div>
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2 mb-3" />
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{factor.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4">Current Health Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Heart, label: 'Blood Pressure', value: '118/76', status: 'normal' },
              { icon: Droplet, label: 'Blood Sugar', value: '92 mg/dL', status: 'normal' },
              { icon: Activity, label: 'Heart Rate', value: '78 bpm', status: 'normal' },
              { icon: Eye, label: 'Vision', value: 'Clear', status: 'normal' }
            ].map((metric, index) => (
              <Card key={metric.label}>
                <CardContent className="p-4">
                  <metric.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.value}</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI-Generated Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Schedule glucose tolerance test within next 2 weeks',
                'Continue iron supplements (60mg daily)',
                'Monitor blood pressure twice daily',
                'Attend prenatal yoga class for stress management',
                'Stay hydrated - minimum 8 glasses of water daily'
              ].map((action, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm flex-1">{action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            This AI prediction is based on your health data and medical history. Always consult with your healthcare provider for medical decisions.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
