import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Gavel, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BidButtonProps {
  gigId: string;
  userId: string;
  gigTitle: string;
  currentPrice: number;
}

export default function BidButton({ gigId, userId, gigTitle, currentPrice }: BidButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    proposal: '',
    timeline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gigId,
          bidderId: userId,
          amount: parseFloat(formData.amount),
          proposal: formData.proposal,
          timeline: parseInt(formData.timeline)
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Bid submitted successfully!');
        setIsOpen(false);
        setFormData({ amount: '', proposal: '', timeline: '' });
      } else {
        toast.error(data.error || 'Failed to submit bid');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gavel className="h-4 w-4" />
          Place Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Your Bid</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Gig: {gigTitle}</Label>
            <p className="text-sm text-muted-foreground">Current Price: KES {currentPrice}</p>
          </div>
          
          <div>
            <Label htmlFor="amount">Your Bid Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter your bid amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="proposal">Proposal</Label>
            <Textarea
              id="proposal"
              value={formData.proposal}
              onChange={(e) => setFormData(prev => ({ ...prev, proposal: e.target.value }))}
              placeholder="Explain why you're the best fit for this project..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="timeline">Delivery Timeline (days)</Label>
            <Input
              id="timeline"
              type="number"
              value={formData.timeline}
              onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              placeholder="How many days to complete?"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Bid
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}