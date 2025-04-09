"use client";

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, PlusCircle, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  registrationLink: string;
  prizePool: string;
  themes: string;
  location: string;
  organizers: string;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHackathon, setCurrentHackathon] = useState<Partial<Hackathon> | null>(null);
  const { toast } = useToast();

  const hackathonsCollectionRef = collection(db, 'hackathons');

  // Fetch Hackathons
  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const q = query(hackathonsCollectionRef, orderBy('startDate', 'desc'));
      const data = await getDocs(q);
      const fetchedHackathons = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as Hackathon));

      // If no hackathons found, add sample data for demonstration
      if (fetchedHackathons.length === 0) {
        // Create sample hackathons for admin view
        const now = new Date();
        const startDate1 = new Date(now);
        startDate1.setDate(startDate1.getDate() + 7); // Start 7 days from now

        const endDate1 = new Date(startDate1);
        endDate1.setDate(endDate1.getDate() + 3); // End 3 days after start date

        const startDate2 = new Date(now);
        startDate2.setDate(startDate2.getDate() + 14); // Start 14 days from now

        const endDate2 = new Date(startDate2);
        endDate2.setDate(endDate2.getDate() + 2); // End 2 days after start date

        const sampleHackathons = [
          {
            id: 'sample-hackathon-1',
            title: "SRM AP Coding Challenge 2023",
            description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
            startDate: Timestamp.fromDate(startDate1),
            endDate: Timestamp.fromDate(endDate1),
            location: "SRM University AP, Andhra Pradesh",
            prizePool: "₹50,000",
            themes: "AI/ML, Web Development, Mobile Apps",
            organizers: "SRM AP Tech Club",
            registrationLink: "https://forms.gle/example",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
            id: 'sample-hackathon-2',
            title: "BlockChain Innovation Hackathon",
            description: "Explore the world of blockchain technology and develop innovative solutions for real-world problems. Open to all engineering students.",
            startDate: Timestamp.fromDate(startDate2),
            endDate: Timestamp.fromDate(endDate2),
            location: "Virtual Event",
            prizePool: "₹75,000",
            themes: "Blockchain, Cryptocurrency, Smart Contracts",
            organizers: "SRM Blockchain Club",
            registrationLink: "https://forms.gle/example2",
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
        ];
        setHackathons(sampleHackathons);
        console.log('Using sample hackathon data for admin demonstration');
      } else {
        setHackathons(fetchedHackathons);
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast({ title: 'Error', description: 'Failed to fetch hackathons.', variant: 'destructive' });

      // Fallback to sample data in case of error
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() + 7);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);

      const sampleHackathons = [
        {
          id: 'sample-hackathon-1',
          title: "SRM AP Coding Challenge 2023",
          description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          location: "SRM University AP, Andhra Pradesh",
          prizePool: "₹50,000",
          themes: "AI/ML, Web Development, Mobile Apps",
          organizers: "SRM AP Tech Club",
          registrationLink: "https://forms.gle/example",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }
      ];
      setHackathons(sampleHackathons);
      console.log('Using sample hackathon data due to error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  // Handle Save (Add/Edit)
  const handleSave = async () => {
    if (!currentHackathon || !currentHackathon.title || !currentHackathon.startDate || !currentHackathon.endDate) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);

    try {
      const dataToSave = {
        title: currentHackathon.title,
        description: currentHackathon.description || '',
        startDate: currentHackathon.startDate instanceof Date
          ? Timestamp.fromDate(currentHackathon.startDate)
          : currentHackathon.startDate,
        endDate: currentHackathon.endDate instanceof Date
          ? Timestamp.fromDate(currentHackathon.endDate)
          : currentHackathon.endDate,
        registrationLink: currentHackathon.registrationLink || '',
        prizePool: currentHackathon.prizePool || '',
        themes: currentHackathon.themes || '',
        location: currentHackathon.location || '',
        organizers: currentHackathon.organizers || '',
        imageUrl: currentHackathon.imageUrl || '',
        updatedAt: Timestamp.now(),
      };

      if (currentHackathon.id) {
        // Update existing hackathon
        const hackathonDoc = doc(db, 'hackathons', currentHackathon.id);
        await updateDoc(hackathonDoc, dataToSave);
        toast({ title: 'Success', description: 'Hackathon updated successfully.' });
      } else {
        // Add new hackathon
        await addDoc(hackathonsCollectionRef, {
          ...dataToSave,
          createdAt: Timestamp.now()
        });
        toast({ title: 'Success', description: 'Hackathon added successfully.' });
      }
      setIsDialogOpen(false);
      setCurrentHackathon(null);
      fetchHackathons();
    } catch (error) {
      console.error('Error saving hackathon:', error);
      toast({ title: 'Error', description: 'Failed to save hackathon.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hackathon?')) return;

    try {
      const hackathonDoc = doc(db, 'hackathons', id);
      await deleteDoc(hackathonDoc);
      toast({ title: 'Success', description: 'Hackathon deleted successfully.' });
      fetchHackathons();
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      toast({ title: 'Error', description: 'Failed to delete hackathon.', variant: 'destructive' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentHackathon((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'startDate' | 'endDate') => {
    const { value } = e.target;
    if (value) {
      const date = new Date(value);
      setCurrentHackathon((prev) => (prev ? { ...prev, [fieldName]: date } : null));
    }
  };

  const openDialog = (hackathon: Partial<Hackathon> | null = null) => {
    if (hackathon) {
      // Convert Timestamps to Date objects for editing
      setCurrentHackathon({
        ...hackathon,
        startDate: hackathon.startDate instanceof Timestamp ? hackathon.startDate.toDate() : hackathon.startDate,
        endDate: hackathon.endDate instanceof Timestamp ? hackathon.endDate.toDate() : hackathon.endDate,
      });
    } else {
      // Use current date as default for new hackathons
      setCurrentHackathon({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        registrationLink: '',
        prizePool: '',
        themes: '',
        location: '',
        organizers: '',
        imageUrl: ''
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Hackathons</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add Hackathon</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentHackathon?.id ? 'Edit' : 'Add'} Hackathon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title *</Label>
                <Input id="title" name="title" value={currentHackathon?.title || ''} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" name="description" value={currentHackathon?.description || ''} onChange={handleInputChange} className="col-span-3" rows={4} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date *</Label>
                <div className="col-span-3">
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={currentHackathon?.startDate instanceof Date ?
                      format(currentHackathon.startDate, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date *</Label>
                <div className="col-span-3">
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={currentHackathon?.endDate instanceof Date ?
                      format(currentHackathon.endDate, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => handleDateChange(e, 'endDate')}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registrationLink" className="text-right">Registration Link</Label>
                <Input id="registrationLink" name="registrationLink" value={currentHackathon?.registrationLink || ''} onChange={handleInputChange} className="col-span-3" placeholder="https://example.com/register" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prizePool" className="text-right">Prize Pool</Label>
                <Input id="prizePool" name="prizePool" value={currentHackathon?.prizePool || ''} onChange={handleInputChange} className="col-span-3" placeholder="e.g., $1000 + Swag" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="themes" className="text-right">Themes</Label>
                <Input id="themes" name="themes" value={currentHackathon?.themes || ''} onChange={handleInputChange} className="col-span-3" placeholder="AI, Web Dev, Blockchain" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" name="location" value={currentHackathon?.location || ''} onChange={handleInputChange} className="col-span-3" placeholder="Auditorium, Online" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organizers" className="text-right">Organizers</Label>
                <Input id="organizers" name="organizers" value={currentHackathon?.organizers || ''} onChange={handleInputChange} className="col-span-3" placeholder="Coding Club, IEEE" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" value={currentHackathon?.imageUrl || ''} onChange={handleInputChange} className="col-span-3" placeholder="https://example.com/hackathon.jpg" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hackathons.length > 0 ? (
                  hackathons.map((hackathon) => (
                    <TableRow key={hackathon.id}>
                      <TableCell className="font-medium">{hackathon.title}</TableCell>
                      <TableCell>
                        {hackathon.startDate instanceof Timestamp
                          ? hackathon.startDate.toDate().toLocaleString()
                          : hackathon.startDate instanceof Date
                            ? hackathon.startDate.toLocaleString()
                            : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {hackathon.endDate instanceof Timestamp
                          ? hackathon.endDate.toDate().toLocaleString()
                          : hackathon.endDate instanceof Date
                            ? hackathon.endDate.toLocaleString()
                            : 'N/A'}
                      </TableCell>
                      <TableCell>{hackathon.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openDialog(hackathon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(hackathon.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No hackathons found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}