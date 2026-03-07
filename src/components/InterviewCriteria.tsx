import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Settings, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { AIQuestionGenerator } from './AIQuestionGenerator';

interface InterviewCriteriaProps {
  gigId: string;
}

export default function InterviewCriteria({ gigId }: InterviewCriteriaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState({
    questions: [''],
    requirements: [''],
    skills: [''],
    experience: '',
    budget: '',
    timeline: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCriteria();
    }
  }, [isOpen]);

  const fetchCriteria = async () => {
    try {
      const response = await fetch(`/api/gigs/interview-criteria?gigId=${gigId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setCriteria({
            questions: data.questions || [''],
            requirements: data.requirements || [''],
            skills: data.skills || [''],
            experience: data.experience || '',
            budget: data.budget?.toString() || '',
            timeline: data.timeline?.toString() || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching criteria:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/gigs/interview-criteria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gigId,
          questions: criteria.questions.filter(q => q.trim()),
          requirements: criteria.requirements.filter(r => r.trim()),
          skills: criteria.skills.filter(s => s.trim()),
          experience: criteria.experience,
          budget: criteria.budget ? parseFloat(criteria.budget) : null,
          timeline: criteria.timeline ? parseInt(criteria.timeline) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Interview criteria saved successfully!');
        setIsOpen(false);
      } else {
        toast.error(data.error || 'Failed to save criteria');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addField = (field: 'questions' | 'requirements' | 'skills') => {
    setCriteria(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'questions' | 'requirements' | 'skills', index: number) => {
    setCriteria(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'questions' | 'requirements' | 'skills', index: number, value: string) => {
    setCriteria(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Interview Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Criteria Setup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Interview Questions</Label>
              <div className="flex gap-2">
                <AIQuestionGenerator
                  jobTitle="Freelancer"
                  skills={criteria.skills.filter(s => s.trim())}
                  category="General"
                  onQuestionsGenerated={(questions) => {
                    setCriteria(prev => ({ ...prev, questions }))
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addField('questions')}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {criteria.questions.map((question, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  value={question}
                  onChange={(e) => updateField('questions', index, e.target.value)}
                  placeholder="Enter interview question..."
                  rows={2}
                />
                {criteria.questions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField('questions', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Requirements</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addField('requirements')}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {criteria.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={req}
                  onChange={(e) => updateField('requirements', index, e.target.value)}
                  placeholder="Enter requirement..."
                />
                {criteria.requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField('requirements', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Required Skills</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addField('skills')}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {criteria.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={skill}
                  onChange={(e) => updateField('skills', index, e.target.value)}
                  placeholder="Enter skill..."
                />
                {criteria.skills.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeField('skills', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Input
                id="experience"
                value={criteria.experience}
                onChange={(e) => setCriteria(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 2+ years"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Range (KES)</Label>
              <Input
                id="budget"
                type="number"
                value={criteria.budget}
                onChange={(e) => setCriteria(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="Maximum budget"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="timeline">Expected Timeline (days)</Label>
            <Input
              id="timeline"
              type="number"
              value={criteria.timeline}
              onChange={(e) => setCriteria(prev => ({ ...prev, timeline: e.target.value }))}
              placeholder="Project duration"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              Save Criteria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}