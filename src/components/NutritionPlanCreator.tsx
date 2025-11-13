import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import {
  X, Save, Plus, Minus, Apple, Coffee, UtensilsCrossed, Droplet,
  AlertCircle, CheckCircle2, Lightbulb, Send
} from 'lucide-react';

interface NutritionPlanCreatorProps {
  patient: any;
  onClose: () => void;
  onSave: (plan: NutritionPlan) => void;
}

interface NutritionPlan {
  patientId: string;
  patientName: string;
  trimester: number;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  iron: string;
  calcium: string;
  folicAcid: string;
  meals: Meal[];
  recommendations: string[];
  restrictions: string[];
  supplements: string[];
  notes: string;
}

interface Meal {
  time: string;
  type: string;
  foods: string[];
  portion: string;
}

export function NutritionPlanCreator({ patient, onClose, onSave }: NutritionPlanCreatorProps) {
  const trimester = patient.currentWeek <= 13 ? 1 : patient.currentWeek <= 27 ? 2 : 3;
  
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>({
    patientId: patient.id,
    patientName: patient.name,
    trimester: trimester,
    calories: trimester === 1 ? '1800' : trimester === 2 ? '2200' : '2400',
    protein: '71',
    carbs: '175',
    fats: '60',
    fiber: '28',
    iron: '27',
    calcium: '1000',
    folicAcid: '600',
    meals: [
      { time: '7:00 AM', type: 'Breakfast', foods: ['Whole grain porridge', 'Boiled egg', 'Fresh fruit'], portion: '1 cup + 1 egg + 1 fruit' },
      { time: '10:00 AM', type: 'Mid-Morning Snack', foods: ['Nuts', 'Yogurt'], portion: 'Handful + 1 cup' },
      { time: '1:00 PM', type: 'Lunch', foods: ['Ugali', 'Sukuma wiki', 'Beans', 'Chicken'], portion: '2 pieces + 1 cup + 1/2 cup + palm-sized' },
      { time: '4:00 PM', type: 'Afternoon Snack', foods: ['Fresh juice', 'Mandazi'], portion: '1 glass + 1 piece' },
      { time: '7:00 PM', type: 'Dinner', foods: ['Brown rice', 'Fish', 'Vegetables'], portion: '1 cup + palm-sized + 1 cup' }
    ],
    recommendations: [
      'Drink at least 8-10 glasses of water daily',
      'Eat small, frequent meals to manage nausea',
      'Include iron-rich foods like red meat, beans, and dark leafy greens',
      'Consume calcium-rich foods like milk, yogurt, and cheese',
      'Avoid raw or undercooked meat, fish, and eggs'
    ],
    restrictions: [
      'No alcohol',
      'Limit caffeine to less than 200mg per day',
      'Avoid unpasteurized dairy products',
      'No raw fish or shellfish',
      'Avoid processed and high-sodium foods'
    ],
    supplements: [
      'Prenatal multivitamin - 1 tablet daily',
      'Iron supplement - 65mg daily',
      'Folic acid - 600mcg daily',
      'Calcium - 1000mg daily'
    ],
    notes: ''
  });

  const [newMeal, setNewMeal] = useState({ time: '', type: '', foods: [''], portion: '' });
  const [showAddMeal, setShowAddMeal] = useState(false);

  const handleAddMeal = () => {
    if (newMeal.time && newMeal.type && newMeal.foods[0] && newMeal.portion) {
      setNutritionPlan({
        ...nutritionPlan,
        meals: [...nutritionPlan.meals, { ...newMeal }]
      });
      setNewMeal({ time: '', type: '', foods: [''], portion: '' });
      setShowAddMeal(false);
      toast.success('Meal added');
    } else {
      toast.error('Please fill in all meal details');
    }
  };

  const handleRemoveMeal = (index: number) => {
    setNutritionPlan({
      ...nutritionPlan,
      meals: nutritionPlan.meals.filter((_, i) => i !== index)
    });
    toast.success('Meal removed');
  };

  const handleAddRecommendation = () => {
    const recommendation = prompt('Enter recommendation:');
    if (recommendation) {
      setNutritionPlan({
        ...nutritionPlan,
        recommendations: [...nutritionPlan.recommendations, recommendation]
      });
    }
  };

  const handleAddRestriction = () => {
    const restriction = prompt('Enter dietary restriction:');
    if (restriction) {
      setNutritionPlan({
        ...nutritionPlan,
        restrictions: [...nutritionPlan.restrictions, restriction]
      });
    }
  };

  const handleAddSupplement = () => {
    const supplement = prompt('Enter supplement:');
    if (supplement) {
      setNutritionPlan({
        ...nutritionPlan,
        supplements: [...nutritionPlan.supplements, supplement]
      });
    }
  };

  const handleSave = () => {
    onSave(nutritionPlan);
    toast.success(`Nutrition plan created for ${patient.name}`);
    onClose();
  };

  const handleSendToPatient = () => {
    toast.success(`Nutrition plan sent to ${patient.name} via WhatsApp`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-card rounded-lg shadow-2xl max-h-[90vh] flex flex-col"
      >
  {/* Header */}
  <div className="page-header p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl text-foreground">Create Nutrition Plan</h2>
            <p className="text-sm text-muted-foreground">
              For {patient.name} • Week {patient.currentWeek} • Trimester {trimester}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Nutritional Requirements */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <UtensilsCrossed className="w-4 h-4 mr-2 text-primary" />
                  Daily Nutritional Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">Calories (kcal)</Label>
                    <Input
                      value={nutritionPlan.calories}
                      onChange={(e) => setNutritionPlan({ ...nutritionPlan, calories: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Protein (g)</Label>
                    <Input
                      value={nutritionPlan.protein}
                      onChange={(e) => setNutritionPlan({ ...nutritionPlan, protein: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Iron (mg)</Label>
                    <Input
                      value={nutritionPlan.iron}
                      onChange={(e) => setNutritionPlan({ ...nutritionPlan, iron: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Calcium (mg)</Label>
                    <Input
                      value={nutritionPlan.calcium}
                      onChange={(e) => setNutritionPlan({ ...nutritionPlan, calcium: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Coffee className="w-4 h-4 mr-2 text-primary" />
                    Daily Meal Plan
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setShowAddMeal(!showAddMeal)}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Meal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {showAddMeal && (
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Time</Label>
                        <Input
                          type="time"
                          value={newMeal.time}
                          onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Meal Type</Label>
                        <Input
                          placeholder="e.g., Breakfast"
                          value={newMeal.type}
                          onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Foods</Label>
                      <Input
                        placeholder="e.g., Ugali, Sukuma wiki, Beans"
                        value={newMeal.foods[0]}
                        onChange={(e) => setNewMeal({ ...newMeal, foods: [e.target.value] })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Portion Size</Label>
                      <Input
                        placeholder="e.g., 1 cup + 1/2 cup"
                        value={newMeal.portion}
                        onChange={(e) => setNewMeal({ ...newMeal, portion: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleAddMeal}>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAddMeal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {nutritionPlan.meals.map((meal, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">{meal.time}</Badge>
                        <p className="text-foreground">{meal.type}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {meal.foods.join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Portion: {meal.portion}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveMeal(index)}
                      className="h-8 w-8"
                    >
                      <Minus className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-primary" />
                    Dietary Recommendations
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddRecommendation}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nutritionPlan.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Restrictions */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    Foods to Avoid
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddRestriction}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nutritionPlan.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                      <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{restriction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supplements */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Apple className="w-4 h-4 mr-2 text-primary" />
                    Recommended Supplements
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddSupplement}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nutritionPlan.supplements.map((supplement, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{supplement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={nutritionPlan.notes}
                  onChange={(e) => setNutritionPlan({ ...nutritionPlan, notes: e.target.value })}
                  placeholder="Add any special instructions or notes..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Plan
            </Button>
            <Button onClick={handleSendToPatient} className="flex-1 bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Send to Patient
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
