import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Heart, Award, Users, Calendar, CheckCircle, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ImpactTrackerProps {
  onBack: () => void;
}

export function ImpactTracker({ onBack }: ImpactTrackerProps) {
  const healthScore = 85;
  const improvementRate = 23;

  const weeklyProgress = [
    { week: 'Week 28', score: 72 },
    { week: 'Week 29', score: 75 },
    { week: 'Week 30', score: 78 },
    { week: 'Week 31', score: 82 },
    { week: 'Week 32', score: 85 }
  ];

  const healthCategories = [
    { name: 'Nutrition', value: 90, color: '#4ade80' },
    { name: 'Exercise', value: 75, color: '#60a5fa' },
    { name: 'Sleep', value: 88, color: '#c084fc' },
    { name: 'Mental Health', value: 82, color: '#f472b6' },
    { name: 'Prenatal Care', value: 95, color: '#fb923c' }
  ];

  const milestones = [
    {
      title: 'First ANC Visit Completed',
      date: 'June 15, 2025',
      impact: 'high',
      description: 'Established baseline health metrics'
    },
    {
      title: 'Nutrition Goals Achieved',
      date: 'August 10, 2025',
      impact: 'medium',
      description: 'Maintained balanced diet for 30 days'
    },
    {
      title: 'Joined Support Group',
      date: 'September 5, 2025',
      impact: 'medium',
      description: 'Connected with 15 other mothers'
    },
    {
      title: 'All Vaccinations Current',
      date: 'October 12, 2025',
      impact: 'high',
      description: 'Protected against preventable diseases'
    }
  ];

  const outcomes = [
    {
      metric: 'Blood Pressure',
      before: '135/88',
      current: '118/76',
      status: 'improved',
      improvement: '15%'
    },
    {
      metric: 'Weight Gain',
      before: '58 kg',
      current: '65 kg',
      status: 'on-track',
      improvement: 'Healthy'
    },
    {
      metric: 'Iron Levels',
      before: '9.2 g/dL',
      current: '12.1 g/dL',
      status: 'improved',
      improvement: '32%'
    },
    {
      metric: 'Stress Score',
      before: '68/100',
      current: '32/100',
      status: 'improved',
      improvement: '53%'
    }
  ];

  const achievements = [
    { title: 'Perfect Attendance', count: 8, description: 'ANC visits' },
    { title: 'Healthy Habits', count: 45, description: 'Days streak' },
    { title: 'Community Support', count: 23, description: 'Helped others' },
    { title: 'Learning Progress', count: 1250, description: 'Points earned' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-700 dark:bg-green-900/20';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20';
      default: return 'bg-gray-100 text-gray-700';
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
            <h1 className="text-xl text-foreground">Impact Tracker</h1>
            <p className="text-sm text-muted-foreground">Your health journey</p>
          </div>
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="pt-20 p-4 space-y-6">
        {/* Overall Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                <div className="text-3xl text-green-600">{healthScore}</div>
              </div>
              <h3 className="mb-2">Overall Health Score</h3>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 mb-2">
                Excellent Progress
              </Badge>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>+{improvementRate}% from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>5-Week Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
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
                    dataKey="score"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={{ fill: '#4ade80', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="mb-4">Health Categories</h2>
          <div className="space-y-3">
            {healthCategories.map((category, index) => (
              <Card key={category.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-sm font-medium">{category.value}%</span>
                  </div>
                  <Progress value={category.value} className="h-2" style={{ '--progress-color': category.color } as any} />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <Card key={achievement.title}>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl mb-1">{achievement.count}</div>
                  <h4 className="text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Health Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Health Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outcomes.map((outcome, index) => (
                <div key={outcome.metric} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm">{outcome.metric}</h4>
                    <Badge className={getImpactColor(outcome.status === 'improved' ? 'high' : 'medium')}>
                      {outcome.improvement}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Before</p>
                      <p>{outcome.before}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current</p>
                      <p className="font-medium text-green-600">{outcome.current}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="mb-4">Journey Milestones</h2>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm">{milestone.title}</h3>
                        <Badge className={getImpactColor(milestone.impact)} variant="outline">
                          {milestone.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{milestone.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Share Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="bg-primary/5">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="mb-2">Inspire Others</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your health journey to motivate other mothers
              </p>
              <Button className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Share My Progress
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
