"use client";

import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuItem {
  id: string;
  type: string;
  items: string[];
  day: string;
  meal: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];
const MESS_TYPES = ['national', 'international'];

export default function MessMenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedMeal, setSelectedMeal] = useState(MEALS[0]);
  const [selectedType, setSelectedType] = useState(MESS_TYPES[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  // Form states
  const [items, setItems] = useState<string[]>(['']);

  useEffect(() => {
    fetchMenus();
  }, [selectedDay, selectedType]);

  async function fetchMenus() {
    try {
      const menuRef = collection(db, 'mess-menus');
      const menuQuery = query(
        menuRef,
        where('day', '==', selectedDay),
        where('type', '==', selectedType)
      );
      const snapshot = await getDocs(menuQuery);
      const menuData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      setMenus(menuData);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: "Error",
        description: "Failed to fetch menu data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filteredItems = items.filter(item => item.trim() !== '');
    if (filteredItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one menu item.",
        variant: "destructive",
      });
      return;
    }

    try {
      const menuData = {
        type: selectedType,
        day: selectedDay,
        meal: selectedMeal,
        items: filteredItems,
      };

      if (editingMenu) {
        await updateDoc(doc(db, 'mess-menus', editingMenu.id), menuData);
        toast({
          title: "Success",
          description: "Menu updated successfully",
        });
      } else {
        await addDoc(collection(db, 'mess-menus'), menuData);
        toast({
          title: "Success",
          description: "Menu created successfully",
        });
      }

      resetForm();
      fetchMenus();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({
        title: "Error",
        description: "Failed to save menu. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function deleteMenu(menuId: string) {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      await deleteDoc(doc(db, 'mess-menus', menuId));
      setMenus(menus.filter(menu => menu.id !== menuId));
      toast({
        title: "Success",
        description: "Menu deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleEdit(menu: MenuItem) {
    setEditingMenu(menu);
    setItems(menu.items);
    setSelectedMeal(menu.meal);
    setIsAddDialogOpen(true);
  }

  function resetForm() {
    setItems(['']);
    setEditingMenu(null);
  }

  function addMenuItem() {
    setItems([...items, '']);
  }

  function removeMenuItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateMenuItem(index: number, value: string) {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mess Menu Management</h1>
          <p className="text-muted-foreground">
            Create and manage mess menus
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMenu ? 'Edit Menu' : 'Add New Menu'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Meal</Label>
                <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEALS.map((meal) => (
                      <SelectItem key={meal} value={meal}>
                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Menu Items</Label>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateMenuItem(index, e.target.value)}
                        placeholder={`Menu item ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMenuItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMenuItem}
                  className="w-full"
                >
                  Add Item
                </Button>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMenu ? 'Update Menu' : 'Create Menu'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <Tabs
          defaultValue={MESS_TYPES[0]}
          value={selectedType}
          onValueChange={setSelectedType}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              {MESS_TYPES.map((type) => (
                <TabsTrigger key={type} value={type} className="capitalize">
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => fetchMenus()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {MESS_TYPES.map((type) => (
            <TabsContent key={type} value={type}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menus
                      .filter(menu => menu.type === type)
                      .map((menu) => (
                        <TableRow key={menu.id}>
                          <TableCell className="font-medium capitalize">
                            {menu.meal}
                          </TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside space-y-1">
                              {menu.items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(menu)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMenu(menu.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
} 