'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mainQuests as defaultMainQuests, sideQuests as defaultSideQuests, statIcons, Quest } from '@/lib/data';
import { Trash2, PlusCircle } from 'lucide-react';


interface EditableQuest extends Omit<Quest, 'id' | 'completed'> {
  id: string; // id can be a string for new quests
}


const QuestEditor = ({ title, quests, setQuests }: { title: string, quests: EditableQuest[], setQuests: React.Dispatch<React.SetStateAction<EditableQuest[]>> }) => {
    
    const handleQuestChange = (id: string, field: keyof Omit<EditableQuest, 'id'| 'completed'>, value: string | number) => {
        setQuests(quests.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const addQuest = () => {
        const newQuest: EditableQuest = {
            id: `new-${Date.now()}-${Math.random()}`,
            title: '',
            xp: 10,
            stat: 'intelligence'
        };
        setQuests([...quests, newQuest]);
    };

    const deleteQuest = (id: string) => {
        setQuests(quests.filter(q => q.id !== id));
    };

    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {quests.map((quest) => (
                        <div key={quest.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_150px_40px] gap-2 items-end p-2 border rounded-md">
                            <div>
                                <Label htmlFor={`title-${quest.id}`}>Title</Label>
                                <Input id={`title-${quest.id}`} value={quest.title} onChange={(e) => handleQuestChange(quest.id, 'title', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor={`xp-${quest.id}`}>XP</Label>
                                <Input id={`xp-${quest.id}`} type="number" value={quest.xp} onChange={(e) => handleQuestChange(quest.id, 'xp', parseInt(e.target.value) || 0)} />
                            </div>
                            <div>
                                <Label htmlFor={`stat-${quest.id}`}>Stat</Label>
                                 <Select value={quest.stat} onValueChange={(value) => handleQuestChange(quest.id, 'stat', value)}>
                                    <SelectTrigger id={`stat-${quest.id}`}>
                                        <SelectValue placeholder="Select stat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(statIcons).map(statName => (
                                            <SelectItem key={statName} value={statName}>{statName.charAt(0).toUpperCase() + statName.slice(1)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteQuest(quest.id)} aria-label="Delete quest">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" onClick={addQuest} className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Quest
                </Button>
            </CardContent>
        </Card>
    );
};


export default function SettingsPage() {
    const { toast } = useToast();
    const [mainQuests, setMainQuests] = useState<EditableQuest[]>([]);
    const [sideQuests, setSideQuests] = useState<EditableQuest[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedMain = localStorage.getItem('customMainQuests');
        const storedSide = localStorage.getItem('customSideQuests');
        
        setMainQuests(storedMain ? JSON.parse(storedMain) : defaultMainQuests);
        setSideQuests(storedSide ? JSON.parse(storedSide) : defaultSideQuests);
        setIsLoaded(true);
    }, []);

    const handleSave = () => {
        // Validation
        const allQuests = [...mainQuests, ...sideQuests];
        if (allQuests.some(q => !q.title.trim() || q.xp <= 0)) {
            toast({
                variant: 'destructive',
                title: 'Invalid Quest',
                description: 'Please make sure all quests have a title and XP value greater than 0.'
            });
            return;
        }

        const finalMainQuests = mainQuests.map(q => ({...q, id: q.id.startsWith('new-') ? `custom-${Date.now()}-${Math.random()}`: q.id}));
        const finalSideQuests = sideQuests.map(q => ({...q, id: q.id.startsWith('new-') ? `custom-${Date.now()}-${Math.random()}`: q.id}));

        localStorage.setItem('customMainQuests', JSON.stringify(finalMainQuests));
        localStorage.setItem('customSideQuests', JSON.stringify(finalSideQuests));
        window.dispatchEvent(new Event('questsChanged'));
        toast({
            title: 'Quests Saved',
            description: 'Your custom daily quests have been updated.'
        });
    };
    
    if (!isLoaded) {
        return (
             <div className="p-4 md:p-6 lg:p-8">
                <h1 className="text-2xl font-bold font-headline tracking-tighter mb-6">Settings</h1>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline tracking-tighter">Settings</h1>
                    <p className="text-muted-foreground">Customize your daily quests.</p>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
            
            <div className="space-y-6">
                <QuestEditor title="Manage Main Quests" quests={mainQuests} setQuests={setMainQuests} />
                <QuestEditor title="Manage Side Quests" quests={sideQuests} setQuests={setSideQuests} />
            </div>
        </div>
    );
}
